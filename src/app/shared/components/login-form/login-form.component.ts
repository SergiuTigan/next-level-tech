import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { UsersService } from '../../../core/services/users.service';
import CryptoJS from 'crypto-js';
import { BaseService } from '../../../core/services/base.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf, HttpClientModule
  ],
  providers: [UsersService, BaseService],
  standalone: true
})
export class LoginFormComponent implements OnInit {
  authForm!: FormGroup;
  isSignIn = true;
  submitted = false;
  userRoles = ['Reader', 'Writer'];

  constructor(private fb: FormBuilder,
              private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  // Initialize the form with validators
  private initializeForm(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    // Add sign up specific fields
    if (!this.isSignIn) {
      this.authForm.addControl('confirmPassword',
        this.fb.control('', [Validators.required, this.matchPassword()])
      );
      this.authForm.addControl('name',
        this.fb.control('', [Validators.required, Validators.minLength(2)])
      );
      this.authForm.addControl('role',
        this.fb.control('Reader', [Validators.required])
      );
    }
  }

  // Custom validator for password matching
  private matchPassword(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.parent) {
        return null;
      }

      const password = control.parent.get('password');
      const passwordValue = password ? password.value : '';

      return passwordValue === control.value ? null : { passwordMismatch: true };
    };
  }

  // Toggle between sign in and sign up modes
  toggleAuthMode(): void {
    this.isSignIn = !this.isSignIn;
    this.submitted = false;

    // Reset the form when toggling
    this.authForm.reset();

    // Reinitialize with appropriate controls
    if (this.isSignIn) {
      this.authForm.removeControl('confirmPassword');
      this.authForm.removeControl('name');
      this.authForm.removeControl('role');
    } else {
      this.authForm.addControl('confirmPassword',
        this.fb.control('', [Validators.required, this.matchPassword()])
      );
      this.authForm.addControl('name',
        this.fb.control('', [Validators.required, Validators.minLength(2)])
      );
      this.authForm.addControl('role',
        this.fb.control('Reader', [Validators.required])
      );
    }
  }

  get f() {
    return this.authForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.authForm.invalid) {
      return;
    }

    // Clone the form values
    const formData = { ...this.authForm.value };

    // Encrypt the password
    formData.password = this.encryptPassword(formData.password);

    // Also encrypt confirmPassword if it exists
    if (formData.confirmPassword) {
      formData.confirmPassword = this.encryptPassword(formData.confirmPassword);
    }

    // Send encrypted data to backend
    this.isSignIn ? this.usersService.login(formData).subscribe() : this.usersService.register(formData).subscribe();
  }

  private encryptPassword(password: string): string {
    return CryptoJS.AES.encrypt(password, 'test123').toString();
  }
}
