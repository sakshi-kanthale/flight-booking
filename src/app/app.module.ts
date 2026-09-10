import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { SeatSelectionComponent } from './booking/seat-selection/seat-selection.component';
import { PassengerDetailsComponent } from './booking/passenger-details/passenger-details.component';
import { PaymentComponent } from './booking/payment/payment.component';
import { MyBookingsComponent } from './booking/my-bookings/my-bookings.component';
import { AirlineManagementComponent } from './admin/airline-management/airline-management.component';
import { AirportManagementComponent } from './admin/airport-management/airport-management.component';
import { FlightManagementComponent } from './admin/flight-management/flight-management.component';
import { FlightSearchComponent } from './flight/flight-search/flight-search.component';
import { FlightDetailsComponent } from './flight/flight-details/flight-details.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    SeatSelectionComponent,
    AirlineManagementComponent,
    AirportManagementComponent,
    FlightManagementComponent,
    FlightSearchComponent,
    FlightDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    LoginComponent,
    RegisterComponent,
    PassengerDetailsComponent,
    PaymentComponent,
    MyBookingsComponent,
    AdminDashboardComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}