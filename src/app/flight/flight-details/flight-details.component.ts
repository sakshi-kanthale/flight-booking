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

    const flightId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!flightId) {
      this.errorMessage = 'Invalid flight ID.';
      return;
    }

    console.log('Loading flight details for ID:', flightId);

    this.flightService.getFlightById(flightId).subscribe({

      next: (res: Flight) => {
        console.log('Flight details response:', res);
        this.flight = res;
      },

      error: (error) => {
        console.error('Could not load flight details:', error);
        this.errorMessage = 'Could not load flight details.';
      }

    });
  }

  bookNow(): void {

    if (!this.flight) {
      console.error('No flight selected.');
      return;
    }

    console.log('Book Now clicked');
    console.log('Flight ID:', this.flight.flightId);

    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.log('User is not logged in. Redirecting to login.');

      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate([
      '/booking/seat-selection',
      this.flight.flightId
    ]);
  }
}