import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Please enter a valid email and password.';
      return;
    }

    this.submitting = true;
    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.submitting = false;
        const role = (res?.role || '').toString().toUpperCase();

        if (role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']); // user home / flight search
        }
      },
      error: (err) => {
        this.submitting = false;
        if (err.status === 401 || err.status === 404) {
          this.errorMessage = 'Invalid email or password.';
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot reach server. Check your connection.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }
}