import { Component } from '@angular/core';
import { ChamadosUser } from "../../components/chamados-user/chamados-user";
import { NavbarUsuario } from "../../components/navbar-usuario/navbar-usuario";

@Component({
  selector: 'app-meus-chamados-view',
  imports: [ChamadosUser, NavbarUsuario],
  templateUrl: './meus-chamados-view.html',
  styleUrl: './meus-chamados-view.scss',
})

export class MeusChamadosView {

}
