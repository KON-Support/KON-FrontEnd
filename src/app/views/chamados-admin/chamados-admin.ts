import { ChangeDetectorRef, Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChamadoService } from '../../services/chamado-service';
import { CategoriaService } from '../../services/categoria-service';
import { Chamado } from '../../shared/models/Chamado';
import { Categoria } from '../../shared/models/Categoria';
import { CardChamado } from "../../components/card-chamado/card-chamado";
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-chamados-admin',
  imports: [CardChamado, Navbar, FormsModule, CommonModule],
  templateUrl: './chamados-admin.html',
  styleUrl: './chamados-admin.scss',
})

export class ChamadosAdmin implements OnInit {

  private chamadoService = inject(ChamadoService);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected chamados = signal<Chamado[]>([]);
  protected categorias = signal<Categoria[]>([]);
  protected qtdChamados = signal(0);
  protected loading = signal(true);

  protected filtroBusca: string = '';
  protected filtroStatus: string = '';
  protected filtroCategoria: string = '';

  ngOnInit(): void {
    console.log('ChamadosAdmin - Componente inicializado');
    this.carregarDados();
  }

  private carregarDados(): void {
    this.loading.set(true);

    this.chamadoService.buscarChamados().subscribe({
      next: (response) => {
        console.log('Chamados carregados:', response.length);
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
        console.log('Categorias carregadas:', response.length);
        this.categorias.set(response);
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
      chamadosFiltrados = chamadosFiltrados.filter((chamado) =>
        chamado.status === this.filtroStatus
      );
    }

    if (this.filtroCategoria) {
      chamadosFiltrados = chamadosFiltrados.filter((chamado) =>
        chamado.categoria?.nmCategoria === this.filtroCategoria
      );
    }

    console.log('Chamados filtrados:', chamadosFiltrados.length);
    return chamadosFiltrados;
  }

  onChamadoClick(chamado: Chamado): void {
    console.log('Chamado clicado:', chamado.cdChamado);
  }

  abrirNovoChamado(): void {
    this.router.navigate(['/novo-chamado']);
  }
}