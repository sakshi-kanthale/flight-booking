import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private url = 'https://unstylish-gents-magenta.ngrok-free.dev/api/payments';

  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });

  constructor(private http: HttpClient) {}

  processPayment(paymentId: number, success: boolean): Observable<any> {
    return this.http.post<any>(
      `${this.url}/${paymentId}/process`,
      { success },
      { headers: this.headers }
    );
  }
}