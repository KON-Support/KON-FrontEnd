import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Chamado } from '../../shared/models/Chamado';
import { ChamadoService } from '../../services/chamado-service';
import { CardChamado } from '../card-chamado/card-chamado';
import { Status } from '../../shared/models/Status';
import { NavbarUsuario } from "../navbar-usuario/navbar-usuario";

@Component({
  selector: 'app-chamados-user',
  standalone: true,
  imports: [CommonModule, FormsModule, CardChamado, NavbarUsuario],
  templateUrl: './chamados-user.html',
  styleUrl: './chamados-user.scss',
})

export class ChamadosUser implements OnInit {

  private chamadoService = inject(ChamadoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected chamados = signal<Chamado[]>([]);
  protected loading = signal(true);
  protected errorMessage = signal<string | null>(null);

  protected filtroBusca: string = '';
  protected filtroStatus: string = '';

  private usuarioLogadoId: number = 1;

  ngOnInit(): void {
    this.carregarChamadosDoUsuario();
  }

  private carregarChamadosDoUsuario(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.chamadoService.buscarChamados().subscribe({
      next: (response) => {
        const chamadosDoUsuario = response.filter(
          (chamado) => chamado.solicitante?.cdUsuario === this.usuarioLogadoId
        );

        this.chamados.set(chamadosDoUsuario);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage.set('Erro ao carregar seus tchamados. Tente novamente!');
        this.loading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  get chamadosFiltrados(): Chamado[] {
    let chamadosFiltrados = this.chamados();

    if (this.filtroBusca) {
      const busca = this.filtroBusca.toLowerCase();
      chamadosFiltrados = chamadosFiltrados.filter(
        (chamado) =>
          chamado.dsTitulo.toLowerCase().includes(busca) ||
          chamado.dsDescricao.toLowerCase().includes(busca) ||
          chamado.cdChamado.toString().includes(busca)
      );
    }

    if (this.filtroStatus) {
      chamadosFiltrados = chamadosFiltrados.filter(
        (chamado) => chamado.status === this.filtroStatus
      );
    }

    return chamadosFiltrados;
  }

  get chamadosAbertos(): number {
    return this.chamados().filter((t) => t.status === Status.ABERTO).length;
  }

  get chamadosEmAndamento(): number {
    return this.chamados().filter((t) => t.status === Status.EM_ANDAMENTO).length;
  }

  get chamadosResolvidos(): number {
    return this.chamados().filter((t) => t.status === Status.RESOLVIDO).length;
  }

  onTicketClick(chamado: Chamado): void {
    this.router.navigate(['/chamados', chamado.cdChamado]);
  }

  abrirNovoChamado(): void {
    this.router.navigate(['/novo-chamado']);
  }
}
