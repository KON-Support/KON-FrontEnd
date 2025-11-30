import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { ChamadoService } from '../../services/chamado-service';
import { AuthService } from '../../services/auth-service';
import { Chamado } from '../../shared/models/Chamado';
import { Status } from '../../shared/models/Status';

interface Estatisticas {
  abertos: number;
  emAndamento: number;
  resolvidos: number;
  total: number;
}

interface AtividadeRecente {
  tipo: 'criado' | 'andamento' | 'resolvido' | 'comentario';
  titulo: string;
  descricao: string;
  tempo: string;
}

@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule, Navbar, RouterLink],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})

export class UserDashboard implements OnInit {
  private chamadoService = inject(ChamadoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected loading = signal(true);
  protected chamados = signal<Chamado[]>([]);
  protected ultimosChamados = signal<Chamado[]>([]);
  protected estatisticas = signal<Estatisticas>({
    abertos: 0,
    emAndamento: 0,
    resolvidos: 0,
    total: 0,
  });
  protected atividadesRecentes = signal<AtividadeRecente[]>([]);
  protected nomeUsuario = signal('');

  private usuarioLogadoId: number = 0;

  ngOnInit(): void {
    this.obterUsuarioLogado();
    this.carregarDashboard();
  }

  private obterUsuarioLogado(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.usuarioLogadoId = user.cdUsuario;
      this.nomeUsuario.set(user.nmUsuario.split(' ')[0]);
    }
  }

  private carregarDashboard(): void {
    if (!this.usuarioLogadoId) return;

    this.loading.set(true);

    this.chamadoService.buscarPorSolicitante(this.usuarioLogadoId).subscribe({
      next: (response) => {
        this.chamados.set(response);
        this.calcularEstatisticas(response);
        this.definirUltimosChamados(response);
        this.gerarAtividadesRecentes(response);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard:', err);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  private calcularEstatisticas(chamados: Chamado[]): void {
    const stats: Estatisticas = {
      abertos: chamados.filter((c) => c.status === Status.ABERTO).length,
      emAndamento: chamados.filter((c) => c.status === Status.EM_ANDAMENTO).length,
      resolvidos: chamados.filter(
        (c) => c.status === Status.RESOLVIDO || c.status === Status.FECHADO
      ).length,
      total: chamados.length,
    };
    this.estatisticas.set(stats);
  }

  private definirUltimosChamados(chamados: Chamado[]): void {
    const ultimos = [...chamados]
      .sort((a, b) => new Date(b.dtCriacao).getTime() - new Date(a.dtCriacao).getTime())
      .slice(0, 5);
    this.ultimosChamados.set(ultimos);
  }

  private gerarAtividadesRecentes(chamados: Chamado[]): void {
    const atividades: AtividadeRecente[] = [];

    chamados.forEach((chamado) => {
      if (chamado.status === Status.RESOLVIDO || chamado.status === Status.FECHADO) {
        atividades.push({
          tipo: 'resolvido',
          titulo: 'Chamado Resolvido',
          descricao: `#${chamado.cdChamado} - ${chamado.dsTitulo}`,
          tempo: this.calcularTempoDecorrido(chamado.dtFechamento || chamado.dtCriacao),
        });
      } else if (chamado.status === Status.EM_ANDAMENTO) {
        atividades.push({
          tipo: 'andamento',
          titulo: 'Chamado em Atendimento',
          descricao: `#${chamado.cdChamado} - ${chamado.dsTitulo}`,
          tempo: this.calcularTempoDecorrido(chamado.dtCriacao),
        });
      } else if (chamado.status === Status.ABERTO) {
        atividades.push({
          tipo: 'criado',
          titulo: 'Chamado Aberto',
          descricao: `#${chamado.cdChamado} - ${chamado.dsTitulo}`,
          tempo: this.calcularTempoDecorrido(chamado.dtCriacao),
        });
      }
    });

    this.atividadesRecentes.set(atividades.slice(0, 6));
  }

  private calcularTempoDecorrido(data: Date | null): string {
    if (!data) return 'Agora';

    const agora = new Date();
    const diff = agora.getTime() - new Date(data).getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `há ${dias} dia${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `há ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'Agora';
  }

  protected getStatusBadgeClass(status: Status): string {
    const classes: Record<Status, string> = {
      [Status.ABERTO]: 'bg-primary',
      [Status.EM_ANDAMENTO]: 'bg-warning',
      [Status.RESOLVIDO]: 'bg-success',
      [Status.FECHADO]: 'bg-secondary',
    };
    return classes[status] || 'bg-secondary';
  }

  protected getStatusLabel(status: Status): string {
    const labels: Record<Status, string> = {
      [Status.ABERTO]: 'Aberto',
      [Status.EM_ANDAMENTO]: 'Em Andamento',
      [Status.RESOLVIDO]: 'Resolvido',
      [Status.FECHADO]: 'Fechado',
    };
    return labels[status] || 'Desconhecido';
  }

  protected getAtividadeIconClass(tipo: string): string {
    const classes: Record<string, string> = {
      criado: 'bg-primary',
      andamento: 'bg-warning',
      resolvido: 'bg-success',
      comentario: 'bg-info',
    };
    return classes[tipo] || 'bg-secondary';
  }

  protected getAtividadeIcon(tipo: string): string {
    const icons: Record<string, string> = {
      criado: 'bi bi-plus-circle-fill',
      andamento: 'bi bi-arrow-repeat',
      resolvido: 'bi bi-check-circle-fill',
      comentario: 'bi bi-chat-dots-fill',
    };
    return icons[tipo] || 'bi bi-circle-fill';
  }

  protected formatDate(date: Date | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  protected abrirNovoChamado(): void {
    this.router.navigate(['/novo-chamado-user']);
  }

  protected verDetalhesChamado(chamado: Chamado): void {
    this.router.navigate([`/chamado/detalhes/${chamado.cdChamado}`]);
  }
}
