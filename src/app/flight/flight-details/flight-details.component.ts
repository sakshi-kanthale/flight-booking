import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../services/flight.service';
import { Flight } from '../models/flight';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.css'],
})
export class FlightDetailsComponent implements OnInit {
  flight: Flight | undefined;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const flightId = Number(this.route.snapshot.paramMap.get('id'));

    this.flightService.getFlightById(flightId).subscribe({
      next: (res) => { this.flight = res; },
      error: () => { this.errorMessage = 'Could not load flight details.'; },
    });
  }

  bookNow(): void {
    if (!this.flight) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/booking/seat-selection', this.flight.flightId]);
  }
}