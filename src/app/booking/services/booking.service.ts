import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, CreateBookingRequest } from '../models/booking';
import { PassengerProfile, SelectedSeat as Seat } from '../models/seat';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookingUrl = `${environment.apiUrl}/api/bookings`;
  private passengerUrl = `${environment.apiUrl}/api/passenger`;

  constructor(private http: HttpClient) {}

  createBooking(payload: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.bookingUrl, payload);
  }

  getSeatsByFlight(flightId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${environment.apiUrl}/api/flights/${flightId}/seats`);
  }

  getBookingById(bookingId: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.bookingUrl}/${bookingId}`);
  }

  getBookingsByUser(userId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.bookingUrl}/user/${userId}`);
  }

  cancelBooking(bookingId: number): Observable<Booking> {
    return this.http.put<Booking>(`${this.bookingUrl}/${bookingId}/cancel`, {});
  }

  getPassengerProfile(userId: number): Observable<PassengerProfile> {
    return this.http.get<PassengerProfile>(`${this.passengerUrl}/profile/${userId}`);
  }
}