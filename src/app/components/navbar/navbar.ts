import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected usuario = this.authService.currentUser();
  
  get user() {
    const u = this.authService.currentUser();
    return {
      name: u?.nmUsuario || '',
      email: u?.dsEmail || '',
      initials: this.getIniciais(u?.nmUsuario || '')
    };
  }

  get isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  get isAgente(): boolean {
    return this.hasRole('ROLE_AGENTE');
  }

  get isUser(): boolean {
    return this.hasRole('ROLE_USER');
  }

  private hasRole(roleName: string): boolean {
    const user = this.authService.currentUser();
    return user?.roleModel?.some(r => r.nmRole === roleName) || false;
  }

  get portalTitle(): string {
    if (this.isAdmin) return 'Portal Administrador';
    if (this.isAgente) return 'Portal Agente';
    return 'Portal do Cliente';
  }

  getIniciais(nome: string): string {
    if (!nome) return '';
    return nome
      .split(' ')
      .map(palavra => palavra.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
