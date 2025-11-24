import { Component } from '@angular/core';
import { CardEstatistica } from '../../components/card-estatistica/card-estatistica';
import { TicketsUrgentes } from '../../components/tickets-urgentes/tickets-urgentes';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-agente-dashboard',
  standalone: true,
  imports: [CardEstatistica, TicketsUrgentes, Navbar],
  templateUrl: './agente-dashboard.html',
  styleUrl: './agente-dashboard.scss',
})

export class AgenteDashboard {
  
}
