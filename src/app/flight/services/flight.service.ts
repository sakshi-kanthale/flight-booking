import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight } from '../models/flight';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private url = 'YOUR_NGROK_URL_HERE';

  constructor(private http: HttpClient) {}

  searchFlights(depAirport: string, arrAirport: string, date: string): Observable<Flight[]> {
    return this.http.get<Flight[]>(
      `${this.url}/flights/search?depAirport=${depAirport}&arrAirport=${arrAirport}&date=${date}`
    );
  }

  getFlightById(flightId: number): Observable<Flight> {
    return this.http.get<Flight>(`${this.url}/flights/${flightId}`);
  }
}