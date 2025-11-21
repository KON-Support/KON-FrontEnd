import { Routes } from '@angular/router';
import { AgenteDashboard } from './views/agente-dashboard/agente-dashboard';
import { Tickets } from './views/tickets/tickets';

export const routes: Routes = [
  {
    path: 'agente/dashboard',
    component: AgenteDashboard,
  },
  {
    path: 'tickets',
    component: Tickets,
  },
];
