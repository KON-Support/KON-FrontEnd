import { Component } from '@angular/core';
import { CardEstatistica } from '../../components/card-estatistica/card-estatistica';
import { ChamadosNaoAtribuidos } from '../../components/chamados-nao-atribuidos/chamados-nao-atribuidos';
import { NavbarAgente } from '../../components/navbar-agente/navbar-agente';

@Component({
  selector: 'app-agente-dashboard',
  standalone: true,
  imports: [CardEstatistica, ChamadosNaoAtribuidos, NavbarAgente],
  templateUrl: './agente-dashboard.html',
  styleUrl: './agente-dashboard.scss',
})
export class AgenteDashboard {}
