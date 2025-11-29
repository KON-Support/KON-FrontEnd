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

    let clonedRequest = request;
    const finalToken = token || tokenFromStorage;

    if (finalToken) {
      if (request.body instanceof FormData) {
        clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${finalToken}`,
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
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }

}