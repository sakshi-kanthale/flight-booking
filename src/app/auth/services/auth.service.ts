import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'NGROK_URL_HERE';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post<any>(this.url + '/login', data);
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(this.url + '/register', data);
  }
}