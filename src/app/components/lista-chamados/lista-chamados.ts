import { Component, inject, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chamado } from '../../shared/models/Chamado';
import { ChamadoService } from '../../services/chamado-service';
import { CardChamado } from '../card-chamado/card-chamado';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-chamados',
  standalone: true,
  imports: [CommonModule, CardChamado],
  templateUrl: './lista-chamados.html',
  styleUrl: './lista-chamados.scss',
})

export class ListaChamados implements OnInit {

  private chamadoService = inject(ChamadoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  @Input() chamados: Chamado[] = [];
  protected loading = true;

  ngOnInit(): void {
    console.log('ListaChamados - Componente inicializado');
    this.carregarChamados();
  }

  private carregarChamados(): void {
    console.log('Iniciando carregamento de chamados...');
    this.loading = true;

    this.chamadoService.buscarChamados().subscribe({
      next: (response) => {
        console.log('Chamados recebidos:', response);
        console.log('Quantidade:', response.length);

        this.chamados = response;
        this.loading = false;

        this.cdr.detectChanges();

        console.log('Chamados armazenados e view atualizada');
      },
      error: (err) => {
        console.error('Erro ao carregar chamados:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onChamadoClick(chamado: Chamado): void {
    console.log('Chamado clicado:', chamado.cdChamado);
    this.router.navigate(['/chamados', chamado.cdChamado]);
  }
}
