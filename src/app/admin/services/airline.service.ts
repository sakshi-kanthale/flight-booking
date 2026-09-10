import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Airline } from '../models/airline';

@Injectable({
  providedIn: 'root',
})
export class AirlineService {
  private url = 'https://unstylish-gents-magenta.ngrok-free.dev/api';

  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',
  });

  constructor(private http: HttpClient) {}

  createAirline(data: any): Observable<Airline> {
    const adminHeaders = this.headers.set('X-User-Id', '1');
    return this.http.post<Airline>(`${this.url}/airlines/create`, data, { headers: adminHeaders });
  }

  getAllAirlines(): Observable<Airline[]> {
    return this.http.get<Airline[]>(`${this.url}/airlines`, { headers: this.headers });
  }

  getAirlineById(airlineId: number): Observable<Airline> {
    return this.http.get<Airline>(`${this.url}/airlines/${airlineId}`, { headers: this.headers });
  }

  updateAirline(airlineId: number, data: any): Observable<Airline> {
    const adminHeaders = this.headers.set('X-User-Id', '1');
    return this.http.put<Airline>(`${this.url}/airlines/${airlineId}`, data, { headers: adminHeaders });
  }

  deleteAirline(airlineId: number): Observable<any> {
    const adminHeaders = this.headers.set('X-User-Id', '1');
    return this.http.delete<any>(`${this.url}/airlines/${airlineId}`, { headers: adminHeaders });
  }
}