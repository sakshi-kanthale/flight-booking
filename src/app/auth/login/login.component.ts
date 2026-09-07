import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
  };

  message = '';
  isError = false;

  constructor(private authService: AuthService) {}

  onLogin(form: NgForm): void {
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.message = 'Login successful';
        this.isError = false;
      },
      error: (err) => {
        this.message = "You don't have an account yet, please Register";
        this.isError = true;
      },
    });
  }
}