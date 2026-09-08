import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'https://unstylish-gents-magenta.ngrok-free.dev/auth';

  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',
  });

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post<any>(this.url + '/login', data, { headers: this.headers });
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(this.url + '/register', data, { headers: this.headers });
  }
}