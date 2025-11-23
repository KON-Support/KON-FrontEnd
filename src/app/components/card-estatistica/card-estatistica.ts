import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ChamadoService } from '../../services/chamado-service';
import { Chamado } from '../../shared/models/Chamado';

@Component({
  selector: 'app-card-estatistica',
  imports: [],
  templateUrl: './card-estatistica.html',
  styleUrl: './card-estatistica.scss',
})
export class CardEstatistica implements OnInit {
  private chamadoService = inject(ChamadoService);
  private cdr = inject(ChangeDetectorRef);

  protected tickets: Chamado[] = [];
  protected qtdTickets: number = 0;
  protected qtdSlaVencido = this.tickets.filter((ticket) => ticket.flSlaViolado).length;
  protected qtdResolvidosHoje: number = 0;
  protected qtdCriticos: number = 0;

  ngOnInit(): void {
    this.chamadoService.buscarChamados().subscribe((response) => {
      this.tickets = response;
      this.qtdTickets = this.tickets.length;
      this.qtdSlaVencido = this.tickets.filter((ticket) => ticket.flSlaViolado).length;
      this.cdr.detectChanges();
    });
  }
}
