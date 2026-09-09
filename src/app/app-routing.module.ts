import { SeatSelectionComponent } from './booking/seat-selection/seat-selection.component';
import { AirlineManagementComponent } from './admin/airline-management/airline-management.component';
import { AirportManagementComponent } from './admin/airport-management/airport-management.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FlightSearchComponent } from './flight/flight-search/flight-search.component';
import { FlightManagementComponent } from './admin/flight-management/flight-management.component';
import { FlightDetailsComponent } from './flight/flight-details/flight-details.component';
import { PaymentComponent } from './booking/payment/payment.component';
import { PassengerDetailsComponent } from './booking/passenger-details/passenger-details.component';
import { MyBookingsComponent } from './booking/my-bookings/my-bookings.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'flight-search', component: FlightSearchComponent },
  { path: 'flight-details/:id', component: FlightDetailsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'airport-management', component: AirportManagementComponent },
  { path: 'airline-management', component: AirlineManagementComponent },
  { path: 'flight-management', component: FlightManagementComponent },
  { path: 'booking/seat-selection/:flightId', component: SeatSelectionComponent },
  { path: 'booking/passenger-details/:flightId', component: PassengerDetailsComponent },
  { path: 'booking/payment/:flightId', component: PaymentComponent },
  { path: 'booking/passenger-details', component: PassengerDetailsComponent }
  { path: 'booking/payment/:bookingId', component: PaymentComponent }
  { path: 'booking/my-bookings', component: MyBookingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}