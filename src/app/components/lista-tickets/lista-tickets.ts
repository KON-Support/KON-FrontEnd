import { Component, inject, Input, OnInit, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  @Input() tickets: Chamado[] = [];
  protected loading = true;

  ngOnInit(): void {
    console.log('🎬 ListaTickets - Componente inicializado');
    this.carregarTickets();
  }

  private carregarTickets(): void {
    console.log('🔄 Iniciando carregamento de tickets...');
    this.loading = true;
    
    this.chamadoService.buscarChamados().subscribe({
      next: (response) => {
        console.log('✅ Tickets recebidos:', response);
        console.log('📊 Quantidade:', response.length);
        
        this.tickets = response;
        this.loading = false;

        this.cdr.detectChanges();
        
        console.log('💾 Tickets armazenados e view atualizada');
      },
      error: (err) => {
        console.error('❌ Erro ao carregar tickets:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onTicketClick(chamado: Chamado): void {
    console.log('🎯 Ticket clicado:', chamado.cdChamado);
    this.router.navigate(['/tickets', chamado.cdChamado]);
  }
}