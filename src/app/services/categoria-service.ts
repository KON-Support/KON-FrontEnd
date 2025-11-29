import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Categoria } from '../shared/models/Categoria';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/categoria`;

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
