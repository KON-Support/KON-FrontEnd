import { Routes } from '@angular/router';
import { AgenteDashboard } from './views/agente-dashboard/agente-dashboard';
import { Login } from './views/login/login';
import { Cadastro } from './views/cadastro/cadastro';
import { Chamados } from './views/chamados/chamados';
import { UserDashboard } from './views/user-dashboard/user-dashboard';
import { NovoChamado } from './components/novo-chamado/novo-chamado';
import { ChamadosUser } from './components/chamados-user/chamados-user';
import { Relatorios } from './views/relatorios/relatorios';
import { ChamadosAdmin } from './views/chamados-admin/chamados-admin';

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
    path: 'cadastro',
    component: Cadastro,
  },
  {
    path: 'agente/dashboard',
    component: AgenteDashboard,
  },

  {
    path: 'user/dashboard',
    component: UserDashboard,
  },
  {
    path: 'chamados',
    component: Chamados,
  },

   {
    path: 'admin/chamados',
    component: ChamadosAdmin,
  },
  {
    path: 'novo-chamado',
    component: NovoChamado,
  },
  {
    path: 'user/meus-chamados',
    component: ChamadosUser,
  },
  {
    path: 'relatorios',
    component: Relatorios,
  }
];
