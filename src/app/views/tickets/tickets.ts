import { ChangeDetectorRef, Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListaTickets } from '../../components/lista-tickets/lista-tickets';
import { Chamado } from '../../shared/models/Chamado';
import { ChamadoService } from '../../services/chamado-service';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria-service';
import { Categoria } from '../../shared/models/Categoria';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-tickets',
  imports: [ListaTickets, RouterLink, FormsModule, Navbar],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss',
})

export class Tickets implements OnInit {
  
  private chamadoService = inject(ChamadoService);
  private categoriaService = inject(CategoriaService);
  private cdr = inject(ChangeDetectorRef);

  protected tickets = signal<Chamado[]>([]);
  protected categorias = signal<Categoria[]>([]);
  protected qtdTickets = signal(0);
  protected loading = signal(true);

  protected filtroBusca: string = '';
  protected filtroStatus: string = '';
  protected filtroCategoria: string = '';

  ngOnInit(): void {
    console.log('🎬 Tickets - Componente inicializado');
    this.carregarDados();
  }

  private carregarDados(): void {
    this.loading.set(true);
    
    this.chamadoService.buscarChamados().subscribe({
      next: (response) => {
        console.log('✅ Tickets carregados:', response.length);
        this.tickets.set(response);
        this.qtdTickets.set(response.length);
        this.loading.set(false);
        
        this.cdr.markForCheck();
        
        console.log('💾 Estado atualizado - Tickets:', this.tickets().length);
      },
      error: (err) => {
        console.error('❌ Erro ao carregar tickets:', err);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });

    this.categoriaService.listarCategoriasAtivas().subscribe({
      next: (response) => {
        console.log('✅ Categorias carregadas:', response.length);
        this.categorias.set(response);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('❌ Erro ao carregar categorias:', err);
      },
    });
  }

  get ticketsFiltrados(): Chamado[] {
    let ticketsFiltrados = this.tickets();

    if (this.filtroBusca) {
      const busca = this.filtroBusca.toLowerCase();
      ticketsFiltrados = ticketsFiltrados.filter((ticket) =>
        ticket.dsTitulo.toLowerCase().includes(busca)
      );
    }

    if (this.filtroStatus) {
      const status = this.filtroStatus.toLowerCase();
      ticketsFiltrados = ticketsFiltrados.filter((ticket) =>
        ticket.status.toLowerCase().includes(status)
      );
    }

    if (this.filtroCategoria) {
      const categoria = this.filtroCategoria.toLowerCase();
      ticketsFiltrados = ticketsFiltrados.filter((ticket) =>
        ticket.categoria.nmCategoria.toLowerCase().includes(categoria)
      );
    }

    console.log('🔍 Tickets filtrados:', ticketsFiltrados.length);
    return ticketsFiltrados;
  }
}