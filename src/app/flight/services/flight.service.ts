import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Flight } from '../models/flight';

const BASE_URL = 'https://unstylish-gents-magenta.ngrok-free.dev/api/flights';
const HEADERS = new HttpHeaders({
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json'
});

export class FlightSearchCriteria {
  fromAirportCode!: string;
  toAirportCode!: string;
  date!: string;
}

@Injectable({ providedIn: 'root' })
export class FlightService {
  constructor(private http: HttpClient) {}

  getAllFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${BASE_URL}/`, { headers: HEADERS })
      .pipe(catchError(err => this.handleError(err, 'Could not load flights. Please try again.')));
  }

  searchFlights(criteria: FlightSearchCriteria): Observable<Flight[]> {
    return this.getAllFlights().pipe(
      map(flights => flights.filter(f =>
        f.depAirport === criteria.fromAirportCode &&
        f.arrAirport === criteria.toAirportCode &&
        f.departureTime.startsWith(criteria.date) &&
        f.status === 'SCHEDULED'
      ))
    );
  }

  getFlightById(flightId: number): Observable<Flight> {
    return this.http.get<Flight>(`${BASE_URL}/${flightId}`, { headers: HEADERS })
      .pipe(catchError(err => this.handleError(err, 'Could not load flight details. Please try again.')));
  }

  private handleError(err: any, msg: string) {
    console.error('Flight API error:', err);
    return throwError(() => new Error(msg));
  }
}