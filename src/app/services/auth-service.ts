import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { Usuario } from '../shared/models/Usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient;
  private router: Router;
  
  isAuthenticated = signal<boolean>(this.hasToken());
  currentUser = signal<Usuario | null>(this.getStoredUser());

  constructor(http: HttpClient, router: Router) {
    this.http = http;
    this.router = router;
  }

  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>('http://localhost:8089/', {
      email,
      senha,
    }).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.usuario));
          this.isAuthenticated.set(true);
          this.currentUser.set(response.usuario);
        }
      }),
      catchError((error) => {
        console.error('Erro no login:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getStoredUser(): Usuario | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}