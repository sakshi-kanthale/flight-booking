import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private flightService: FlightService) {}

  ngOnInit(): void {
    const flightId = Number(this.route.snapshot.paramMap.get('id'));

    this.flightService.getFlightById(flightId).subscribe({
      next: (res) => {
        this.flight = res;
      },
      error: (err) => {
        this.errorMessage = 'Could not load flight details.';
      },
    });
  }
}