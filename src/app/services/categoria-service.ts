import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Categoria } from '../shared/models/Categoria';

@Injectable({
  providedIn: 'root',
})

export class CategoriaService {
  
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8089/api/v1/categoria';

  listarCategoriasAtivas(): Observable<Categoria[]> {
    const url = `${this.baseUrl}/listar/ativas`;
    console.log('Chamando URL:', url);
    
    return this.http.get<Categoria[]>(url).pipe(
      tap(categorias => {
        console.log('Resposta recebida:', categorias);
        console.log('Quantidade de categorias:', categorias.length);
      })
    );
  }

  listarTodasCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/listar/todas`);
  }

  buscarCategoria(cdCategoria: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/listar/${cdCategoria}`);
  }
}