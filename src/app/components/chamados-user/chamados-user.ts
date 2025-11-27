import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Chamado } from '../../shared/models/Chamado';
import { ChamadoService } from '../../services/chamado-service';
import { CardChamado } from '../card-chamado/card-chamado';
import { Status } from '../../shared/models/Status';
import { Navbar } from "../navbar/navbar";
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-chamados-user',
  standalone: true,
  imports: [CommonModule, FormsModule, CardChamado, Navbar],
  templateUrl: './chamados-user.html',
  styleUrl: './chamados-user.scss',
})

export class ChamadosUser implements OnInit {

  private chamadoService = inject(ChamadoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected chamados = signal<Chamado[]>([]);
  protected loading = signal(true);
  protected errorMessage = signal<string | null>(null);

  protected filtroBusca: string = '';
  protected filtroStatus: string = '';

  private usuarioLogadoId: number = 0;

  ngOnInit(): void {
    this.obterUsuarioLogado();
    this.carregarChamadosDoUsuario();
  }

  private obterUsuarioLogado(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.usuarioLogadoId = user.cdUsuario;
      console.log('👤 Usuário logado ID:', this.usuarioLogadoId);
    } else {
      console.error('❌ Usuário não encontrado no AuthService');
      this.errorMessage.set('Erro ao identificar usuário. Faça login novamente.');
    }
  }

  private carregarChamadosDoUsuario(): void {
    if (!this.usuarioLogadoId) {
      this.errorMessage.set('Usuário não identificado.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    console.log('🔍 Buscando chamados do usuário:', this.usuarioLogadoId);

    this.chamadoService.buscarPorSolicitante(this.usuarioLogadoId).subscribe({
      next: (response) => {
        console.log('✅ Chamados recebidos:', response.length);
        this.chamados.set(response);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erro ao carregar chamados:', err);
        this.errorMessage.set('Erro ao carregar seus chamados. Tente novamente!');
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

  onChamadoClick(chamado: Chamado): void {
    console.log('Chamado clicado:', chamado.cdChamado);
    // Navegação para detalhes do chamado (implementar rota se necessário)
    // this.router.navigate(['/chamado', chamado.cdChamado]);
  }

  abrirNovoChamado(): void {
    this.router.navigate(['/novo-chamado-user']);
  }
}