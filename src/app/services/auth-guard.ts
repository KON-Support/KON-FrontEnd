import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.authService.getToken();
    const isAuthenticated = this.authService.isLoggedIn();

    console.log(' AuthGuard ativado');
    console.log(' Tentando acessar:', state.url);
    console.log(' Token existe:', !!token);
    console.log(' Autenticado:', isAuthenticated);

    if (isAuthenticated) {
      return true;
    }

    console.warn(' Acesso negado - redirecionando para login');
    this.router.navigate(['/login']);
    return false;
  }
}