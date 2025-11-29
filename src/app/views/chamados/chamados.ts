import { ChangeDetectorRef, Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardChamado } from '../../components/card-chamado/card-chamado';
import { Chamado } from '../../shared/models/Chamado';
import { ChamadoService } from '../../services/chamado-service';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria-service';
import { Categoria } from '../../shared/models/Categoria';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-chamados',
  imports: [CardChamado, FormsModule, Navbar, CommonModule],
  templateUrl: './chamados.html',
  styleUrl: './chamados.scss',
})

export class Chamados implements OnInit {
  private chamadoService = inject(ChamadoService);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected chamados = signal<Chamado[]>([]);
  protected categorias: Categoria[] = [];
  protected qtdChamados = signal(0);
  protected loading = signal(true);

  protected filtroBusca: string = '';
  protected filtroStatus: string = '';
  protected filtroCategoria: string = '';

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    this.loading.set(true);

    this.chamadoService.buscarChamados().subscribe({
      next: (response) => {
        this.chamados.set(response);
        this.qtdChamados.set(response.length);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar chamados:', err);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });

    this.categoriaService.listarCategoriasAtivas().subscribe({
      next: (response) => {
        this.categorias = response;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      },
    });
  }

  get chamadosFiltrados(): Chamado[] {
    let chamadosFiltrados = this.chamados();

    if (this.filtroBusca) {
      const busca = this.filtroBusca.toLowerCase();
      chamadosFiltrados = chamadosFiltrados.filter((chamado) =>
        chamado.dsTitulo.toLowerCase().includes(busca) ||
        chamado.dsDescricao.toLowerCase().includes(busca) ||
        chamado.cdChamado.toString().includes(busca)
      );
    }

    if (this.filtroStatus) {
      const status = this.filtroStatus;
      chamadosFiltrados = chamadosFiltrados.filter((chamado) =>
        chamado.status === status
      );
    }

    if (this.filtroCategoria) {
      const categoria = this.filtroCategoria;
      chamadosFiltrados = chamadosFiltrados.filter((chamado) =>
        chamado.categoria?.nmCategoria === categoria
      );
    }

    return chamadosFiltrados;
  }

  onChamadoClick(chamado: Chamado): void {
    console.log('Chamado clicado:', chamado.cdChamado);
  }

  abrirNovoChamado(): void {
    this.router.navigate(['/novo-chamado']);
  }
}