import { Component, inject } from '@angular/core';
import { Chamado } from '../../shared/models/Chamado';
import { ChamadoService } from '../../services/chamado-service';

@Component({
  selector: 'app-lista-tickets',
  imports: [],
  templateUrl: './lista-tickets.html',
  styleUrl: './lista-tickets.scss',
})
export class ListaTickets {}
