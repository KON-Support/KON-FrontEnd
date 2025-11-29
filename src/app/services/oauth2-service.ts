import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class OAuth2Service {

  private readonly BACKEND_URL = environment.apiUrl.replace('/api', '');

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  loginWithGoogle(): void {
    const oauthUrl = `${this.BACKEND_URL}/oauth2/authorization/google`;

    if (!oauthUrl || oauthUrl === '/oauth2/authorization/google') {
      console.error('ERRO: URL do OAuth2 está inválida!');
      alert('Erro de configuração: URL do backend não encontrada. Verifique as configurações do ambiente.');
      return;
    }

    try {
      new URL(oauthUrl);
    } catch (error) {
      console.error('ERRO: URL do OAuth2 não é uma URL válida:', oauthUrl);
      alert('Erro: URL do backend está malformada. Verifique as configurações.');
      return;
    }

    try {
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('Erro ao redirecionar para OAuth2:', error);
      alert('Erro ao iniciar login com Google. Verifique o console para mais detalhes.');
    }
  }

  handleOAuth2Callback(
    token: string,
    userId: string,
    userName: string,
    userEmail: string,
    userRoles: string = ''
  ): void {
    localStorage.setItem('token', token);

    this.finalizarLogin(userId, userName, userEmail, userRoles);
  }

  verificarPerfilCompleto(userId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/usuario/${userId}/profile-status`);
  }

  completarCadastroOAuth(
    nome: string,
    email: string,
    nuFuncionario: string
  ): Observable<any> {
    const num = Number(nuFuncionario);

    if (isNaN(num) || num < 1 || num > 10000000) {
      return throwError(() => new Error('Número de funcionários inválido'));
    }

    return this.http.post(`${environment.apiUrl}/oauth2/completar-cadastro`, {
      email,
      nome,
      nuFuncionario: num,
    });
  }

  finalizarLogin(userId: string, userName: string, userEmail: string, userRoles: string = ''): void {
    const rolesArray = userRoles ? userRoles.split(',').map(r => r.trim()) : ['ROLE_USER'];

    const roleModel = rolesArray.map((role, index) => ({
      cdRole: index + 1,
      nmRole: role
    }));

    const userData = {
      cdUsuario: Number(userId),
      nmUsuario: decodeURIComponent(userName),
      dsEmail: decodeURIComponent(userEmail),
      roleModel: roleModel,
      roles: rolesArray
    };

    localStorage.setItem('user', JSON.stringify(userData));

    (this.authService as any).currentUser.set(userData);
    (this.authService as any).isAuthenticated.set(true);

    localStorage.removeItem('tempUserId');
    localStorage.removeItem('tempUserName');
    localStorage.removeItem('tempUserEmail');

    setTimeout(() => this.authService.redirectBasedOnRole(), 0);
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
    this.authService.logout();

    localStorage.removeItem('tempUserId');
    localStorage.removeItem('tempUserName');
    localStorage.removeItem('tempUserEmail');
  }
}
