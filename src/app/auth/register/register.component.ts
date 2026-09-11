import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../models/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  step = 1;

  accountForm: FormGroup;
  passengerForm: FormGroup;

  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.accountForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.passengerForm = this.fb.group({
      passengerName: ['', [Validators.required, Validators.minLength(2)]],
      age: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', Validators.required],
      passportNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,12}$/)]]
    });
  }

  goToStep2(): void {
    this.errorMessage = '';
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.errorMessage = 'Please fill all account details correctly.';
      return;
    }
    this.passengerForm.patchValue({ passengerName: this.accountForm.value.fullName });
    this.step = 2;
  }

  backToStep1(): void {
    this.step = 1;
  }

  completeRegistration(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.passengerForm.invalid) {
      this.passengerForm.markAllAsTouched();
      this.errorMessage = 'Please fill all passenger details correctly.';
      return;
    }

    const payload = {
      fullName: this.accountForm.value.fullName,
      mobileNumber: this.accountForm.value.mobileNumber,
      email: this.accountForm.value.email,
      password: this.accountForm.value.password,
      passengerProfile: {
        passengerName: this.passengerForm.value.passengerName,
        passengerAge: Number(this.passengerForm.value.age),
        passengerGender: this.passengerForm.value.gender,
        passportNumber: this.passengerForm.value.passportNumber.trim().toUpperCase(),
      },
    };

    this.submitting = true;
    this.authService.register(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (err) => {
        this.submitting = false;
        if (err.status === 409) {
          this.errorMessage = 'An account with this email already exists.';
        } else if (err.status === 400) {
          this.errorMessage = 'Some details are invalid. Please check and try again.';
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot reach server. Check your connection.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
}