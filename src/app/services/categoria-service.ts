import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../shared/models/Categoria';

@Injectable({
  providedIn: 'root',
})

export class CategoriaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8089/api/v1/categoria';

  listarCategoriasAtivas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/listar/ativas`);
  }

  listarTodasCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/listar/todas`);
  }

  buscarCategoria(cdCategoria: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/listar/${cdCategoria}`);
  }
}