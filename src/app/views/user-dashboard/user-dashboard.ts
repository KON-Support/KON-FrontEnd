import { Component } from '@angular/core';
import { ChamadosUser } from '../../components/chamados-user/chamados-user';
import { Navbar } from "../../components/navbar/navbar";

@Component({
  selector: 'app-user-dashboard',
  imports: [ChamadosUser, Navbar],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})

export class UserDashboard {

}
