import { Injectable, inject } from '@angular/core';
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
  private authService = inject(AuthService);
  private router = inject(Router);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const tokenFromStorage = localStorage.getItem('token');

    // Clona a requisição e adiciona headers necessários
    let clonedRequest = request;
    const finalToken = token || tokenFromStorage;

    if (finalToken) {
      // Para FormData, não define Content-Type (deixa o navegador definir com boundary)
      if (request.body instanceof FormData) {
        clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${finalToken}`,
            // Não define Content-Type para FormData - o navegador faz isso automaticamente
          },
        });
      } else {
        clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${finalToken}`,
            'Content-Type': request.headers.get('Content-Type') || 'application/json',
          },
        });
      }
    } else {
      // Mesmo sem token, garante que Content-Type está definido se necessário
      const contentType = request.headers.get('Content-Type');
      if (!contentType && request.body && typeof request.body === 'object' && !(request.body instanceof FormData)) {
        clonedRequest = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
          },
        });
      }
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // 401 = Não autenticado (token inválido ou ausente) - faz logout
        // 403 = Autenticado mas sem permissão - apenas deixa o erro propagar
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}