import { ChangeDetectorRef, Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListaChamados } from '../../components/lista-chamados/lista-chamados';
import { Chamado } from '../../shared/models/Chamado';
import { ChamadoService } from '../../services/chamado-service';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria-service';
import { Categoria } from '../../shared/models/Categoria';
import { NavbarAgente } from '../../components/navbar-agente/navbar-agente';

@Component({
  selector: 'app-chamados',
  imports: [ListaChamados, RouterLink, FormsModule, NavbarAgente],
  templateUrl: './chamados.html',
  styleUrl: './chamados.scss',
})
export class Chamados implements OnInit {
  private chamadoService = inject(ChamadoService);
  private categoriaService = inject(CategoriaService);
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

        console.log('💾 Estado atualizado - Chamados:', this.chamados().length);
      },
      error: (err) => {
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });

    this.categoriaService.listarCategoriasAtivas().subscribe({
      next: (response) => {
        console.log('✅ Categorias carregadas:', response.length);
        this.categorias = response;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('❌ Erro ao carregar categorias:', err);
      },
    });
  }

  get chamadosFiltrados(): Chamado[] {
    let chamadosFiltrados = this.chamados();

    if (this.filtroBusca) {
      const busca = this.filtroBusca.toLowerCase();
      chamadosFiltrados = chamadosFiltrados.filter((chamado) =>
        chamado.dsTitulo.toLowerCase().includes(busca)
      );
    }

    if (this.filtroStatus) {
      const status = this.filtroStatus.toLowerCase();
      chamadosFiltrados = chamadosFiltrados.filter((chamado) =>
        chamado.status.toLowerCase().includes(status)
      );
    }

    if (this.filtroCategoria) {
      const categoria = this.filtroCategoria.toLowerCase();
      chamadosFiltrados = chamadosFiltrados.filter((chamado) =>
        chamado.categoria.nmCategoria.toLowerCase().includes(categoria)
      );
    }

    console.log('🔍 Chamados filtrados:', chamadosFiltrados.length);
    return chamadosFiltrados;
  }
}
