import { Component, Input } from '@angular/core';
import { Comentario } from '../../shared/models/Comentario';
import { Chamado } from '../../shared/models/Chamado';

@Component({
  selector: 'app-chamado-detalhes',
  imports: [],
  templateUrl: './chamado-detalhes.html',
  styleUrl: './chamado-detalhes.scss',
})
export class ChamadoDetalhes {
 @Input() comentarios : Comentario[] = [];
 @Input() chamado: Chamado | null = null;
}
