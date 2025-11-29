import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Usuario } from '../shared/models/Usuario';
import { Role } from '../shared/models/Role';
import { environment } from '../environments/environment';

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
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, {
      dsEmail: email,
      dsSenha: senha,
    }).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);

          const usuario = this.normalizeUser(
            response.usuarioDTO || response.usuario
          );

          localStorage.setItem('user', JSON.stringify(usuario));

          this.isAuthenticated.set(true);
          this.currentUser.set(usuario);

          setTimeout(() => this.redirectBasedOnRole(), 0);
        }
      }),
      catchError((error) => {
        if (error.status === 401) {
          return throwError(() => new Error('Email ou senha inválidos'));
        }
        return throwError(
          () => new Error(error.error?.message || 'Erro ao fazer login')
        );
      })
    );
  }

  private normalizeUser(userData: any): any {
    if (!userData) return userData;

    if (userData.roles && Array.isArray(userData.roles)) {
      const roleModels: Role[] = userData.roles.map(
        (roleString: string, index: number) => ({
          cdRole: index + 1,
          nmRole: roleString,
        })
      );

      return {
        ...userData,
        roleModel: roleModels,
      };
    }

    return userData;
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
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        return this.normalizeUser(userData);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.hasToken() && this.isAuthenticated();
  }

  getUserRoles(): string[] {
    const user = this.currentUser();
    if (!user || !user.roleModel) return [];
    return user.roleModel.map((r) => r.nmRole);
  }

  getMainRole(): string | null {
    const roles = this.getUserRoles();
    return roles.length > 0 ? roles[0] : null;
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.some((r) => roles.includes(r));
  }

  redirectBasedOnRole(): void {
    const role = this.getMainRole();

    switch (role) {
      case 'ROLE_ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'ROLE_AGENTE':
        this.router.navigate(['/agente/dashboard']);
        break;
      case 'ROLE_USER':
      default:
        this.router.navigate(['/user/dashboard']);
        break;
    }
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  isAgente(): boolean {
    return this.hasRole('ROLE_AGENTE');
  }

  isUser(): boolean {
    return this.hasRole('ROLE_USER');
  }
}
