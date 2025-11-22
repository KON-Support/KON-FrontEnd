import { Routes } from '@angular/router';
import { AgenteDashboard } from './views/agente-dashboard/agente-dashboard';
import { Tickets } from './views/tickets/tickets';
import { NovoTicket } from './components/novo-ticket/novo-ticket';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'agente/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'agente/dashboard',
    component: AgenteDashboard,
  },
  {
    path: 'tickets',
    component: Tickets,
  },
  {
    path: 'novo-ticket',
    component: NovoTicket,
  },
];