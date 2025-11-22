import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ListaTickets } from '../../components/lista-tickets/lista-tickets';
import { Chamado } from '../../shared/models/Chamado';
import { ChamadoService } from '../../services/chamado-service';
import { FiltrosTicket } from '../../components/filtros-ticket/filtros-ticket';

@Component({
  selector: 'app-tickets',
  imports: [ListaTickets, FiltrosTicket],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss',
})
export class Tickets {
  private chamadoService = inject(ChamadoService);
  private cdr = inject(ChangeDetectorRef);

  protected tickets: Chamado[] = [];
  protected qtdTickets: number = 0;

  ngOnInit(): void {
    this.chamadoService.buscarChamados().subscribe((response) => {
      this.tickets = response;
      this.qtdTickets = this.tickets.length;
      this.cdr.detectChanges();
    });
  }
}
