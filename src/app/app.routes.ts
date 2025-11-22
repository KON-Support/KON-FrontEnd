import { Routes } from '@angular/router';
import { AgenteDashboard } from './views/agente-dashboard/agente-dashboard';
import { Tickets } from './views/tickets/tickets';
import { Login } from './views/login/login';
import { Cadastro } from './views/cadastro/cadastro';

export const routes: Routes = [
  // { Quando estiver funcionando o AuthGuard descomentar essa parte, pq é para quando abrir o site ja ir direto para o login
  //   path: '',
  //   redirectTo: '/login',
  //   pathMatch: 'full'
  // },

  {
    path: 'login',
    component: Login
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
    path: 'cadastro',
    component: Cadastro,
  },

];