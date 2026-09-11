import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/booking';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {

  bookings: Booking[] = [];

  loading = true;
  errorMessage = '';

  cancellingId: number | null = null;
  confirmingId: number | null = null;

  toast = '';

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const userId = Number(localStorage.getItem('userId'));

    if (!userId) {
      this.errorMessage =
        'Please log in to view your bookings.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.bookingService.getBookingsByUser(userId).subscribe({
      next: (data) => {
        this.bookings = data.sort(
          (a, b) => b.bookingId - a.bookingId
        );

        this.loading = false;
      },

      error: () => {
        this.errorMessage =
          'Could not load your bookings. Please try again.';
        this.loading = false;
      }
    });
  }

 
payForBooking(bookingId: number): void {
  console.log('Pay Now clicked');
  console.log('Booking ID:', bookingId);

  this.router.navigate(['/booking/payment', bookingId])
    .then(success => {
      console.log('Navigation successful:', success);
      console.log('Current URL:', window.location.href);
    })
    .catch(error => {
      console.error('Navigation failed:', error);
    });
}
  askCancel(bookingId: number): void {
    this.confirmingId = bookingId;
  }

  dismissConfirm(): void {
    this.confirmingId = null;
  }

  confirmCancel(booking: Booking): void {
    this.confirmingId = null;
    this.cancellingId = booking.bookingId;
    this.errorMessage = '';

    this.bookingService
      .cancelBooking(booking.bookingId)
      .subscribe({

        next: (updated) => {
          this.cancellingId = null;

          const idx = this.bookings.findIndex(
            b => b.bookingId === updated.bookingId
          );

          if (idx > -1) {
            this.bookings[idx] = updated;
          }

          this.toast =
            `Booking #${updated.bookingId} cancelled. Seats released.`;

          setTimeout(() => {
            this.toast = '';
          }, 3500);
        },

        error: (err) => {
          this.cancellingId = null;

          if (err.status === 400) {
            this.errorMessage =
              'This booking cannot be cancelled. ' +
              'Only confirmed bookings can be cancelled.';
          } else {
            this.errorMessage =
              'Could not cancel booking. Please try again.';
          }
        }

      });
    }
  canCancel(booking: Booking): boolean {
    return booking.status === 'CONFIRMED';
  }

  canPay(booking: Booking): boolean {
    return booking.status === 'PENDING';
  }

  searchFlightsAgain(): void {
    this.router.navigate(['/']);
  }

}