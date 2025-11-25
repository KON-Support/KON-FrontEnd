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
import { AuthGuard } from './services/auth-guard';
import { GerenciarAgentes } from './views/gerenciar-agentes/gerenciar-agentes';
import { Role } from './shared/models/Role';

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
    canActivate: [AuthGuard]
  },
  {
    path: 'user/dashboard',
    component: UserDashboard,
    canActivate: [AuthGuard]
  },
  {
    path: 'chamados',
    component: Chamados,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/chamados',
    component: ChamadosAdmin,
    canActivate: [AuthGuard]
  },
  {
    path: 'novo-chamado',
    component: NovoChamado,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/meus-chamados',
    component: ChamadosUser,
    canActivate: [AuthGuard]
  },
  {
    path: 'relatorios',
    component: Relatorios,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/dashboard',
    component: AgenteDashboard,
    canActivate: [AuthGuard]
  },

  {
    path: 'admin/gerenciar-agentes',
    component: GerenciarAgentes,
    canActivate: [AuthGuard],
  }
];