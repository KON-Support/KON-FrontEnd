import { ChangeDetectorRef, Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { Comentario } from '../../shared/models/Comentario';
import { Chamado } from '../../shared/models/Chamado';
import { RouterLink } from "@angular/router";
import { ComentarioService } from '../../services/comentario-service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-chamado-detalhes',
  imports: [RouterLink,FormsModule],
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

   const payload = {
     dsConteudo: this.novoConteudo,
     cdChamado: cdChamado,
     cdUsuario: cdUsuario
   };

   this.comentarioService.EnviarComentario(payload as any).subscribe({
     next: (response) => {
       this.comentarios.push(response);
       this.novoConteudo = '';
       this.enviando = false;
       this.cdr.detectChanges();
       this.comentarioAdicionado.emit(response);
     },
     error: (error) => {
       console.error('Erro ao enviar comentário:', error);
       this.enviando = false;
       alert('Erro ao enviar comentário. Tente novamente.');
     }
   });
 }
}
