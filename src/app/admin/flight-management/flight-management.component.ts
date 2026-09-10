import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FlightAdminService } from '../services/flight-admin.service';
import { AirlineService } from '../services/airline.service';
import { AirportService } from '../services/airport.service';
import { FlightAdmin } from '../models/flight-admin';
import { Airline } from '../models/airline';
import { Airport } from '../models/airport';

@Component({
  selector: 'app-flight-management',
  templateUrl: './flight-management.component.html',
  styleUrls: ['./flight-management.component.css']
})
export class FlightManagementComponent implements OnInit {
  flights: FlightAdmin[] = [];
  airlines: Airline[] = [];
  airports: Airport[] = [];

  flightData: any = {
    airlineId: null,
    flightNumber: '',
    departureAirportCode: '',
    arrivalAirportCode: '',
    departureDate: '',
    departureTimeOnly: '',
    arrivalDate: '',
    arrivalTimeOnly: '',
    totalSeats: null,
    pricePerSeat: null,
  };

  isEditing = false;
  editingId: number | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private flightService: FlightAdminService,
    private airlineService: AirlineService,
    private airportService: AirportService
  ) {}

  ngOnInit(): void {
    this.loadFlights();
    this.loadAirlines();
    this.loadAirports();
  }

  loadFlights() {
    this.flightService.getAllFlights().subscribe({
      next: (data) => (this.flights = data),
      error: () => (this.errorMessage = 'Could not load flights.'),
    });
  }

  loadAirlines() {
    this.airlineService.getAllAirlines().subscribe({
      next: (data) => (this.airlines = data),
      error: () => {},
    });
  }

  loadAirports() {
    this.airportService.getAllAirports().subscribe({
      next: (data) => (this.airports = data),
      error: () => {},
    });
  }

  onSubmit(form: NgForm) {
    if (this.flightData.departureAirportCode === this.flightData.arrivalAirportCode) {
      this.errorMessage = 'Departure and arrival airport cannot be the same.';
      return;
    }

    const departureTime = `${this.flightData.departureDate}T${this.flightData.departureTimeOnly}:00`;
    const arrivalTime = `${this.flightData.arrivalDate}T${this.flightData.arrivalTimeOnly}:00`;

    if (new Date(arrivalTime) <= new Date(departureTime)) {
      this.errorMessage = 'Arrival time must be after departure time.';
      return;
    }

    const payload = {
      airlineId: this.flightData.airlineId,
      flightNumber: this.flightData.flightNumber,
      departureAirportCode: this.flightData.departureAirportCode,
      arrivalAirportCode: this.flightData.arrivalAirportCode,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      totalSeats: this.flightData.totalSeats,
      pricePerSeat: this.flightData.pricePerSeat,
    };

    if (this.isEditing && this.editingId) {
      this.flightService.updateFlight(this.editingId, payload).subscribe({
        next: () => {
          this.successMessage = 'Flight updated successfully.';
          this.errorMessage = '';
          this.resetForm(form);
          this.loadFlights();
        },
        error: () => (this.errorMessage = 'Could not update flight.'),
      });
    } else {
      this.flightService.createFlight(payload).subscribe({
        next: () => {
          this.successMessage = 'Flight added successfully.';
          this.errorMessage = '';
          this.resetForm(form);
          this.loadFlights();
        },
        error: () => (this.errorMessage = 'Could not add flight.'),
      });
    }
  }

  editFlight(flight: FlightAdmin) {
    this.isEditing = true;
    this.editingId = flight.flightId;
    const [depDate, depTime] = flight.departureTime.split('T');
    const [arrDate, arrTime] = flight.arrivalTime.split('T');
    this.flightData = {
      airlineId: flight.airlineId,
      flightNumber: flight.flightNumber,
      departureAirportCode: flight.departureAirportCode,
      arrivalAirportCode: flight.arrivalAirportCode,
      departureDate: depDate,
      departureTimeOnly: depTime.substring(0, 5),
      arrivalDate: arrDate,
      arrivalTimeOnly: arrTime.substring(0, 5),
      totalSeats: flight.totalSeats,
      pricePerSeat: flight.pricePerSeat,
    };
  }

  cancelEdit(form: NgForm) {
    this.resetForm(form);
  }

  deleteFlight(flightId: number) {
    if (confirm('Delete this flight?')) {
      this.flightService.deleteFlight(flightId).subscribe({
        next: () => this.loadFlights(),
        error: () => (this.errorMessage = 'Could not delete flight.'),
      });
    }
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.isEditing = false;
    this.editingId = null;
    this.flightData = {
      airlineId: null,
      flightNumber: '',
      departureAirportCode: '',
      arrivalAirportCode: '',
      departureDate: '',
      departureTimeOnly: '',
      arrivalDate: '',
      arrivalTimeOnly: '',
      totalSeats: null,
      pricePerSeat: null,
    };
  }
}