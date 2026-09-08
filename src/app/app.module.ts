import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FlightSearchComponent } from './flight/flight-search/flight-search.component';
import { FlightDetailsComponent } from './flight/flight-details/flight-details.component';
import { SeatSelectionComponent } from './booking/seat-selection/seat-selection.component';
import { BookingComponent } from './booking/models/booking/booking.component';
import { AirlineManagementComponent } from './admin/airline-management/airline-management.component';
import { AirportManagementComponent } from './admin/airport-management/airport-management.component';
import { FlightManagementComponent } from './admin/flight-management/flight-management.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FlightSearchComponent,
    FlightDetailsComponent,
    SeatSelectionComponent,
    BookingComponent,
    AirlineManagementComponent,
    AirportManagementComponent,
    FlightManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
