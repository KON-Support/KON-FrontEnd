# KON Support - Sistema de Gerenciamento de Chamados (Frontend)

## Sobre o Projeto

Frontend do KON Support desenvolvido em Angular 19 com arquitetura modular e componentizada. O sistema oferece interfaces distintas para diferentes perfis de usuário (Admin, Agente e Usuário), com funcionalidades completas de gerenciamento de chamados, sistema de comentários em tempo real, e autenticação via OAuth2 (Google) e JWT.

## Tecnologias Utilizadas

- **Angular 19** (Standalone Components)
- **TypeScript 5.6+**
- **Bootstrap 5.3** (UI Framework)
- **Bootstrap Icons** (Ícones)
- **RxJS** (Programação reativa)
- **Angular Signals** (Gerenciamento de estado)
- **ApexCharts** (Gráficos e relatórios)
- **SCSS** (Estilização)

## Arquitetura

O projeto segue uma arquitetura em camadas com standalone components:

```
src/app/
├── components/          # Componentes reutilizáveis
├── views/              # Páginas/Views principais
├── services/           # Serviços (API, Auth, etc)
├── shared/
│   └── models/        # Modelos de dados (TypeScript classes)
├── environments/       # Configurações de ambiente
└── app.routes.ts      # Configuração de rotas
```

## Principais Funcionalidades

### Autenticação e Autorização
- Login tradicional (email/senha)
- OAuth2 com Google (integração completa)
- Sistema de roles (ROLE_USER, ROLE_AGENTE, ROLE_ADMIN)
- Guards para proteção de rotas
- Interceptor JWT automático

### Gestão de Chamados
- Abertura de chamados com anexos (até 20MB)
- Visualização por status, categoria e solicitante
- Sistema de busca e filtros avançados
- Atribuição de responsáveis (para agentes)
- Controle de status em tempo real
- Indicadores visuais de SLA (violado/em risco)

### Sistema de Chat/Comentários
- Comentários em tempo real (polling a cada 5s)
- Anexos em comentários
- Download de arquivos
- Scroll automático para novos comentários
- Interface tipo chat

### Dashboards Específicos

**Dashboard Usuário:**
- Estatísticas pessoais de chamados
- Últimos 5 chamados
- Indicadores visuais de status

**Dashboard Agente:**
- Chamados não atribuídos
- Chamados sob responsabilidade
- Estatísticas de atendimento

**Dashboard Admin:**
- Visão completa do sistema
- Todos os chamados
- Gerenciamento de usuários e agentes

### Relatórios (Admin/Agente)
- Gráficos por status (pizza)
- Gráficos por categoria (barras)
- Evolução temporal (área)
- Geração dinâmica com ApexCharts

### Gerenciamento de Usuários/Agentes (Admin)
- CRUD completo
- Ativação/Desativação
- Atribuição automática de planos
- Sistema de busca

## Como Rodar o Projeto

### Pré-requisitos

1. **Node.js 18+** e **npm**
2. **Angular CLI 19+**
```bash
npm install -g @angular/cli@19
```

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd Projeto-KONSupport
```

2. **Instale as dependências**
```bash
npm install
```

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8089/api'  // URL do backend
};
```

3. **Execute o projeto**

```bash
# Modo desenvolvimento (porta 4200)
ng serve
```

5. **Acesse a aplicação**

- **Desenvolvimento:** http://localhost:4200
- A aplicação irá recarregar automaticamente ao modificar arquivos

## Rotas Principais

### Públicas
- `/login` - Página de login
- `/cadastro` - Cadastro de novos usuários
- `/oauth2/redirect` - Callback OAuth2
- `/completar-cadastro` - Completar cadastro OAuth2

### Usuário (ROLE_USER)
- `/user/dashboard` - Dashboard do usuário
- `/user/meus-chamados` - Lista de chamados do usuário
- `/novo-chamado-user` - Criar novo chamado
- `/chamado/detalhes/:id` - Detalhes do chamado

### Agente (ROLE_AGENTE)
- `/agente/dashboard` - Dashboard do agente
- `/chamados` - Todos os chamados
- `/novo-chamado` - Criar chamado
- `/relatorios` - Relatórios e gráficos
- `/chamado/detalhes/:id` - Detalhes/atendimento

### Admin (ROLE_ADMIN)
- `/admin/dashboard` - Dashboard administrativo
- `/admin/chamados` - Todos os chamados do sistema
- `/admin/gerenciar-agentes` - CRUD de agentes
- `/admin/gerenciar-usuarios` - CRUD de usuários
- `/relatorios` - Relatórios completos

## Estrutura de Dados

### Principais Models

```typescript
// Usuário
class Usuario {
  cdUsuario: number;
  nmUsuario: string;
  dsEmail: string;
  nuFuncionario: number;
  plano: Plano | null;
  flAtivo: boolean;
  roleModel: Role[];
}

// Chamado
class Chamado {
  cdChamado: number;
  dsTitulo: string;
  dsDescricao: string;
  status: Status; // ABERTO, EM_ANDAMENTO, RESOLVIDO, FECHADO
  solicitante: Usuario | null;
  responsavel: Usuario | null;
  categoria: Categoria | null;
  sla: SLA | null;
  dtCriacao: Date;
  dtVencimento: Date | null;
  flSlaViolado: boolean;
}

// Comentário
class Comentario {
  cdComentario: number;
  chamado: Chamado;
  usuario: Usuario;
  dsConteudo: string;
  anexo: Anexo | null;
  dtCriacao: Date;
}
```

## Sistema de Design

### Cores Principais
```scss
--primary-color: #667eea;
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--success-color: #28a745;
--danger-color: #dc3545;
--warning-color: #ffc107;
```

### Breakpoints Responsivos
- **Mobile:** < 576px
- **Tablet:** 576px - 991px
- **Desktop:** > 992px

### Componentes Reutilizáveis

- `<app-navbar>` - Barra de navegação lateral/mobile
- `<app-card-chamado>` - Card de chamado
- `<app-card-estatistica>` - Cards de estatísticas
- `<app-lista-chamados>` - Lista de chamados
- `<app-chamados-nao-atribuidos>` - Lista específica

## Segurança

### Guards Implementados

**AuthGuard**: Protege rotas que requerem autenticação
```typescript
canActivate: [AuthGuard]
```

**RoleGuard**: Protege rotas baseado em roles
```typescript
canActivate: [RoleGuard],
data: { roles: ['ROLE_ADMIN', 'ROLE_AGENTE'] }
```

### JWT Interceptor

Adiciona automaticamente o token JWT em todas as requisições:
```typescript
Authorization: Bearer <token>
```

### Tratamento de Erros
- Redirecionamento automático para login em 401
- Mensagens de erro amigáveis
- Logging de erros no console (dev mode)

## Responsividade

O sistema é totalmente responsivo com:
- **Sidebar adaptável** (desktop: fixa, mobile: overlay)
- **Grid flexível** (ajuste automático de colunas)
- **Header mobile** com hamburger menu
- **Cards empilháveis** em telas pequenas
- **Tipografia escalável** (rem/em)

## Build para Produção

```bash
# Build otimizado
ng build --configuration production

# Build com análise de bundle
ng build --configuration production --stats-json
npx webpack-bundle-analyzer dist/stats.json

# Arquivos gerados em: dist/projeto-konsupport/
```

### Otimizações de Build
- **AOT Compilation** (Ahead of Time)
- **Tree Shaking** (remoção de código não usado)
- **Minificação** de JS/CSS
- **Lazy Loading** de rotas
- **Source Maps** (apenas dev)

## Troubleshooting

### Erro: "Cannot connect to backend"
- Verifique se o backend está rodando na porta 8089
- Confirme a URL em `environment.ts`
- Verifique as configurações de CORS no backend

### Erro: "Token expired"
- Faça login novamente
- O token JWT expira em 1 hora

### OAuth2 não funciona
- Verifique as credenciais do Google Cloud
- Confirme as URLs de redirecionamento
- Backend deve estar acessível publicamente para OAuth2

### Anexos não carregam
- Verifique o tamanho máximo (20MB)
- Confirme os tipos aceitos: PDF, DOC, DOCX, JPG, PNG, TXT
- Verifique permissões do backend

## Scripts Úteis

```bash
# Desenvolvimento
npm start                    # Inicia servidor dev
npm run build               # Build de produção
npm run watch               # Build com watch mode
npm test                    # Executa testes

# Análise
npm run lint                # Verifica código
npm run format              # Formata código

# Atualização
ng update                   # Verifica atualizações
ng update @angular/cli @angular/core  # Atualiza Angular
```

## Integração com Backend

O frontend consome os seguintes endpoints principais:

```typescript
// Autenticação
POST   /api/auth/login
POST   /api/oauth2/completar-cadastro

// Chamados
GET    /api/v1/chamado/listar/todos
POST   /api/v1/chamado/abrir
PUT    /api/v1/chamado/atribuir/:id
PUT    /api/v1/chamado/atualizar/status/:id

// Comentários
GET    /api/v1/comentario/chamado/:id
POST   /api/v1/comentario/criar
POST   /api/v1/comentario/criar-com-anexo

// Anexos
POST   /api/v1/anexo/upload
GET    /api/v1/anexo/baixar/:id

// Categorias
GET    /api/v1/categoria/listar/ativas

// Usuários
GET    /api/usuario/buscar/todos
POST   /api/usuario/cadastro
PUT    /api/usuario/atualizar/:id
```

## Bibliotecas Principais

```json
{
  "@angular/core": "^19.0.0",
  "@angular/common": "^19.0.0",
  "@angular/router": "^19.0.0",
  "rxjs": "~7.8.0",
  "bootstrap": "^5.3.8",
  "bootstrap-icons": "^1.13.1",
  "ng-apexcharts": "^1.14.0",
  "apexcharts": "^4.3.0"
}
```

## Próximas Melhorias

- [ ] Notificações push em tempo real (WebSocket)
- [ ] Modo escuro (dark theme)
- [ ] Exportação de relatórios em PDF
- [ ] Upload múltiplo de arquivos
- [ ] Sistema de tags/etiquetas
- [ ] Histórico de alterações do chamado
- [ ] Integração com Slack/Teams
- [ ] PWA (Progressive Web App)

---

**Desenvolvido para proporcionar uma experiência fluida e eficiente no gerenciamento de suporte técnico com diferentes níveis de acesso e controle granular de permissões.**
