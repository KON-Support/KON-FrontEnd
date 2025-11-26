import { ChangeDetectorRef, Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comentario } from '../../shared/models/Comentario';
import { Chamado } from '../../shared/models/Chamado';
import { RouterLink } from "@angular/router";
import { ComentarioService } from '../../services/comentario-service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

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
 private cdr = inject(ChangeDetectorRef);

 novoConteudo: string = '';
 enviando: boolean = false;
  arquivoSelecionado: File | null = null;

 enviarComentario(): void {
   if (!this.novoConteudo.trim() || !this.chamado) {
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
