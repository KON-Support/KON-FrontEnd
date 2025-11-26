import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { ChamadoService } from '../../services/chamado-service';
import { Chamado } from '../../shared/models/Chamado';
import { Status } from '../../shared/models/Status';

interface Estatisticas {
  totalChamados: number;
  chamadosAbertos: number;
  chamadosEmAndamento: number;
  chamadosResolvidos: number;
  chamadosFechados: number;
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

  protected chamados = signal<Chamado[]>([]);
  protected loading = signal(true);
  protected estatisticas = signal<Estatisticas>({
    totalChamados: 0,
    chamadosAbertos: 0,
    chamadosEmAndamento: 0,
    chamadosResolvidos: 0,
    chamadosFechados: 0,
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
        console.log('Dados carregados para relatórios:', response.length);
        this.chamados.set(response);
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
    const chamados = this.chamados();
    
    const stats: Estatisticas = {
      totalChamados: chamados.length,
      chamadosAbertos: chamados.filter((t) => t.status === Status.ABERTO).length,
      chamadosEmAndamento: chamados.filter((t) => t.status === Status.EM_ANDAMENTO).length,
      chamadosResolvidos: chamados.filter((t) => t.status === Status.RESOLVIDO).length,
      chamadosFechados: chamados.filter((t) => t.status === Status.FECHADO).length,
      slaViolado: chamados.filter((t) => t.flSlaViolado).length,
      proximoVencimento: this.calcularProximoVencimento(chamados),
      dentroPrazo: chamados.filter((t) => !t.flSlaViolado && t.status !== Status.FECHADO).length,
    };

    this.estatisticas.set(stats);
    console.log('📈 Estatísticas calculadas:', stats);
  }

  private calcularProximoVencimento(chamados: Chamado[]): number {
    const hoje = new Date();
    const limite = new Date(hoje);
    limite.setHours(limite.getHours() + 24);

    return chamados.filter((t) => {
      if (!t.dtVencimento || t.status === Status.FECHADO) return false;
      const vencimento = new Date(t.dtVencimento);
      return vencimento > hoje && vencimento <= limite;
    }).length;
  }

  private calcularStatusData(): void {
    const chamados = this.chamados();
    const total = chamados.length || 1;

    const data: StatusData[] = [
      {
        status: Status.ABERTO,
        label: 'Aberto',
        quantidade: chamados.filter((t) => t.status === Status.ABERTO).length,
        porcentagem: 0,
        colorClass: 'bg-primary',
      },
      {
        status: Status.EM_ANDAMENTO,
        label: 'Em Andamento',
        quantidade: chamados.filter((t) => t.status === Status.EM_ANDAMENTO).length,
        porcentagem: 0,
        colorClass: 'bg-warning',
      },
      {
        status: Status.RESOLVIDO,
        label: 'Resolvido',
        quantidade: chamados.filter((t) => t.status === Status.RESOLVIDO).length,
        porcentagem: 0,
        colorClass: 'bg-success',
      },
      {
        status: Status.FECHADO,
        label: 'Fechado',
        quantidade: chamados.filter((t) => t.status === Status.FECHADO).length,
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
    const chamados = this.chamados();
    const total = chamados.length || 1;

    const categorias = new Map<string, number>();

    chamados.forEach((chamado) => {
      if (chamado.categoria) {
        const nome = chamado.categoria.nmCategoria;
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
    const chamados = this.chamados();
    
    const atendentes = new Map<number, PerformanceAtendente>();

    chamados.forEach((chamado) => {
      if (chamado.responsavel) {
        const id = chamado.responsavel.cdUsuario;
        
        if (!atendentes.has(id)) {
          atendentes.set(id, {
            nome: chamado.responsavel.nmUsuario,
            iniciais: this.getIniciais(chamado.responsavel.nmUsuario),
            totalAtribuidos: 0,
            resolvidos: 0,
            emAndamento: 0,
            taxaResolucao: 0,
            tempoMedio: 0,
          });
        }

        const atendente = atendentes.get(id)!;
        atendente.totalAtribuidos++;

        if (chamado.status === Status.RESOLVIDO || chamado.status === Status.FECHADO) {
          atendente.resolvidos++;
        } else if (chamado.status === Status.EM_ANDAMENTO) {
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
    const chamadosResolvidos = this.chamados().filter(
      (t) => t.status === Status.RESOLVIDO || t.status === Status.FECHADO
    );

    if (chamadosResolvidos.length === 0) {
      this.tempoMedioResolucao.set(0);
      return;
    }

    let totalHoras = 0;
    let count = 0;

    chamadosResolvidos.forEach((chamado) => {
      if (chamado.dtCriacao && chamado.dtFechamento) {
        const criacao = new Date(chamado.dtCriacao);
        const fechamento = new Date(chamado.dtFechamento);
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