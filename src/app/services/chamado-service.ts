import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Chamado } from '../shared/models/Chamado';

@Injectable({
  providedIn: 'root',
})
export class ChamadoService {
  private http = inject(HttpClient);

  buscarChamados() {
    return this.http.get<Chamado[]>('http://localhost:8089/api/v1/chamado/listar/todos');
  }
}
