import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Airline } from '../models/airline';

@Injectable({
  providedIn: 'root',
})
export class AirlineService {
  private url = 'https://unstylish-gents-magenta.ngrok-free.dev';

  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',
  });

  constructor(private http: HttpClient) {}

  createAirline(data: any): Observable<Airline> {
    return this.http.post<Airline>(`${this.url}/airlines/create`, data, { headers: this.headers });
  }

  getAllAirlines(): Observable<Airline[]> {
    return this.http.get<Airline[]>(`${this.url}/airlines`, { headers: this.headers });
  }

  getAirlineById(airlineId: number): Observable<Airline> {
    return this.http.get<Airline>(`${this.url}/airlines/${airlineId}`, { headers: this.headers });
  }

  updateAirline(airlineId: number, data: any): Observable<Airline> {
    return this.http.put<Airline>(`${this.url}/airlines/${airlineId}`, data, { headers: this.headers });
  }

  deleteAirline(airlineId: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/airlines/${airlineId}`, { headers: this.headers });
  }
}