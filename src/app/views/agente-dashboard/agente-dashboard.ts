import { Component } from '@angular/core';
import { CardEstatistica } from '../../components/card-estatistica/card-estatistica';
import { NavbarUsuario } from "../../components/navbar-usuario/navbar-usuario";
import {ChamadosUrgentes} from '../../components/chamados-urgentes/chamados-urgentes';

@Component({
  selector: 'app-agente-dashboard',
  standalone: true,
  imports: [CardEstatistica, NavbarUsuario, ChamadosUrgentes],
  templateUrl: './agente-dashboard.html',
  styleUrl: './agente-dashboard.scss',
})

export class AgenteDashboard {

}
