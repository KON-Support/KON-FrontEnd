import { Component } from '@angular/core';
import { ChamadosUser } from '../../components/chamados-user/chamados-user';
import { NavbarUsuario } from "../../components/navbar-usuario/navbar-usuario";

@Component({
  selector: 'app-user-dashboard',
  imports: [ChamadosUser, NavbarUsuario],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})

export class UserDashboard {

}
