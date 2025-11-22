import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chamado } from '../../shared/models/Chamado';
import { ChamadoService } from '../../services/chamado-service';
import { CardChamado } from '../card-chamado/card-chamado';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-tickets',
  standalone: true,
  imports: [CommonModule, CardChamado],
  templateUrl: './lista-tickets.html',
  styleUrl: './lista-tickets.scss',
})

export class ListaTickets implements OnInit {
  private chamadoService = inject(ChamadoService);
  private router = inject(Router);

  protected tickets: Chamado[] = [];
  protected loading = true;

  ngOnInit(): void {
    this.carregarTickets();
  }

  private carregarTickets(): void {
    this.chamadoService.buscarChamados().subscribe({
      next: (response) => {
        this.tickets = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar tickets:', err);
        this.loading = false;
      },
    });
  }

  onTicketClick(chamado: Chamado): void {
    this.router.navigate(['/tickets', chamado.cdChamado]);
  }
}