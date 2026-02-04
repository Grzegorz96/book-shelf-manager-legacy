import { Injectable } from '@angular/core';
import type { AuthCredentials } from './auth-credentials.interface';
import type { AuthResponse } from './auth-response-interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'shelfy-auth-status';
  private readonly _isAuthenticated$ = new BehaviorSubject<boolean>(this.getInitialAuthStatus());
  public readonly isAuthenticated$ = this._isAuthenticated$.asObservable();

  constructor() {
    this._isAuthenticated$.subscribe((isAuthenticated) => {
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(isAuthenticated));
    });
  }

  login(credentials: AuthCredentials): AuthResponse {
    console.log('auth service received credentials:', credentials);
    this._isAuthenticated$.next(true);

    return {
      success: true,
      message: 'Login successful',
    };
  }

  logout(): AuthResponse {
    this._isAuthenticated$.next(false);
    console.log('auth service logged out');

    return {
      success: true,
      message: 'Logout successful',
    };
  }

  private getInitialAuthStatus(): boolean {
    const savedStatus = localStorage.getItem(this.AUTH_KEY);
    return savedStatus ? JSON.parse(savedStatus) : false;
  }
}
