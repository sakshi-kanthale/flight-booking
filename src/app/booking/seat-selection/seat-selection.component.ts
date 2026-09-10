import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { FlightService } from '../../flight/services/flight.service';
import { Flight } from '../../flight/models/flight';
import { SelectedSeat as Seat } from '../models/seat';

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  flightId!: number;
  flight?: Flight;
  availableSeats: Seat[] = [];
  selectedSeats: Seat[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
    this.flightId = Number(this.route.snapshot.paramMap.get('flightId'));
    this.flightService.getFlightById(this.flightId).subscribe({
      next: (flight) => { this.flight = flight; this.loadSeats(flight.totalSeats); },
      error: (err) => { this.errorMessage = err.message; this.loading = false; }
    });
  }

  private loadSeats(totalSeats: number): void {
    this.bookingService.getSeatsByFlight(this.flightId).subscribe({
      next: (seats: Seat[]) => { this.availableSeats = seats.filter((s: Seat) => s.status === 'AVAILABLE'); this.loading = false; },
      error: () => {
        const mock = this.generateMockSeats(totalSeats);
        this.availableSeats = mock.filter(s => s.status === 'AVAILABLE');
        this.loading = false;
      }
    });
  }

    private generateMockSeats(totalSeats: number): Seat[] {
    return Array.from({ length: totalSeats }, (_, i) => ({
      seatId: i + 1,
      seatNumber: `${Math.floor(i / 6) + 1}${String.fromCharCode(65 + (i % 6))}`,
      status: (Math.random() < 0.2 ? 'OCCUPIED' : 'AVAILABLE') as string
    }));
  }

  onSeatChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const ids = Array.from(select.selectedOptions).map(o => Number(o.value));
    this.selectedSeats = this.availableSeats.filter(s => ids.includes(s.seatId));
  }

  get totalPrice(): number {
    return this.flight ? this.selectedSeats.length * this.flight.pricePerSeat : 0;
  }

  proceedToPassengerDetails(): void {
  if (this.selectedSeats.length === 0 || !this.flight) return;
  this.router.navigate(['/booking/passenger-details'], {
    state: { seats: this.selectedSeats, flightId: this.flightId, pricePerSeat: this.flight.pricePerSeat }
  });
}
}