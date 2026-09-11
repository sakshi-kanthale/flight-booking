import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AirportService } from '../services/airport.service';
import { Airport } from '../models/airport';

@Component({
  selector: 'app-airport-management',
  templateUrl: './airport-management.component.html',
  styleUrls: ['./airport-management.component.css']
})
export class AirportManagementComponent implements OnInit {
  airports: Airport[] = [];

  airportData = {
    airportCode: '',
    airportName: '',
    city: '',
    country: 'India',
  };

  isEditing = false;
  errorMessage = '';
  successMessage = '';

  constructor(private airportService: AirportService) {}

  ngOnInit(): void {
    this.loadAirports();
  }

  loadAirports() {
    this.airportService.getAllAirports().subscribe({
      next: (data) => (this.airports = data),
      error: () => (this.errorMessage = 'Could not load airports.'),
    });
  }

  onSubmit(form: NgForm) {
    this.airportData.country = 'India';
    this.errorMessage = '';
    this.successMessage = '';

    const codeEntered = this.airportData.airportCode.trim().toUpperCase();
    this.airportData.airportCode = codeEntered;

    // Check if this airport code already exists (only relevant when adding new, not when already editing)
    const existingAirport = this.airports.find(
      (a) => a.airportCode.toUpperCase() === codeEntered
    );

    if (!this.isEditing && existingAirport) {
      // Duplicate detected on "Add" — update instead of create
      this.airportService.updateAirport(codeEntered, this.airportData).subscribe({
        next: () => {
          this.successMessage = 'Airport with this code already existed — updated the existing airport.';
          this.resetForm(form);
          this.loadAirports();
        },
        error: () => (this.errorMessage = 'Could not update the existing airport.'),
      });
      return;
    }

    if (this.isEditing) {
      this.airportService.updateAirport(this.airportData.airportCode, this.airportData).subscribe({
        next: () => {
          this.successMessage = 'Airport updated successfully.';
          this.resetForm(form);
          this.loadAirports();
        },
        error: () => (this.errorMessage = 'Could not update airport.'),
      });
    } else {
      this.airportService.createAirport(this.airportData).subscribe({
        next: () => {
          this.successMessage = 'Airport added successfully.';
          this.resetForm(form);
          this.loadAirports();
        },
        error: () => (this.errorMessage = 'Could not add airport.'),
      });
    }
  }

  editAirport(airport: Airport) {
    this.isEditing = true;
    this.airportData = { ...airport, country: 'India' };
  }

  cancelEdit(form: NgForm) {
    this.resetForm(form);
  }

  deleteAirport(airportCode: string) {
    if (confirm('Delete this airport?')) {
      this.airportService.deleteAirport(airportCode).subscribe({
        next: () => this.loadAirports(),
        error: () => (this.errorMessage = 'Could not delete airport.'),
      });
    }
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.isEditing = false;
    this.airportData = { airportCode: '', airportName: '', city: '', country: 'India' };
  }
}