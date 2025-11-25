import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-admin',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.scss',
})
export class NavbarAdmin {

    protected usuario2 = JSON.parse(localStorage.getItem('user') || '{}');
    
    protected user = {
    name: this.usuario2.nmUsuario ,
    email: this.usuario2.dsEmail,
    initials: this.getIniciais(this.usuario2.nmUsuario)
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
    localStorage.clear();
    window.location.reload();
  }

}
