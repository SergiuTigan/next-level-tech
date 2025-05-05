import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {ContactService} from '../../services/contact.service';
import {NgClass, NgIf} from '@angular/common';
import {RecaptchaModule} from "ng-recaptcha";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    RecaptchaModule
  ],
  standalone: true
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  errorMessage: string | null = null;
  captchaToken: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.createForm();
  }

  ngOnInit(): void {
  }

  /**
   * Create contact form with validation
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  /**
   * Get form controls for easier access in template
   */
  get f() {
    return this.contactForm.controls;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    // Don't submit if already submitting
    if (this.isSubmitting) return;

    // Mark all fields as touched to trigger validation
    Object.keys(this.f).forEach(key => {
      const control = this.f[key];
      control.markAsTouched();
    });

    // Don't proceed if the form is invalid
    if (this.contactForm.invalid) return;

    // Reset status
    this.errorMessage = null;
    this.submitSuccess = false;
    this.isSubmitting = true;

    // Submit form
    this.contactService.submitContactForm({...this.contactForm.value, captchaToken: this.captchaToken})
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.submitSuccess = true;
          this.contactForm.reset();
          // Reset touched state to clear validation errors
          Object.keys(this.f).forEach(key => {
            this.f[key].setErrors(null);
            this.f[key].markAsUntouched();
          });
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
  }

  /**
   * Reset form and status
   */
  resetForm(): void {
    this.contactForm.reset();
    this.submitSuccess = false;
    this.errorMessage = null;
    // Reset touched state to clear validation errors
    Object.keys(this.f).forEach(key => {
      this.f[key].setErrors(null);
      this.f[key].markAsUntouched();
    });
  }

  onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
  }

}
