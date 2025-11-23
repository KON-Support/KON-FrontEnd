import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListaTickets } from '../../components/lista-tickets/lista-tickets';
import { Chamado } from '../../shared/models/Chamado';
import { ChamadoService } from '../../services/chamado-service';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria-service';
import { Categoria } from '../../shared/models/Categoria';

@Component({
  selector: 'app-tickets',
  imports: [ListaTickets, RouterLink, FormsModule],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss',
})
export class Tickets {
  private chamadoService = inject(ChamadoService);
  private categoriaService = inject(CategoriaService);
  private cdr = inject(ChangeDetectorRef);

  protected tickets: Chamado[] = [];
  protected qtdTickets: number = 0;

  protected categorias: Categoria[] = [];

  protected filtroBusca: string = '';
  protected filtroStatus: string = '';
  protected filtroCategoria: string = '';

  ngOnInit(): void {
    this.chamadoService.buscarChamados().subscribe((response) => {
      this.tickets = response;
      this.qtdTickets = this.tickets.length;
      this.cdr.detectChanges();
    });
    this.categoriaService.listarCategoriasAtivas().subscribe((response) => {
      this.categorias = response;

      console.log(this.categorias.length);
    });
  }

  get ticketsFiltrados() {
    let ticketsFiltrados = this.tickets;

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

    return ticketsFiltrados;
  }
}
