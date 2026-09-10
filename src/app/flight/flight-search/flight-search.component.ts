import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService, FlightSearchCriteria } from '../services/flight.service';
import { Flight } from '../models/flight';
import { AirportService } from '../../admin/services/airport.service';
import { Airport } from '../../admin/models/airport';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {
  searchCriteria: FlightSearchCriteria = { fromAirportCode: '', toAirportCode: '', date: '' };
  airports: Airport[] = [];
  flights: Flight[] = [];
  loading = false;
  searched = false;
  errorMessage = '';

  constructor(
    private flightService: FlightService,
    private airportService: AirportService,
    private authService: AuthService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return !!this.authService.getCurrentUserId();
  }

  get currentUserName(): string {
    const u = this.authService.getCurrentUser();
    return u?.fullName || 'Account';
  }

  ngOnInit(): void {
    this.airportService.getAllAirports().subscribe({
      next: (airports) => this.airports = airports,
      error: (err) => this.errorMessage = err.message
    });
  }

  onSearch(form: NgForm): void {
    if (form.invalid) return;
    if (this.searchCriteria.fromAirportCode === this.searchCriteria.toAirportCode) {
      this.errorMessage = 'Departure and arrival airport cannot be the same.';
      return;
    }
    this.loading = true;
    this.searched = true;
    this.errorMessage = '';
    this.flightService.searchFlights(this.searchCriteria).subscribe({
      next: (results) => { this.flights = results; this.loading = false; },
      error: (err) => { this.errorMessage = err.message; this.loading = false; }
    });
  }

  viewDetails(flight: Flight): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { redirectTo: '/flight-details/' + flight.flightId } });
      return;
    }
    this.router.navigate(['/flight-details', flight.flightId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/flight-search']);
  }
}