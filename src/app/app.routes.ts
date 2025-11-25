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
import { RoleGuard } from './services/role-guard';
import { GerenciarAgentes } from './views/gerenciar-agentes/gerenciar-agentes';
import { AdminDashboard } from './views/admin-dashboard/admin-dashboard';

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
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_AGENTE'] }
  },
  {
    path: 'user/dashboard',
    component: UserDashboard,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'chamados',
    component: Chamados,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_AGENTE'] }
  },
  {
    path: 'admin/chamados',
    component: ChamadosAdmin,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'novo-chamado',
    component: NovoChamado,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'user/meus-chamados',
    component: ChamadosUser,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_USER'] }
  },
  {
    path: 'relatorios',
    component: Relatorios,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_AGENTE'] }
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboard, 
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'admin/gerenciar-agentes',
    component: GerenciarAgentes,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];