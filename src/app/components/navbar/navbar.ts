import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})

export class Navbar {

  protected user = {
    name: 'Agente Suporte',
    email: 'agente@konsupport.com',
    initials: 'AS'
  };

  logout(): void {
    console.log('Logout');
    // Implementar lógica de logout aqui, falar com equipe...
  }
}