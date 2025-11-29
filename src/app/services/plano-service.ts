import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Plano } from '../shared/models/Plano';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class PlanoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/plano`;

  buscarTodos() {
    return this.http.get<Plano[]>(`${this.baseUrl}/listar`);
  }
  
}
