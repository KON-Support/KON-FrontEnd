import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-usuario',
  imports: [],
  templateUrl: './navbar-usuario.html',
  styleUrl: './navbar-usuario.scss',
})
export class NavbarUsuario {

   protected user = {
    name: 'Usuario comum',
    email: 'usuario@gmail.com',
    initials: 'US'
  };

  logout(): void {
    console.log('Logout');
    // Implementar lógica de logout aqui, falar com equipe...
  }

}
