import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { SelectedSeat } from '../models/seat';
import { CreateBookingRequest } from '../models/booking';

@Component({
  selector: 'app-passenger-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.css']
})
export class PassengerDetailsComponent implements OnInit {
  form!: FormGroup;
  seats: SelectedSeat[] = [];
  flightId!: number;
  userId!: number;

  submitting = false;
  errorMessage = '';
  loadingProfile = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Data passed from seat-selection via router state, fallback to sessionStorage
    const nav = this.router.getCurrentNavigation();
    const state = (nav?.extras.state as any) ?? JSON.parse(sessionStorage.getItem('bookingDraft') || 'null');

    if (!state || !state.seats?.length || !state.flightId) {
      this.errorMessage = 'No seats selected. Please go back and select seats again.';
      return;
    }

    this.seats = state.seats;
    this.flightId = state.flightId;
    this.userId = Number(localStorage.getItem('userId'));

    sessionStorage.setItem('bookingDraft', JSON.stringify(state));

    this.form = this.fb.group({
      passengers: this.fb.array(this.seats.map(() => this.buildPassengerGroup()))
    });
  }

  buildPassengerGroup(): FormGroup {
    return this.fb.group({
      isMyself: [false],
      passengerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      passengerAge: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
      passengerGender: ['', Validators.required],
      passportNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,12}$/)]]
    });
  }

  get passengers(): FormArray {
    return this.form.get('passengers') as FormArray;
  }

  passengerGroup(index: number): FormGroup {
    return this.passengers.at(index) as FormGroup;
  }

  onMyselfToggle(index: number, checked: boolean): void {
    const group = this.passengerGroup(index);
    group.patchValue({ isMyself: checked });

    if (!checked) {
      group.patchValue({ passengerName: '', passengerAge: null, passengerGender: '', passportNumber: '' });
      return;
    }

    if (!this.userId) {
      this.errorMessage = 'Could not detect logged-in user. Please log in again.';
      return;
    }

    this.loadingProfile = true;
    this.bookingService.getPassengerProfile(this.userId).subscribe({
      next: (profile) => {
        group.patchValue({
          passengerName: profile.passengerName,
          passengerAge: profile.passengerAge,
          passengerGender: profile.passengerGender,
          passportNumber: profile.passportNumber
        });
        this.loadingProfile = false;
      },
      error: () => {
        this.errorMessage = 'Could not fetch your profile. Please fill details manually.';
        group.patchValue({ isMyself: false });
        this.loadingProfile = false;
      }
    });
  }

  submit(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Please fill all passenger details correctly.';
      return;
    }

    if (!this.userId) {
      this.errorMessage = 'Session expired. Please log in again.';
      return;
    }

    const passengers = this.passengers.controls.map((group, i) => ({
      seatId: this.seats[i].seatId,
      passengerName: group.value.passengerName.trim(),
      passengerAge: Number(group.value.passengerAge),
      passengerGender: group.value.passengerGender,
      passportNumber: group.value.passportNumber.trim().toUpperCase()
    }));

    const payload: CreateBookingRequest = {
      userId: this.userId,
      flightId: this.flightId,
      passengers
    };

    this.submitting = true;
    this.bookingService.createBooking(payload).subscribe({
      next: (booking) => {
        this.submitting = false;
        sessionStorage.removeItem('bookingDraft');
        this.router.navigate(['/booking/payment', booking.id]);
      },
      error: (err) => {
        this.submitting = false;
        if (err.status === 409) {
          this.errorMessage = 'One or more selected seats were just booked by someone else. Please pick seats again.';
        } else if (err.status === 400) {
          this.errorMessage = 'Some passenger details are invalid. Please check and try again.';
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot reach server. Check your connection.';
        } else {
          this.errorMessage = 'Something went wrong while creating your booking. Please try again.';
        }
      }
    });
  }
}