import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlightAdmin } from '../models/flight-admin';

@Injectable({
  providedIn: 'root',
})
export class FlightAdminService {
  private url = 'https://unstylish-gents-magenta.ngrok-free.dev/api/flights';

  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',
  });

  constructor(private http: HttpClient) {}

  createFlight(data: any): Observable<FlightAdmin> {
    return this.http.post<FlightAdmin>(`${this.url}/create`, data, { headers: this.headers });
  }

  getAllFlights(): Observable<FlightAdmin[]> {
    return this.http.get<FlightAdmin[]>(this.url, { headers: this.headers });
  }

  getFlightById(flightId: number): Observable<FlightAdmin> {
    return this.http.get<FlightAdmin>(`${this.url}/${flightId}`, { headers: this.headers });
  }

  updateFlight(flightId: number, data: any): Observable<FlightAdmin> {
    return this.http.put<FlightAdmin>(`${this.url}/${flightId}`, data, { headers: this.headers });
  }

  deleteFlight(flightId: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${flightId}`, { headers: this.headers });
  }
}