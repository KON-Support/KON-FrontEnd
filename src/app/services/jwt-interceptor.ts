import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(' Token adicionado ao header');
    } else {
      console.warn(' Nenhum token encontrado');
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(' Erro HTTP:', error.status, error.statusText);
        console.error('Mensagem:', error.message);

        if (error.status === 401 || error.status === 403) {
          console.warn('Acesso negado! Token inválido ou expirado');
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}