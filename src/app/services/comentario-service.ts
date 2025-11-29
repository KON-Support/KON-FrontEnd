import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comentario } from '../shared/models/Comentario';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ComentarioService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/comentario`;

  comentarios(cdChamado?: number) {
    return this.http.get<Comentario[]>(`${this.baseUrl}/chamado/${cdChamado}`);
  }

  enviarComentario(comentario: Comentario | FormData): Observable<Comentario> {
    if (comentario instanceof FormData) {
      return this.http.post<Comentario>(`${this.baseUrl}/criar-com-anexo`, comentario);
    }

    return this.http.post<Comentario>(`${this.baseUrl}/criar`, comentario as Comentario);
  }

  baixarAnexo(cdAnexo: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/v1/anexo/baixar/${cdAnexo}`, {
      responseType: 'blob'
    });
  }
}
