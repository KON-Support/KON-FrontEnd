import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { ChamadoDetalhes } from '../../components/chamado-detalhes/chamado-detalhes';
import { Comentario } from '../../shared/models/Comentario';
import { ComentarioService } from '../../services/comentario-service';
import { Chamado } from '../../shared/models/Chamado';
import { ActivatedRoute } from '@angular/router';
import { ChamadoService } from '../../services/chamado-service';
import { OnInit } from '@angular/core';
import { Usuario } from '../../shared/models/Usuario';

@Component({
  selector: 'app-chamado-comentarios',
  imports: [Navbar,ChamadoDetalhes],
  templateUrl: './chamado-comentarios.html',
  styleUrl: './chamado-comentarios.scss',
})
export class ChamadoComentarios implements OnInit {
  protected comentariosService = inject(ComentarioService);
  protected chamadoService = inject(ChamadoService);
  protected cdr = inject(ChangeDetectorRef);
  protected route = inject(ActivatedRoute);

  chamado: Chamado | null = null;

  protected comentarios: Comentario[] = [];
  protected comentario! : Comentario;

  ngOnInit(): void {
    const cdChamado = Number(this.route.snapshot.paramMap.get('cdChamado'));
    if (!cdChamado) return;

    this.comentariosService.Comentarios(cdChamado).subscribe(response => {
      this.comentarios = response;
      this.cdr.detectChanges();
    });

    this.chamadoService.buscarChamado(cdChamado).subscribe(response => {
      this.chamado = response;
      this.cdr.detectChanges();
    });
  }

  protected cdUsuario = localStorage.getItem('user');

postarComentario(comentario : Comentario){
    this.comentariosService.EnviarComentario(comentario).subscribe(response => {
      this.comentario = response;
      this.cdr.detectChanges();
    })
  }
 
}
