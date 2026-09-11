import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { FlightService } from '../../flight/services/flight.service';
import { Flight } from '../../flight/models/flight';
import { SelectedSeat as Seat } from '../models/seat';

interface SeatRow {
  row: number;
  left: Seat[];
  right: Seat[];
}

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  flightId!: number;
  flight?: Flight;
  availableSeats: Seat[] = [];
  allSeats: Seat[] = [];
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
      next: (flight) => { this.flight = flight; this.loadSeats(); },
      error: (err) => { this.errorMessage = err.message; this.loading = false; }
    });
  }

  private loadSeats(): void {
    this.bookingService.getSeatsByFlight(this.flightId).subscribe({
      next: (seats: Seat[]) => {
        this.allSeats = seats;
        this.availableSeats = seats.filter((s: Seat) => s.status === 'AVAILABLE');
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Could not load seats. Please refresh and try again.';
        this.loading = false;
        console.error('Seats API error:', err);
      }
    });
  }

  // Groups seats into rows, splitting left/right for the aisle gap.
  get seatRows(): SeatRow[] {
    const rowsMap = new Map<number, Seat[]>();
    for (const seat of this.allSeats) {
      const match = seat.seatNumber.match(/^(\d+)([A-Za-z]+)$/);
      if (!match) continue;
      const rowNum = Number(match[1]);
      if (!rowsMap.has(rowNum)) rowsMap.set(rowNum, []);
      rowsMap.get(rowNum)!.push(seat);
    }
    return Array.from(rowsMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([row, seats]) => {
        const sorted = [...seats].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
        const mid = Math.ceil(sorted.length / 2);
        return { row, left: sorted.slice(0, mid), right: sorted.slice(mid) };
      });
  }

  isOccupied(seat: Seat): boolean {
    return seat.status !== 'AVAILABLE';
  }

  isSelected(seat: Seat): boolean {
    return this.selectedSeats.some(s => s.seatId === seat.seatId);
  }

  toggleSeat(seat: Seat): void {
    if (this.isOccupied(seat)) return;
    const idx = this.selectedSeats.findIndex(s => s.seatId === seat.seatId);
    if (idx > -1) {
      this.selectedSeats = this.selectedSeats.filter(s => s.seatId !== seat.seatId);
    } else {
      this.selectedSeats = [...this.selectedSeats, seat];
    }
  }

  get totalPrice(): number {
    return this.flight ? this.selectedSeats.length * this.flight.pricePerSeat : 0;
  }

  get selectedSeatNumbers(): string {
    return this.selectedSeats.map(s => s.seatNumber).join(', ');
  }

  proceedToPassengerDetails(): void {
    if (this.selectedSeats.length === 0 || !this.flight) return;
    this.router.navigate(['/booking/passenger-details'], {
      state: { seats: this.selectedSeats, flightId: this.flightId, pricePerSeat: this.flight.pricePerSeat }
    });
  }
}