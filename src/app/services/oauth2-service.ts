import { Injectable } from '@angular/core';
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
  ) {}

  loginWithGoogle(): void {
    // Redireciona para o endpoint de autorização OAuth2 do Spring Security
    const oauthUrl = `${this.BACKEND_URL}/oauth2/authorization/google`;
    
    // Verifica se a URL está válida
    if (!oauthUrl || oauthUrl === '/oauth2/authorization/google') {
      console.error('ERRO: URL do OAuth2 está inválida!');
      alert('Erro de configuração: URL do backend não encontrada. Verifique as configurações do ambiente.');
      return;
    }
    
    // Verifica se é uma URL válida
    try {
      new URL(oauthUrl);
    } catch (error) {
      console.error('ERRO: URL do OAuth2 não é uma URL válida:', oauthUrl);
      alert('Erro: URL do backend está malformada. Verifique as configurações.');
      return;
    }
    
    // Tenta redirecionar
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
    // Se o backend retornou um token, significa que o cadastro está completo
    // Não precisa verificar novamente, pode finalizar o login diretamente
    localStorage.setItem('token', token);
    
    // Finaliza o login imediatamente já que o backend validou que o cadastro está completo
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
    // Parse das roles recebidas (separadas por vírgula)
    const rolesArray = userRoles ? userRoles.split(',').map(r => r.trim()) : ['ROLE_USER'];
    
    // Normaliza as roles para o formato esperado pelo AuthService
    const roleModel = rolesArray.map((role, index) => ({
      cdRole: index + 1,
      nmRole: role
    }));

    const userData = {
      cdUsuario: Number(userId),
      nmUsuario: decodeURIComponent(userName),
      dsEmail: decodeURIComponent(userEmail),
      roleModel: roleModel,
      roles: rolesArray // Adiciona roles no formato array também
    };

    // Salva no localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Atualiza o AuthService para garantir que o interceptor funcione
    (this.authService as any).currentUser.set(userData);
    (this.authService as any).isAuthenticated.set(true);
    
    // Limpa dados temporários
    localStorage.removeItem('tempUserId');
    localStorage.removeItem('tempUserName');
    localStorage.removeItem('tempUserEmail');

    // Redireciona baseado na role principal usando AuthService
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
    // Usa o AuthService para garantir consistência
    this.authService.logout();
    
    // Limpa dados temporários do OAuth2
    localStorage.removeItem('tempUserId');
    localStorage.removeItem('tempUserName');
    localStorage.removeItem('tempUserEmail');
  }
}
