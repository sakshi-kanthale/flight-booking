import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../services/flight.service';
import { Flight } from '../models/flight';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
})
export class FlightSearchComponent {
  searchData = {
    depAirport: '',
    arrAirport: '',
    date: '',
  };

  flights: Flight[] = [];
  errorMessage = '';

  constructor(private flightService: FlightService, private router: Router) {}

  onSearch(form: NgForm): void {
    this.errorMessage = '';
    this.flights = [];

    this.flightService
      .searchFlights(this.searchData.depAirport, this.searchData.arrAirport, this.searchData.date)
      .subscribe({
        next: (res) => {
          this.flights = res;
          if (res.length === 0) {
            this.errorMessage = 'No flights found for this search.';
          }
        },
        error: (err) => {
          this.errorMessage = 'Something went wrong. Please try again.';
        },
      });
  }

  viewDetails(flightId: number): void {
    this.router.navigate(['/flight-details', flightId]);
  }
}