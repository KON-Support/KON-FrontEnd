import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-admin',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.scss',
})
export class NavbarAdmin {

   protected user = {
    name: 'Adminstrador',
    email: 'adminstrador@konsupport.com',
    initials: 'Ad'
  };

  logout(): void {
    console.log('Logout');
    // Implementar lógica de logout aqui, falar com equipe...
  }

}
