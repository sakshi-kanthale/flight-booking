import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  confirmingId: number | null = null; // booking pending confirm-cancel dialog
  toast = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      this.errorMessage = 'Please log in to view your bookings.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.bookingService.getBookingsByUser(userId).subscribe({
      next: (data) => {
        this.bookings = data.sort((a, b) => b.id - a.id);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load your bookings. Please try again.';
        this.loading = false;
      }
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
    this.cancellingId = booking.id;
    this.errorMessage = '';

    this.bookingService.cancelBooking(booking.id).subscribe({
      next: (updated) => {
        this.cancellingId = null;
        const idx = this.bookings.findIndex(b => b.id === updated.id);
        if (idx > -1) this.bookings[idx] = updated;
        this.toast = `Booking #${updated.id} cancelled. Seats released.`;
        setTimeout(() => this.toast = '', 3500);
      },
      error: (err) => {
        this.cancellingId = null;
        if (err.status === 400) {
          this.errorMessage = 'This booking cannot be cancelled (already cancelled or flight departed).';
        } else {
          this.errorMessage = 'Could not cancel booking. Please try again.';
        }
      }
    });
  }

  canCancel(booking: Booking): boolean {
    return booking.status === 'CONFIRMED' || booking.status === 'PENDING';
  }
}