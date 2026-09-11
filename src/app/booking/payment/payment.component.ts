import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { PaymentService } from '../services/payment.service';
import { Booking } from '../models/booking';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  form!: FormGroup;

  booking?: Booking;
  ticket?: Booking;

  bookingId!: number;

  loadingBooking = true;
  processing = false;

  errorMessage = '';

  paymentFailed = false;

  // Mock test cards
  readonly SUCCESS_CARD = '4111111111111111';
  readonly FAIL_CARD = '4000000000000002';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {

    // Get booking ID from route
    this.bookingId = Number(
      this.route.snapshot.paramMap.get('bookingId')
    );

    // Payment form
    this.form = this.fb.group({

      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{16}$/)
        ]
      ],

      expiry: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
        ]
      ],

      cvv: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3}$/)
        ]
      ]

    });

    // Validate booking ID
    if (!this.bookingId) {
      this.errorMessage =
        'Invalid booking. Please start your booking again.';

      this.loadingBooking = false;
      return;
    }

    // Load booking
    this.bookingService
      .getBookingById(this.bookingId)
      .subscribe({

        next: (b) => {

          this.booking = b;

          /*
           * Booking lifecycle:
           *
           * PENDING
           *    → payment page
           *
           * CONFIRMED
           *    → payment already successful
           *
           * PAYMENT_FAILED
           *    → payment failed and seats released
           *
           * CANCELLED
           *    → confirmed booking was cancelled
           */

          if (b.status === 'CONFIRMED') {

            // Already paid successfully
            this.ticket = b;

          } else if (b.status === 'PAYMENT_FAILED') {

            // Payment already failed for this booking
            this.paymentFailed = true;

            this.errorMessage =
              'Payment failed for this booking. ' +
              'Your selected seats have been released. ' +
              'Please start a new booking.';

          } else if (b.status === 'CANCELLED') {

            // Booking was cancelled
            this.errorMessage =
              'This booking was cancelled. ' +
              'Please create a new booking.';

          }

          this.loadingBooking = false;
        },

        error: () => {

          this.errorMessage =
            'Could not load your booking. Please try again.';

          this.loadingBooking = false;
        }

      });
  }

  payNow(): void {

    // Reset previous messages
    this.errorMessage = '';
    this.paymentFailed = false;

    // Don't allow payment while another payment request is running
    if (this.processing) {
      return;
    }

    // Booking must exist
    if (!this.booking) {
      this.errorMessage =
        'Booking information is not available. Please start again.';
      return;
    }

    // Only PENDING bookings can be paid
    if (this.booking.status !== 'PENDING') {

      if (this.booking.status === 'CONFIRMED') {

        this.errorMessage =
          'This booking has already been confirmed.';

      } else if (this.booking.status === 'PAYMENT_FAILED') {

        this.paymentFailed = true;

        this.errorMessage =
          'Payment has already failed for this booking. ' +
          'Please start a new booking.';

      } else if (this.booking.status === 'CANCELLED') {

        this.errorMessage =
          'This booking has been cancelled. ' +
          'Please create a new booking.';

      } else {

        this.errorMessage =
          'This booking cannot be paid for right now.';
      }

      return;
    }

    // Validate form
    if (this.form.invalid) {

      this.form.markAllAsTouched();

      this.errorMessage =
        'Please fill valid card details.';

      return;
    }

    const cardNumber = this.form.value.cardNumber;

    /*
     * Mock payment:
     *
     * SUCCESS_CARD → success = true
     * FAIL_CARD    → success = false
     */
    if (
      cardNumber !== this.SUCCESS_CARD &&
      cardNumber !== this.FAIL_CARD
    ) {

      this.errorMessage =
        `Use a test card: ${this.SUCCESS_CARD} (success) ` +
        `or ${this.FAIL_CARD} (failure).`;

      return;
    }

    // Payment record must exist
    if (!this.booking.paymentId) {

      this.errorMessage =
        'Payment record not found for this booking.';

      return;
    }

    // Determine mock payment result
    const willSucceed =
      cardNumber === this.SUCCESS_CARD;

    this.processing = true;

    this.paymentService
      .processPayment(
        this.booking.paymentId,
        willSucceed
      )
      .subscribe({

        next: (res) => {

          this.processing = false;

          /*
           * SUCCESS SCENARIO
           *
           * Payment → SUCCESS
           * Booking → CONFIRMED
           * Seats → BOOKED
           */
          if (res.status === 'SUCCESS') {

            this.bookingService
              .getBookingById(this.bookingId)
              .subscribe({

                next: (updated) => {

                  this.ticket = updated;
                  this.booking = updated;

                },

                error: () => {

                  this.errorMessage =
                    'Payment succeeded but could not fetch your ticket. ' +
                    'Please check My Bookings.';
                }

              });

          }

          /*
           * FAILURE SCENARIO
           *
           * Payment → FAILED
           * Booking → PAYMENT_FAILED
           * Seats → AVAILABLE
           */
          else if (res.status === 'FAILED') {

            this.paymentFailed = true;

            this.booking = {
              ...this.booking!,
              status: 'PAYMENT_FAILED'
            };

            this.errorMessage =
              'Payment failed. Your selected seats have been released. ' +
              'Please start a new booking.';
          }

          /*
           * Unexpected payment response
           */
          else {

            this.errorMessage =
              'Unexpected payment response. Please check My Bookings.';
          }

        },

        error: (error) => {

          this.processing = false;

          /*
           * Backend rejected the request or another server error occurred.
           */
          this.errorMessage =
            error?.error?.message ||
            'Payment could not be processed right now. Please try again.';
        }

      });
  }

  goToMyBookings(): void {
    this.router.navigate(['/booking/my-bookings']);
  }

  searchFlightsAgain(): void {
    this.router.navigate(['/']);
  }

}