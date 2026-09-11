import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'https://unstylish-gents-magenta.ngrok-free.dev/api/auth';

  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post<any>(this.url + '/login', data, { headers: this.headers }).pipe(
      tap((res) => this.storeSession(res))
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(this.url + '/register', data, { headers: this.headers }).pipe(
      tap((res) => this.storeSession(res))
    );
  }

  private storeSession(res: any): void {
    if (res?.userId) {
      localStorage.setItem('userId', String(res.userId));
      localStorage.setItem('currentUser', JSON.stringify(res));
    }
  }

  getCurrentUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  getCurrentUser(): any | null {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : null;
  }

  getRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role ? String(user.role).toUpperCase() : null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
  }
}