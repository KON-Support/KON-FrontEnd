import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChamadoService } from '../../services/chamado-service';
import { Chamado } from '../../shared/models/Chamado';
import { CardChamado } from '../card-chamado/card-chamado';

@Component({
  selector: 'app-chamados-nao-atribuidos',
  standalone: true,
  imports: [CommonModule, FormsModule, CardChamado],
  templateUrl: './chamados-nao-atribuidos.html',
  styleUrl: './chamados-nao-atribuidos.scss',
})
export class ChamadosNaoAtribuidos implements OnInit {
  private chamadoService = inject(ChamadoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected chamadosNaoAtribuidos = signal<Chamado[]>([]);
  protected loading = signal(true);
  
  protected filtroBusca: string = '';
  protected filtroStatus: string = '';

  ngOnInit(): void {
    console.log('ChamadosNaoAtribuidos - Componente inicializado');
    this.carregarChamadosNaoAtribuidos();
  }

  private carregarChamadosNaoAtribuidos(): void {
    console.log('Carregando chamados não atribuídos');
    this.loading.set(true);

    this.chamadoService.buscarChamados().subscribe({
      next: (response) => {
        const chamados = response.filter((chamado) => !chamado.responsavel);
        console.log('Chamados não atribuídos carregados:', chamados.length);
        this.chamadosNaoAtribuidos.set(chamados);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar chamados não atribuídos:', err);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  get chamadosFiltrados(): Chamado[] {
    let chamados = this.chamadosNaoAtribuidos();

    if (this.filtroBusca) {
      const busca = this.filtroBusca.toLowerCase();
      chamados = chamados.filter(
        (chamado) =>
          chamado.dsTitulo.toLowerCase().includes(busca) ||
          chamado.dsDescricao.toLowerCase().includes(busca) ||
          chamado.cdChamado.toString().includes(busca)
      );
    }

    if (this.filtroStatus) {
      chamados = chamados.filter((chamado) => chamado.status === this.filtroStatus);
    }

    return chamados;
  }

  onChamadoClick(chamado: Chamado): void {
    console.log('Chamado clicado:', chamado.cdChamado);
    this.router.navigate(['/chamados', chamado.cdChamado]);
  }
}
