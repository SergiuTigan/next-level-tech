import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { NgClass, NgIf } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import cryptoJS from 'crypto-js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    RouterLink
  ],
  standalone: true
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  submitted = false;
  loading = false;
  currentUser: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UsersService,
    private snackbarService: SnackbarService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.initForm();
  }

  // Initialize form with current user data
  initForm(): void {
    this.profileForm = this.formBuilder.group({
      email: [{ value: this.currentUser?.email || '', disabled: true }],
      firstName: [this.currentUser?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName: [this.currentUser?.lastName || '', [Validators.required, Validators.minLength(2)]],
      password: [''],
      newPassword: ['', [Validators.minLength(8)]],
      confirmNewPassword: ['']
    }, {
      validators: [this.passwordMatchValidator, this.requirePasswordValidator]
    });
  }

  // Custom validator to check if new passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmNewPassword');

    // If new password is provided, confirm password must match
    if (newPassword?.value && newPassword.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  // Custom validator to ensure current password is provided if changing password
  requirePasswordValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const password = control.get('password');

    // If new password is provided but current password is not
    if (newPassword?.value && !password?.value) {
      password?.setErrors({ required: true });
      return { passwordRequired: true };
    }

    return null;
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.profileForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = { ...this.profileForm.getRawValue() };

    if (!formData.newPassword) {
      delete formData.password;
      delete formData.newPassword;
      delete formData.confirmNewPassword;
    }

    this.updateProfile(formData);
  }

  private updateProfile(formData: any): void {

    if (formData.password) {
      formData.password = cryptoJS.SHA256(formData.password).toString();
      formData.newPassword = cryptoJS.SHA256(formData.newPassword).toString();
      delete formData.confirmNewPassword;
    }

    this.userService.update(this.currentUser._id, formData)
      .pipe(
        first(),
        finalize(() => this.loading = false)
      )
      .subscribe(
        updatedUser => {
          // Update the stored user if successful
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
          this.snackbarService.success('Profile updated successfully');
          this.router.navigate(['../', { relativeTo: this.route }]).then();
        },
        (error: any) => {
          this.snackbarService.error('Failed to update profile. Please try again.');
        }
      );
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route }).then();
  }
}
