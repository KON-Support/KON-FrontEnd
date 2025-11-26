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
}
