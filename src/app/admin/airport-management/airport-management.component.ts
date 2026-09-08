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
    country: '',
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
    if (this.isEditing) {
      this.airportService.updateAirport(this.airportData.airportCode, this.airportData).subscribe({
        next: () => {
          this.successMessage = 'Airport updated successfully.';
          this.errorMessage = '';
          this.resetForm(form);
          this.loadAirports();
        },
        error: () => (this.errorMessage = 'Could not update airport.'),
      });
    } else {
      this.airportService.createAirport(this.airportData).subscribe({
        next: () => {
          this.successMessage = 'Airport added successfully.';
          this.errorMessage = '';
          this.resetForm(form);
          this.loadAirports();
        },
        error: () => (this.errorMessage = 'Could not add airport.'),
      });
    }
  }

  editAirport(airport: Airport) {
    this.isEditing = true;
    this.airportData = { ...airport };
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
    this.airportData = { airportCode: '', airportName: '', city: '', country: '' };
  }
}