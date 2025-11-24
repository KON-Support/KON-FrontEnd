import { Component } from '@angular/core';
<<<<<<< HEAD
import { TicketsUser } from '../../components/chamados-user/tickets-user';
=======
import { ChamadosUser } from '../../components/chamados-user/chamados-user';
import { NavbarUsuario } from "../../components/navbar-usuario/navbar-usuario";
>>>>>>> 9ac9d23ff4b9298ec3fa7d394b093e67834bac35

@Component({
  selector: 'app-user-dashboard',
  imports: [ChamadosUser, NavbarUsuario],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})

export class UserDashboard {

}
