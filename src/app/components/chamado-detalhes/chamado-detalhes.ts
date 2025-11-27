import { ChangeDetectorRef, Component, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comentario } from '../../shared/models/Comentario';
import { Chamado } from '../../shared/models/Chamado';
import { RouterLink } from "@angular/router";
import { ComentarioService } from '../../services/comentario-service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { ChamadoService } from '../../services/chamado-service';
import { Status } from '../../shared/models/Status';

@Component({
  selector: 'app-chamado-detalhes',
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './chamado-detalhes.html',
  styleUrl: './chamado-detalhes.scss',
})
export class ChamadoDetalhes {
 @Input() comentarios : Comentario[] = [];
 @Input() chamado: Chamado | null = null;
 @Output() comentarioAdicionado = new EventEmitter<Comentario>();

 private comentarioService = inject(ComentarioService);
 private authService = inject(AuthService);
 private chamadoService = inject(ChamadoService);
 private cdr = inject(ChangeDetectorRef);

 novoConteudo: string = '';
 enviando: boolean = false;
  arquivoSelecionado: File | null = null;
 
  // status control
  statuses: Status[] = [Status.ABERTO, Status.EM_ANDAMENTO, Status.RESOLVIDO, Status.FECHADO];
  selectedStatus: Status | null = null;
  atualizandoStatus: boolean = false;
  atribuindo: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chamado']) {
      this.selectedStatus = this.chamado?.status ?? null;
    }
  }

  isAgente(): boolean {
    try {
      return this.authService.isAgente();
    } catch (e) {
      return false;
    }
  }

  getStatusesDisponiveis(): Status[] {
    // Se chamado está resolvido ou fechado, não permite reabertura
    if (this.isChamadoFechadoOuResolvido()) {
      return [this.chamado?.status as Status];
    }
    // Se agente e chamado tem responsavel, apenas RESOLVIDO e FECHADO
    if (this.isAgente() && this.chamado?.responsavel) {
      return [Status.RESOLVIDO, Status.FECHADO];
    }
    // Retorna todos os statuses (para não-agentes, o select estará desabilitado)
    return this.statuses;
  }

  chamadoAceitoMesmoUsuario(): boolean {
    if (!this.chamado?.responsavel || !this.isAgente()) return false;
    const usuarioAtual = this.authService.currentUser();
    return this.chamado.responsavel.cdUsuario === usuarioAtual?.cdUsuario;
  }

  isChamadoFechadoOuResolvido(): boolean {
    return this.chamado?.status === Status.RESOLVIDO || this.chamado?.status === Status.FECHADO;
  }

  getRolesDosUsuarios(): { [key: number]: string[] } {
    const roles: { [key: number]: string[] } = {};
    this.comentarios.forEach(comentario => {
      const cdUsuario = (comentario as any)?.cdUsuario || (comentario as any)?.usuario?.cdUsuario;
      if (cdUsuario && !roles[cdUsuario]) {
        const userRoles = (comentario as any)?.usuario?.roleModel || (comentario as any)?.roles || [];
        roles[cdUsuario] = userRoles.map((r: any) => typeof r === 'string' ? r : r.nmRole);
      }
    });
    return roles;
  }

  getComentarioBadgeClass(comentario: Comentario): string {
    const cdUsuario = (comentario as any)?.cdUsuario || (comentario as any)?.usuario?.cdUsuario;
    const roles = this.getRolesDosUsuarios()[cdUsuario] || [];
    if (roles.includes('ROLE_ADMIN')) return 'bg-warning';
    if (roles.includes('ROLE_AGENTE')) return 'bg-success';
    if (roles.includes('ROLE_USER')) return 'bg-info';
    return 'bg-light';
  }

  getComentarioBorderClass(comentario: Comentario): string {
    const cdUsuario = (comentario as any)?.cdUsuario || (comentario as any)?.usuario?.cdUsuario;
    const roles = this.getRolesDosUsuarios()[cdUsuario] || [];
    if (roles.includes('ROLE_ADMIN')) return 'border-warning';
    if (roles.includes('ROLE_AGENTE')) return 'border-success';
    if (roles.includes('ROLE_USER')) return 'border-info';
    return 'border-light';
  }

  getComentarioNomeUsuario(comentario: Comentario): string {
    return (comentario as any)?.usuario?.nmUsuario || (comentario as any)?.nmUsuario || 'Usuário desconhecido';
  }

  onStatusChange(): void {
    if (!this.chamado || !this.selectedStatus) return;
    // garantia de segurança: somente agentes podem alterar status
    if (!this.isAgente()) {
      alert('Somente agentes podem alterar o status deste chamado.');
      // resetar seleção para o status atual do chamado
      this.selectedStatus = this.chamado.status ?? null;
      return;
    }
    this.atualizandoStatus = true;
    const cd = this.chamado.cdChamado;
    // se o novo status for FECHADO, usar o endpoint de fechar
    if (this.selectedStatus === Status.FECHADO) {
      this.chamadoService.fecharChamado(cd, this.selectedStatus).subscribe({
        next: (updated) => {
          this.chamado = updated;
          this.selectedStatus = updated.status;
          this.atualizandoStatus = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao fechar chamado:', err);
          this.atualizandoStatus = false;
          alert('Erro ao fechar chamado.');
        }
      });
      return;
    }

    this.chamadoService.atualizarStatus(cd, this.selectedStatus).subscribe({
      next: (updated) => {
        this.chamado = updated;
        this.selectedStatus = updated.status;
        this.atualizandoStatus = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao atualizar status:', err);
        this.atualizandoStatus = false;
        alert('Erro ao atualizar status.');
      }
    });
  }

  aceitarChamado(): void {
    // apenas agentes podem aceitar chamados
    if (!this.isAgente()) {
      alert('Apenas agentes podem aceitar chamados.');
      return;
    }
    if (!this.chamado) return;
    const usuario = this.authService.currentUser();
    const cdUsuario = usuario?.cdUsuario;
    if (!cdUsuario) {
      alert('Usuário não identificado.');
      return;
    }
    this.atribuindo = true;
    this.chamadoService.atribuirChamado(this.chamado.cdChamado, cdUsuario).subscribe({
      next: (updated) => {
        this.chamado = updated;
        this.selectedStatus = Status.EM_ANDAMENTO;
        // após atribuir, mudar status automaticamente para EM_ANDAMENTO
        this.chamadoService.atualizarStatus(this.chamado.cdChamado, Status.EM_ANDAMENTO).subscribe({
          next: (statusUpdated) => {
            this.chamado = statusUpdated;
            this.selectedStatus = statusUpdated.status;
            this.atribuindo = false;
            this.cdr.detectChanges();
            alert('Chamado atribuído a você e status alterado para Em Andamento.');
          },
          error: (err) => {
            console.error('Erro ao atualizar status para EM_ANDAMENTO:', err);
            this.atribuindo = false;
            alert('Chamado atribuído, mas houve erro ao atualizar status.');
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Erro ao atribuir chamado:', err);
        this.atribuindo = false;
        alert('Erro ao aceitar chamado.');
      }
    });
  }

 enviarComentario(): void {
   if (!this.novoConteudo.trim() || !this.chamado) {
     return;
   }

   // Bloquear comentários em chamados fechados ou resolvidos
   if (this.isChamadoFechadoOuResolvido()) {
     alert('Não é possível comentar em chamados com status Resolvido ou Fechado.');
     return;
   }

   this.enviando = true;

   const usuario = this.authService.currentUser();
   const cdUsuario = usuario?.cdUsuario;
   const cdChamado = this.chamado.cdChamado;

   if (!cdUsuario || !cdChamado) {
     alert('Erro: usuário ou chamado não identificado.');
     this.enviando = false;
     return;
   }

   // se houver arquivo, enviar como FormData
   if (this.arquivoSelecionado) {
     const form = new FormData();
     form.append('dsConteudo', this.novoConteudo);
     form.append('cdChamado', String(cdChamado));
     form.append('cdUsuario', String(cdUsuario));
     form.append('anexo', this.arquivoSelecionado);

     // debug: listar chaves do FormData
     const keys: string[] = [];
     form.forEach((value, key) => keys.push(key));
     console.debug('Enviando FormData keys:', keys);
     console.debug('Token presente:', this.authService.getToken() ? true : false);

     this.comentarioService.EnviarComentario(form as any).subscribe({
       next: (response) => {
         this.comentarios.push(response);
         this.novoConteudo = '';
         this.arquivoSelecionado = null;
         this.enviando = false;
         this.cdr.detectChanges();
         this.comentarioAdicionado.emit(response);
       },
       error: (error) => {
         console.error('Erro ao enviar comentário (FormData):', error);
         this.enviando = false;
         if (error.status === 401 || error.status === 403) {
           alert('Sessão expirada ou sem permissão. Faça login novamente.');
         } else {
           alert('Erro ao enviar comentário. Tente novamente. (' + (error.status || 'erro') + ')');
         }
       }
     });
     return;
   }

   const payload = {
     dsConteudo: this.novoConteudo,
     cdChamado: cdChamado,
     cdUsuario: cdUsuario
   };

   console.debug('Enviando payload JSON:', payload, 'tokenPresent=', this.authService.getToken() ? true : false);

   this.comentarioService.EnviarComentario(payload as any).subscribe({
     next: (response) => {
       this.comentarios.push(response);
       this.novoConteudo = '';
       this.enviando = false;
       this.cdr.detectChanges();
       this.comentarioAdicionado.emit(response);
     },
     error: (error) => {
       console.error('Erro ao enviar comentário (JSON):', error);
       this.enviando = false;
       if (error.status === 401 || error.status === 403) {
         alert('Sessão expirada ou sem permissão. Faça login novamente.');
       } else {
         alert('Erro ao enviar comentário. Tente novamente. (' + (error.status || 'erro') + ')');
       }
     }
   });
 }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivoSelecionado = input.files[0];
    }
  }

  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  downloadAnexo(cdAnexo?: number | null, filename?: string): void {
    if (!cdAnexo) return;
    const url = `http://localhost:8089/api/v1/anexo/baixar/${cdAnexo}`;
    console.debug('Baixando anexo, url=', url, 'filename=', filename, 'tokenPresent=', this.authService.getToken() ? true : false);
    this.comentarioService.baixarAnexo(cdAnexo).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `anexo_${cdAnexo}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao baixar anexo:', err);
        alert('Erro ao baixar anexo.');
      }
    });
  }

  comentarioHasAnexo(comentario: Comentario): boolean {
    if (!comentario) return false;
    // caso comum: anexo como objeto
    if ((comentario as any).anexo) return true;
    // alguns backends retornam apenas ids
    if ((comentario as any).cdAnexo) return true;
    return false;
  }

  getAnexoCd(comentario: Comentario): number | null {
    if (!comentario) return null;
    if ((comentario as any).anexo && (comentario as any).anexo.cdAnexo) return (comentario as any).anexo.cdAnexo;
    if ((comentario as any).cdAnexo) return (comentario as any).cdAnexo;
    return null;
  }

  getAnexoName(comentario: Comentario): string | undefined {
    if (!comentario) return undefined;
    if ((comentario as any).anexo && (comentario as any).anexo.nmArquivo) return (comentario as any).anexo.nmArquivo;
    if ((comentario as any).nmArquivo) return (comentario as any).nmArquivo;
    return undefined;
  }
}

export interface ChamadoDetalhesBindings {}
