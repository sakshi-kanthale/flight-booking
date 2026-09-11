import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/booking';
import { FlightService } from '../../flight/services/flight.service';
import { Flight } from '../../flight/models/flight';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {

  bookings: Booking[] = [];
  flightsMap: { [flightId: number]: Flight } = {};

  loading = true;
  errorMessage = '';

  cancellingId: number | null = null;
  confirmingId: number | null = null;

  toast = '';

  constructor(
    private bookingService: BookingService,
    private flightService: FlightService,
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
        this.loadFlightsForBookings();
      },

      error: () => {
        this.errorMessage =
          'Could not load your bookings. Please try again.';
        this.loading = false;
      }
    });
  }

  // Fetches flight details (route, times) for each unique flightId among the bookings.
  // If this fails, booking cards still render fine — just without the route section.
  private loadFlightsForBookings(): void {
    const uniqueFlightIds = Array.from(new Set(this.bookings.map(b => b.flightId)));
    if (uniqueFlightIds.length === 0) return;

    const requests = uniqueFlightIds.map(id => this.flightService.getFlightById(id));
    forkJoin(requests).subscribe({
      next: (flights) => {
        flights.forEach((flight, idx) => {
          this.flightsMap[uniqueFlightIds[idx]] = flight;
        });
      },
      error: () => {
        // Silently ignore — route section just won't show for affected bookings.
      }
    });
  }

  getDuration(flight: Flight): string {
    const dep = new Date(flight.departureTime).getTime();
    const arr = new Date(flight.arrivalTime).getTime();
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
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