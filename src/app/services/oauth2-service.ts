import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UsuarioService } from './usuario-service';

@Injectable({
  providedIn: 'root',
})
export class OAuth2Service {
  private readonly BACKEND_URL = 'http://localhost:8089';

  private usuarioService = inject(UsuarioService);

  constructor(private router: Router, private http: HttpClient) {}

  loginWithGoogle(): void {
    window.location.href = `${this.BACKEND_URL}/oauth2/authorization/google`;
  }

  handleOAuth2Callback(token: string, userId: string, userName: string, userEmail: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('tempUserId', userId);
    localStorage.setItem('tempUserName', userName);
    localStorage.setItem('tempUserEmail', userEmail);

    const cdUsuario = parseInt(userId);
    this.usuarioService.buscarPorId(cdUsuario).subscribe({
      next: () => {
        this.finalizarLogin(userId, userName, userEmail);
      },
      error: () => {
        this.router.navigate(['/completar-cadastro']);
      },
    });
  }

  completarCadastroOAuth(nome: string, email: string, nuFuncionario: string): Observable<any> {
    const numeroFuncionarios = parseInt(nuFuncionario);

    if (isNaN(numeroFuncionarios) || numeroFuncionarios < 1 || numeroFuncionarios > 10000000) {
      return throwError(() => new Error('Número de funcionários inválido'));
    }

    return this.http.post(`${this.BACKEND_URL}/api/oauth2/completar-cadastro`, {
      email: email,
      nome: nome,
      nuFuncionario: numeroFuncionarios,
    });
  }

  finalizarLogin(userId: string, userName: string, userEmail: string): void {
    const userData = {
      cdUsuario: parseInt(userId),
      nmUsuario: decodeURIComponent(userName),
      dsEmail: decodeURIComponent(userEmail),
      roleModel: [{ cdRole: 1, nmRole: 'ROLE_USER' }],
    };

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('tempUserId');
    localStorage.removeItem('tempUserName');
    localStorage.removeItem('tempUserEmail');

    this.router.navigate(['/user/dashboard']);
  }

  handleOAuth2Error(error: string): void {
    console.error('Erro OAuth2:', error);
    localStorage.removeItem('tempUserId');
    localStorage.removeItem('tempUserName');
    localStorage.removeItem('tempUserEmail');
    alert('Erro ao fazer login com Google. Por favor, tente novamente.');
    this.router.navigate(['/login']);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tempUserId');
    localStorage.removeItem('tempUserName');
    localStorage.removeItem('tempUserEmail');
    this.router.navigate(['/login']);
  }
}
