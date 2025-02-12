// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  // You can add other response properties if needed.
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/account'; // Replace with your API endpoint
  private _isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        this._isAuthenticated.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this._isAuthenticated.next(false);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  get authStatus$(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }
}
