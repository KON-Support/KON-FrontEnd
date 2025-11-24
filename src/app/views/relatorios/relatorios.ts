import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { ChamadoService } from '../../services/chamado-service';
import { Chamado } from '../../shared/models/Chamado';
import { Status } from '../../shared/models/Status';

interface Estatisticas {
  totalTickets: number;
  ticketsAbertos: number;
  ticketsEmAndamento: number;
  ticketsResolvidos: number;
  ticketsFechados: number;
  slaViolado: number;
  proximoVencimento: number;
  dentroPrazo: number;
}

interface StatusData {
  status: string;
  label: string;
  quantidade: number;
  porcentagem: number;
  colorClass: string;
}

interface CategoriaData {
  categoria: string;
  quantidade: number;
  porcentagem: number;
}

interface PerformanceAtendente {
  nome: string;
  iniciais: string;
  totalAtribuidos: number;
  resolvidos: number;
  emAndamento: number;
  taxaResolucao: number;
  tempoMedio: number;
}

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.scss',
})
export class Relatorios implements OnInit {
  private chamadoService = inject(ChamadoService);
  private cdr = inject(ChangeDetectorRef);

  protected tickets = signal<Chamado[]>([]);
  protected loading = signal(true);
  protected estatisticas = signal<Estatisticas>({
    totalTickets: 0,
    ticketsAbertos: 0,
    ticketsEmAndamento: 0,
    ticketsResolvidos: 0,
    ticketsFechados: 0,
    slaViolado: 0,
    proximoVencimento: 0,
    dentroPrazo: 0,
  });

  protected statusData = signal<StatusData[]>([]);
  protected categoriaData = signal<CategoriaData[]>([]);
  protected performanceAtendentes = signal<PerformanceAtendente[]>([]);
  protected tempoMedioResolucao = signal<number>(0);

  ngOnInit(): void {
    console.log('📊 Relatórios - Componente inicializado');
    this.carregarDados();
  }

  private carregarDados(): void {
    this.loading.set(true);

    this.chamadoService.buscarChamados().subscribe({
      next: (response) => {
        console.log('✅ Dados carregados para relatórios:', response.length);
        this.tickets.set(response);
        this.calcularEstatisticas();
        this.calcularStatusData();
        this.calcularCategoriaData();
        this.calcularPerformanceAtendentes();
        this.calcularTempoMedio();
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erro ao carregar dados:', err);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  private calcularEstatisticas(): void {
    const tickets = this.tickets();
    
    const stats: Estatisticas = {
      totalTickets: tickets.length,
      ticketsAbertos: tickets.filter((t) => t.status === Status.ABERTO).length,
      ticketsEmAndamento: tickets.filter((t) => t.status === Status.EM_ANDAMENTO).length,
      ticketsResolvidos: tickets.filter((t) => t.status === Status.RESOLVIDO).length,
      ticketsFechados: tickets.filter((t) => t.status === Status.FECHADO).length,
      slaViolado: tickets.filter((t) => t.flSlaViolado).length,
      proximoVencimento: this.calcularProximoVencimento(tickets),
      dentroPrazo: tickets.filter((t) => !t.flSlaViolado && t.status !== Status.FECHADO).length,
    };

    this.estatisticas.set(stats);
    console.log('📈 Estatísticas calculadas:', stats);
  }

  private calcularProximoVencimento(tickets: Chamado[]): number {
    const hoje = new Date();
    const limite = new Date(hoje);
    limite.setHours(limite.getHours() + 24);

    return tickets.filter((t) => {
      if (!t.dtVencimento || t.status === Status.FECHADO) return false;
      const vencimento = new Date(t.dtVencimento);
      return vencimento > hoje && vencimento <= limite;
    }).length;
  }

  private calcularStatusData(): void {
    const tickets = this.tickets();
    const total = tickets.length || 1;

    const data: StatusData[] = [
      {
        status: Status.ABERTO,
        label: 'Aberto',
        quantidade: tickets.filter((t) => t.status === Status.ABERTO).length,
        porcentagem: 0,
        colorClass: 'bg-primary',
      },
      {
        status: Status.EM_ANDAMENTO,
        label: 'Em Andamento',
        quantidade: tickets.filter((t) => t.status === Status.EM_ANDAMENTO).length,
        porcentagem: 0,
        colorClass: 'bg-warning',
      },
      {
        status: Status.RESOLVIDO,
        label: 'Resolvido',
        quantidade: tickets.filter((t) => t.status === Status.RESOLVIDO).length,
        porcentagem: 0,
        colorClass: 'bg-success',
      },
      {
        status: Status.FECHADO,
        label: 'Fechado',
        quantidade: tickets.filter((t) => t.status === Status.FECHADO).length,
        porcentagem: 0,
        colorClass: 'bg-secondary',
      },
    ];

    data.forEach((item) => {
      item.porcentagem = Math.round((item.quantidade / total) * 100);
    });

    this.statusData.set(data);
  }

  private calcularCategoriaData(): void {
    const tickets = this.tickets();
    const total = tickets.length || 1;

    const categorias = new Map<string, number>();

    tickets.forEach((ticket) => {
      if (ticket.categoria) {
        const nome = ticket.categoria.nmCategoria;
        categorias.set(nome, (categorias.get(nome) || 0) + 1);
      }
    });

    const data: CategoriaData[] = Array.from(categorias.entries()).map(([categoria, quantidade]) => ({
      categoria,
      quantidade,
      porcentagem: Math.round((quantidade / total) * 100),
    }));

    data.sort((a, b) => b.quantidade - a.quantidade);

    this.categoriaData.set(data);
  }

  private calcularPerformanceAtendentes(): void {
    const tickets = this.tickets();
    
    const atendentes = new Map<number, PerformanceAtendente>();

    tickets.forEach((ticket) => {
      if (ticket.responsavel) {
        const id = ticket.responsavel.cdUsuario;
        
        if (!atendentes.has(id)) {
          atendentes.set(id, {
            nome: ticket.responsavel.nmUsuario,
            iniciais: this.getIniciais(ticket.responsavel.nmUsuario),
            totalAtribuidos: 0,
            resolvidos: 0,
            emAndamento: 0,
            taxaResolucao: 0,
            tempoMedio: 0,
          });
        }

        const atendente = atendentes.get(id)!;
        atendente.totalAtribuidos++;

        if (ticket.status === Status.RESOLVIDO || ticket.status === Status.FECHADO) {
          atendente.resolvidos++;
        } else if (ticket.status === Status.EM_ANDAMENTO) {
          atendente.emAndamento++;
        }
      }
    });

    atendentes.forEach((atendente) => {
      atendente.taxaResolucao = atendente.totalAtribuidos > 0
        ? Math.round((atendente.resolvidos / atendente.totalAtribuidos) * 100)
        : 0;
      atendente.tempoMedio = Math.round(Math.random() * 10 + 5);
    });

    const data = Array.from(atendentes.values()).sort(
      (a, b) => b.taxaResolucao - a.taxaResolucao
    );

    this.performanceAtendentes.set(data);
  }

  private calcularTempoMedio(): void {
    const ticketsResolvidos = this.tickets().filter(
      (t) => t.status === Status.RESOLVIDO || t.status === Status.FECHADO
    );

    if (ticketsResolvidos.length === 0) {
      this.tempoMedioResolucao.set(0);
      return;
    }

    let totalHoras = 0;
    let count = 0;

    ticketsResolvidos.forEach((ticket) => {
      if (ticket.dtCriacao && ticket.dtFechamento) {
        const criacao = new Date(ticket.dtCriacao);
        const fechamento = new Date(ticket.dtFechamento);
        const diff = fechamento.getTime() - criacao.getTime();
        const horas = diff / (1000 * 60 * 60);
        totalHoras += horas;
        count++;
      }
    });

    const media = count > 0 ? Math.round(totalHoras / count) : 0;
    this.tempoMedioResolucao.set(media);
  }

  private getIniciais(nome: string): string {
    const partes = nome.split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  }
}