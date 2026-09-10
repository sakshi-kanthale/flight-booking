import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Airport } from '../models/airport';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  private url = 'https://unstylish-gents-magenta.ngrok-free.dev/api';

  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',
  });

  constructor(private http: HttpClient) {}

  createAirport(data: any): Observable<Airport> {
    const adminHeaders = this.headers.set('X-User-Id', '1');
    return this.http.post<Airport>(`${this.url}/airports/create`, data, { headers: adminHeaders });
  }

  getAllAirports(): Observable<Airport[]> {
    return this.http.get<Airport[]>(`${this.url}/airports`, { headers: this.headers });
  }

  getAirportByCode(airportCode: string): Observable<Airport> {
    return this.http.get<Airport>(`${this.url}/airports/${airportCode}`, { headers: this.headers });
  }

  updateAirport(airportCode: string, data: any): Observable<Airport> {
    const adminHeaders = this.headers.set('X-User-Id', '1');
    return this.http.put<Airport>(`${this.url}/airports/${airportCode}`, data, { headers: adminHeaders });
  }

  deleteAirport(airportCode: string): Observable<any> {
    const adminHeaders = this.headers.set('X-User-Id', '1');
    return this.http.delete<any>(`${this.url}/airports/${airportCode}`, { headers: adminHeaders });
  }
}