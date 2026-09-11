 import { Component, OnInit } from '@angular/core';
 import { ActivatedRoute, Router } from '@angular/router';
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
 
   constructor(
     private route: ActivatedRoute,
     private flightService: FlightService,
     private router: Router
   ) {}
 
   ngOnInit(): void {
 
     const flightId = Number(
       this.route.snapshot.paramMap.get('id')
     );
 
     if (!flightId) {
       this.errorMessage = 'Invalid flight ID.';
       return;
     }
 
     console.log('Loading flight details for ID:', flightId);
 
     this.flightService.getFlightById(flightId).subscribe({
 
       next: (res: Flight) => {
         console.log('Flight details response:', res);
         this.flight = res;
       },
 
       error: (error) => {
         console.error('Could not load flight details:', error);
         this.errorMessage = 'Could not load flight details.';
       }
 
     });
   }
 
   getDuration(): string {
     if (!this.flight) {
       return '';
     }
 
     const departure = new Date(this.flight.departureTime);
     const arrival = new Date(this.flight.arrivalTime);
 
     const difference =
       arrival.getTime() - departure.getTime();
 
     const hours = Math.floor(
       difference / (1000 * 60 * 60)
     );
 
     const minutes = Math.floor(
       (difference % (1000 * 60 * 60)) / (1000 * 60)
     );
 
     if (minutes === 0) {
       return `${hours}h`;
     }
 
     return `${hours}h ${minutes}m`;
   }
 
   bookNow(): void {
 
     if (!this.flight) {
       console.error('No flight selected.');
       return;
     }
 
     console.log('Book Now clicked');
     console.log('Flight ID:', this.flight.flightId);
 
     const userId = localStorage.getItem('userId');
 
     if (!userId) {
       console.log('User is not logged in. Redirecting to login.');
 
       this.router.navigate(['/login']);
       return;
     }
 
     this.router.navigate([
       '/booking/seat-selection',
       this.flight.flightId
     ]);
   }
 }
