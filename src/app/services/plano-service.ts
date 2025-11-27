import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Plano } from '../shared/models/Plano';

@Injectable({
  providedIn: 'root',
})
export class PlanoService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8089/api/plano';

  buscarTodos() {
    return this.http.get<Plano[]>(`${this.baseUrl}/listar`);
  }
  
}
