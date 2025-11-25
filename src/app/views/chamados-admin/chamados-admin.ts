import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { ChamadoService } from '../../services/chamado-service';
import { CategoriaService } from '../../services/categoria-service';
import { Chamado } from '../../shared/models/Chamado';
import { Categoria } from '../../shared/models/Categoria';
import { ListaChamados } from "../../components/lista-chamados/lista-chamados";
import { NavbarAdmin } from '../../components/navbar-admin/navbar-admin';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chamados-admin',
  imports: [ListaChamados, NavbarAdmin, FormsModule, RouterLink],
  templateUrl: './chamados-admin.html',
  styleUrl: './chamados-admin.scss',
})
export class ChamadosAdmin {

  private chamadoService = inject(ChamadoService);
  private categoriaService = inject(CategoriaService);
  private cdr = inject(ChangeDetectorRef);

  protected chamados = signal<Chamado[]>([]);
  protected categorias = signal<Categoria[]>([]);
  protected qtdChamados = signal(0);
  protected loading = signal(true);

  protected filtroBusca: string = '';
  protected filtroStatus: string = '';
  protected filtroCategoria: string = '';

  ngOnInit(): void {
    console.log('🎬 Tickets - Componente inicializado');
    this.carregarDados();
  }

  private carregarDados(): void {
    this.loading.set(true);

    this.chamadoService.buscarChamados().subscribe({
      next: (response) => {
        console.log('✅ Tickets carregados:', response.length);
        this.chamados.set(response);
        this.qtdChamados.set(response.length);
        this.loading.set(false);

        this.cdr.markForCheck();

        console.log('💾 Estado atualizado - Chamados:', this.chamados().length);
      },
      error: (err) => {
        console.error('❌ Erro ao carregar chamados:', err);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });

    this.categoriaService.listarCategoriasAtivas().subscribe({
      next: (response) => {
        console.log('✅ Categorias carregadas:', response.length);
        this.categorias.set(response);
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
