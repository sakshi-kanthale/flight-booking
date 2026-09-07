import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  message = '';
  isError = false;

  constructor(private authService: AuthService) {}

  onRegister(form: NgForm): void {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.message = 'Passwords do not match';
      this.isError = true;
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        this.message = 'Registration successful';
        this.isError = false;
      },
      error: (err) => {
        this.message = 'Registration failed, please try again';
        this.isError = true;
      },
    });
  }
}