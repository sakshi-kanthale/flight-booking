import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  adminName = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const role = (user?.role || '').toString().toUpperCase();

    if (role !== 'ADMIN') {
      this.router.navigate(['/login']);
      return;
    }
    this.adminName = user?.fullName || 'Admin';
  }

  goTo(section: string): void {
    this.router.navigate(['/admin/' + section]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}