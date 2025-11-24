import { Component } from '@angular/core';
import { CardEstatistica } from '../../components/card-estatistica/card-estatistica';
import { Navbar } from '../../components/navbar/navbar';
import { ChamadosNaoAtribuidos } from '../../components/chamados-nao-atribuidos/chamados-nao-atribuidos';

@Component({
  selector: 'app-agente-dashboard',
  standalone: true,
  imports: [CardEstatistica, Navbar, ChamadosNaoAtribuidos],
  templateUrl: './agente-dashboard.html',
  styleUrl: './agente-dashboard.scss',
})

export class AgenteDashboard {

}
