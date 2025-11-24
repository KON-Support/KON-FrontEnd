import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Chamado } from '../../shared/models/Chamado';
import { ChamadoService } from '../../services/chamado-service';
import { CardChamado } from '../card-chamado/card-chamado';
import { Status } from '../../shared/models/Status';

@Component({
  selector: 'app-chamados-user',
  standalone: true,
  imports: [CommonModule, FormsModule, CardChamado],
  templateUrl: './chamados-user.html',
  styleUrl: './chamados-user.scss',
})

export class ChamadosUser implements OnInit {

  private chamadoService = inject(ChamadoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected tickets = signal<Chamado[]>([]);
  protected loading = signal(true);
  protected errorMessage = signal<string | null>(null);

  protected filtroBusca: string = '';
  protected filtroStatus: string = '';

  private usuarioLogadoId: number = 1;

  ngOnInit(): void {
    console.log('TicketsUser - Componente inicializado');
    this.carregarTicketsDoUsuario();
  }

  private carregarTicketsDoUsuario(): void {
    console.log('Carregando tickets do usuário:', this.usuarioLogadoId);
    this.loading.set(true);
    this.errorMessage.set(null);

    this.chamadoService.buscarChamados().subscribe({
      next: (response) => {
        const ticketsDoUsuario = response.filter(
          (ticket) => ticket.solicitante?.cdUsuario === this.usuarioLogadoId
        );

        console.log('Tickets do usuário carregados:', ticketsDoUsuario.length);
        this.tickets.set(ticketsDoUsuario);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar tickets:', err);
        this.errorMessage.set('Erro ao carregar seus tickets. Tente novamente.');
        this.loading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  get ticketsFiltrados(): Chamado[] {
    let ticketsFiltrados = this.tickets();

    if (this.filtroBusca) {
      const busca = this.filtroBusca.toLowerCase();
      ticketsFiltrados = ticketsFiltrados.filter(
        (ticket) =>
          ticket.dsTitulo.toLowerCase().includes(busca) ||
          ticket.dsDescricao.toLowerCase().includes(busca) ||
          ticket.cdChamado.toString().includes(busca)
      );
    }

    if (this.filtroStatus) {
      ticketsFiltrados = ticketsFiltrados.filter(
        (ticket) => ticket.status === this.filtroStatus
      );
    }

    return ticketsFiltrados;
  }

  get ticketsAbertos(): number {
    return this.tickets().filter((t) => t.status === Status.ABERTO).length;
  }

  get ticketsEmAndamento(): number {
    return this.tickets().filter((t) => t.status === Status.EM_ANDAMENTO).length;
  }

  get ticketsResolvidos(): number {
    return this.tickets().filter((t) => t.status === Status.RESOLVIDO).length;
  }

  onTicketClick(chamado: Chamado): void {
    console.log('Ticket clicado:', chamado.cdChamado);
    this.router.navigate(['/chamados', chamado.cdChamado]);
  }

  abrirNovoTicket(): void {
    this.router.navigate(['/novo-ticket']);
  }
}
