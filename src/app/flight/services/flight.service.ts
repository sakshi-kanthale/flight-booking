import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient) {}

  getAllFlights(): Observable<Flight[]> {
    return this.http
      .get<Flight[]>(BASE_URL, { headers: HEADERS })
      .pipe(
        catchError(err =>
          this.handleError(
            err,
            'Could not load flights. Please try again.'
          )
        )
      );
  }

  searchFlights(criteria: FlightSearchCriteria): Observable<Flight[]> {

    const params = new HttpParams()
      .set('departure', criteria.fromAirportCode)
      .set('arrival', criteria.toAirportCode)
      .set('date', criteria.date);

    console.log('Flight search criteria:', criteria);
    console.log('Flight search params:', params.toString());

    return this.http
      .get<Flight[]>(`${BASE_URL}/search`, {
        headers: HEADERS,
        params: params
      })
      .pipe(
        catchError(err =>
          this.handleError(
            err,
            'Could not search flights. Please try again.'
          )
        )
      );
  }

  getFlightById(flightId: number): Observable<Flight> {
    return this.http
      .get<Flight>(`${BASE_URL}/${flightId}`, {
        headers: HEADERS
      })
      .pipe(
        catchError(err =>
          this.handleError(
            err,
            'Could not load flight details. Please try again.'
          )
        )
      );
  }

  private handleError(err: any, msg: string): Observable<never> {
    console.error('Flight API error:', err);
    return throwError(() => new Error(msg));
  }
}
