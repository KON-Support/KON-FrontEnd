import { Routes } from '@angular/router';
import { AgenteDashboard } from './views/agente-dashboard/agente-dashboard';
import { Login } from './views/login/login';
import { Cadastro } from './views/cadastro/cadastro';

import { NovoChamado } from './components/novo-chamado/novo-chamado';
import { Chamado } from './shared/models/Chamado';
import { ChamadosUser } from './components/chamados-user/chamados-user';

export const routes: Routes = [
   { 
     path: '',
     redirectTo: '/login',
     pathMatch: 'full'
   },

  {
    path: 'login',
    component: Login
  },
  {
    path: 'agente/dashboard',
    component: AgenteDashboard,
  },
  {
    path: 'chamados',
    component: Chamado,
  },

  {
    path: 'cadastro',
    component: Cadastro,
  },

  {
    path: 'novo-chamado',
    component: NovoChamado,
  },

  {
    path: 'meus-chamados',
    component: ChamadosUser,
  },

];
