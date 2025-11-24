import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChamadoService } from '../../services/chamado-service';
import { Chamado } from '../../shared/models/Chamado';

@Component({
  selector: 'app-chamados-urgentes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chamados-urgentes.html',
  styleUrl: './chamados-urgentes.scss',
})
export class ChamadosUrgentes implements OnInit {
  ticketUrgente: Chamado[] = [];

  private chamadoService = inject(ChamadoService);

  ngOnInit(): void {}
}
