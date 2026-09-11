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
   bookingId!: number;
 
   loadingBooking = true;
   processing = false;
   errorMessage = '';
   ticket?: Booking;
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
     this.bookingId = Number(
       this.route.snapshot.paramMap.get('bookingId')
     );
 
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
 
     if (!this.bookingId) {
       this.errorMessage =
         'Invalid booking. Please start your booking again.';
       this.loadingBooking = false;
       return;
     }
 
     this.bookingService.getBookingById(this.bookingId).subscribe({
       next: (b) => {
         if (b.status === 'CONFIRMED') {
           this.ticket = b;
         } else if (b.status === 'CANCELLED') {
           this.errorMessage =
             'This booking was cancelled. Please create a new booking.';
         }
 
         this.booking = b;
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
     this.errorMessage = '';
     this.paymentFailed = false;
 
     if (this.form.invalid) {
       this.form.markAllAsTouched();
       this.errorMessage = 'Please fill valid card details.';
       return;
     }
 
     const cardNumber = this.form.value.cardNumber;
 
     // Mock payment: card number determines success/failure.
     if (
       cardNumber !== this.SUCCESS_CARD &&
       cardNumber !== this.FAIL_CARD
     ) {
       this.errorMessage =
         `Use a test card: ${this.SUCCESS_CARD} (success) ` +
         `or ${this.FAIL_CARD} (failure).`;
       return;
     }
 
     if (!this.booking?.paymentId) {
       this.errorMessage =
         'Payment record not found for this booking.';
       return;
     }
 
     const willSucceed =
       cardNumber === this.SUCCESS_CARD;
 
     this.processing = true;
 
     this.paymentService
       .processPayment(this.booking.paymentId, willSucceed)
       .subscribe({
         next: (res) => {
           this.processing = false;
 
           // Backend PaymentResponse uses status,
           // not a boolean success field.
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
                     'Payment succeeded but could not fetch ticket. ' +
                     'Check My Bookings.';
                 }
               });
           } else {
             this.paymentFailed = true;
             this.errorMessage =
               'Payment failed. Please try again.';
           }
         },
 
         error: () => {
           this.processing = false;
           this.errorMessage =
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