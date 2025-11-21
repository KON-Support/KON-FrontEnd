import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChamadoService } from '../../services/chamado-service';
import { Chamado } from '../../shared/models/Chamado';

@Component({
  selector: 'app-tickets-urgentes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets-urgentes.html',
  styleUrl: './tickets-urgentes.scss',
})
export class TicketsUrgentes implements OnInit {
  ticketUrgente: Chamado[] = [];

  private chamadoService = inject(ChamadoService);

  ngOnInit(): void {}
}
