import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AirlineService } from '../services/airline.service';
import { Airline } from '../models/airline';

@Component({
  selector: 'app-airline-management',
  templateUrl: './airline-management.component.html',
  styleUrls: ['./airline-management.component.css'],
})
export class AirlineManagementComponent implements OnInit {
  airlines: Airline[] = [];

  airlineData = {
    airlineCode: '',
    airlineName: '',
    logoPath: '',
  };

  isEditing = false;
  editingId: number | null = null;

  errorMessage = '';
  successMessage = '';

  constructor(private airlineService: AirlineService) {}

  ngOnInit(): void {
    this.loadAirlines();
  }

  loadAirlines(): void {
    this.airlineService.getAllAirlines().subscribe({
      next: (res) => {
        this.airlines = res;
      },
      error: (err) => {
        this.errorMessage = 'Could not load airlines.';
      },
    });
  }

  onSubmit(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditing && this.editingId !== null) {
      this.airlineService.updateAirline(this.editingId, this.airlineData).subscribe({
        next: () => {
          this.successMessage = 'Airline updated successfully.';
          this.loadAirlines();
          this.cancelEdit();
        },
        error: () => {
          this.errorMessage = 'Failed to update airline.';
        },
      });
    } else {
      this.airlineService.createAirline(this.airlineData).subscribe({
        next: () => {
          this.successMessage = 'Airline added successfully.';
          this.loadAirlines();
          form.resetForm();
        },
        error: () => {
          this.errorMessage = 'Failed to add airline.';
        },
      });
    }
  }

  editAirline(airline: Airline): void {
    this.isEditing = true;
    this.editingId = airline.airlineId;
    this.airlineData = {
      airlineCode: airline.airlineCode,
      airlineName: airline.airlineName,
      logoPath: airline.logoPath,
    };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingId = null;
    this.airlineData = { airlineCode: '', airlineName: '', logoPath: '' };
  }

  deleteAirline(airlineId: number): void {
    if (!confirm('Are you sure you want to delete this airline?')) {
      return;
    }

    this.airlineService.deleteAirline(airlineId).subscribe({
      next: () => {
        this.successMessage = 'Airline deleted successfully.';
        this.loadAirlines();
      },
      error: () => {
        this.errorMessage = 'Failed to delete airline.';
      },
    });
  }
}