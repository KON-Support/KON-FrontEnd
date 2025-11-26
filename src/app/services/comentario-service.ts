import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comentario } from '../shared/models/Comentario';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
   private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8089/api/v1/comentario';

  Comentarios(cdChamado : number):Observable<Comentario[]>{
    return this.http.get<Comentario[]>(`${this.baseUrl}/chamado/${cdChamado}`);
  }
  
  EnviarComentario(comentario: Comentario | FormData): Observable<Comentario> {
    // Se for FormData (contém anexo), enviar para endpoint de criação com anexo
    if (comentario instanceof FormData) {
      return this.http.post<Comentario>(`${this.baseUrl}/criar-com-anexo`, comentario);
    }

    // Caso padrão: enviar JSON para criação simples
    return this.http.post<Comentario>(`${this.baseUrl}/criar`, comentario as Comentario);
  }

  baixarAnexo(cdAnexo: number): Observable<Blob> {
    // Use o endpoint direto de anexo conforme especificado
    const url = `http://localhost:8089/api/v1/anexo/baixar/${cdAnexo}`;
    return this.http.get(url, { responseType: 'blob' });
  }

}
