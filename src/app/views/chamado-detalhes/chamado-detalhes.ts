import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { ChamadoService } from '../../services/chamado-service';
import { Chamado } from '../../shared/models/Chamado';
import { Comentario } from '../../shared/models/Comentario';
import { ComentarioService } from '../../services/comentario-service';
import { UsuarioService } from '../../services/usuario-service';
import { Usuario } from '../../shared/models/Usuario';
import { Status } from '../../shared/models/Status';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-chamado-detalhes',
  imports: [CommonModule, RouterLink, FormsModule, Navbar],
  templateUrl: './chamado-detalhes.html',
  styleUrl: './chamado-detalhes.scss',
})
export class ChamadoDetalhes implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private chamadoService = inject(ChamadoService);
  private comentarioService = inject(ComentarioService);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  protected chamado: Chamado | null = null;
  protected usuario: Usuario | null = null;
  protected novoConteudo = '';
  protected comentarios: Comentario[] = [];
  protected todosStatus = Object.values(Status);
  private pollingInterval: any;

  protected formatarStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }

  recarregarComentarios(): void {
    if (!this.chamado?.cdChamado) return;

    this.comentarioService.comentarios(this.chamado.cdChamado).subscribe({
      next: (response) => {
        const novosComentarios = response.length > this.comentarios.length;
        this.comentarios = response;
        this.cdr.detectChanges();

        if (novosComentarios) {
          this.chatNoFinal();
        }
      },
      error: (err) => {
        console.error('Erro ao recarregar comentários', err);
        this.cdr.detectChanges();
      },
    });
  }

  chatNoFinal(): void {
    try {
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }, 100);
    } catch (err) {}
  }

  ngOnInit(): void {
    const cdChamado = Number(this.route.snapshot.params['cdChamado']);

    if (!cdChamado) {
      return;
    }

    this.chamadoService.buscarChamado(cdChamado).subscribe({
      next: (response) => {
        this.chamado = response;
        this.cdr.detectChanges();
        this.recarregarComentarios();

        this.pollingInterval = setInterval(() => {
          this.recarregarComentarios();
        }, 5000);
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes do chamado', err);
        this.cdr.detectChanges();
      },
    });
    this.isAgente();
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  getComentarioNomeUsuario(comentario: Comentario): string {
    return (comentario as any)?.usuario?.nmUsuario || (comentario as any)?.nmUsuario;
  }

  formatarHora(hrCriacao: string): string {
    const [hours, minutes] = hrCriacao.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  comentarioTemAnexo(comentario: Comentario): boolean {
    if (comentario.cdAnexo) {
      return true;
    }
    return false;
  }

  baixarAnexo(cdAnexo: any, filename?: string): void {
    this.comentarioService.baixarAnexo(cdAnexo).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'anexo';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao baixar anexo', err);
      },
    });
  }

  protected formatarData(data: Date | string | null | undefined): string {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  protected comentarioPossuiAnexo(comentario: Comentario): boolean {
    return this.comentarioTemAnexo(comentario);
  }

  protected novoAnexo: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.novoAnexo = input.files && input.files.length ? input.files[0] : null;
  }

  postarComentario(): void {
    if (!this.novoConteudo.trim() || !this.chamado) {
      return;
    }

    const usuario = this.authService.currentUser();

    const formData = new FormData();
    formData.append('cdChamado', String(this.chamado.cdChamado));
    formData.append('cdUsuario', usuario?.cdUsuario ? String(usuario.cdUsuario) : '');
    formData.append('dsConteudo', this.novoConteudo);

    if (this.novoAnexo) {
      formData.append('anexo', this.novoAnexo, this.novoAnexo.name);
    }

    this.comentarioService.enviarComentario(formData).subscribe(() => {
      this.novoConteudo = '';
      this.novoAnexo = null;
      formData.delete('anexo');
      this.recarregarComentarios();
    });
  }

  isAgente(): Boolean {
    return this.authService.hasRole('ROLE_AGENTE');
  }

  atualizarStatus(status: Status): void {
    if (!this.chamado) return;

    this.chamadoService.atualizarStatus(this.chamado.cdChamado, status).subscribe({
      next: (response) => {
        this.chamado = response;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao atualizar status do chamado', err);
        this.cdr.detectChanges();
      },
    });
  }

  onStatusChange(event: Event) {
    if (!this.chamado) return;

    const selectElement = event.target as HTMLSelectElement;
    let novoStatus = selectElement.value as Status;

    this.chamadoService.atualizarStatus(this.chamado.cdChamado, novoStatus).subscribe({
      next: (response) => {
        this.chamado = response;
        this.cdr.detectChanges();
        window.location.reload();
      },
      error: (err) => {
        console.error('Erro ao atualizar status do chamado', err);
        this.cdr.detectChanges();
      },
    });
  }

  assumirChamado(): void {
    if (!this.chamado) return;

    const usuario = this.authService.currentUser();

    this.chamadoService.atribuirChamado(this.chamado.cdChamado, usuario?.cdUsuario).subscribe({
      next: (response) => {
        this.chamado = response;
        this.cdr.detectChanges();
        window.location.reload();
      },
      error: (err) => {
        console.error('Erro ao assumir o chamado', err);
        this.cdr.detectChanges();
      },
    });
  }
}
