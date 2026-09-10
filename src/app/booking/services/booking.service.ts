import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, CreateBookingRequest } from '../models/booking';
import { PassengerProfile, SelectedSeat as Seat } from '../models/seat';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookingUrl = `${environment.apiUrl}/bookings`;
  private passengerUrl = `${environment.apiUrl}/passenger`;

  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });

  constructor(private http: HttpClient) {}

  createBooking(payload: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.bookingUrl, payload, { headers: this.headers });
  }

  getSeatsByFlight(flightId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${environment.apiUrl}/flights/${flightId}/seats`, { headers: this.headers });
  }

  getBookingById(bookingId: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.bookingUrl}/${bookingId}`, { headers: this.headers });
  }

  getBookingsByUser(userId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.bookingUrl}/user/${userId}`, { headers: this.headers });
  }

  cancelBooking(bookingId: number): Observable<Booking> {
    return this.http.put<Booking>(`${this.bookingUrl}/${bookingId}/cancel`, {}, { headers: this.headers });
  }

  getPassengerProfile(userId: number): Observable<PassengerProfile> {
    return this.http.get<PassengerProfile>(`${this.passengerUrl}/profile/${userId}`, { headers: this.headers });
  }
}