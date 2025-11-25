import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioRequest {
  nmUsuario: string;
  dsSenha: string;
  nuFuncionario: number;
  dsEmail: string;
  flAtivo: boolean;
  roles: string[];
}

export interface UsuarioResponse {
  cdUsuario: number;
  nmUsuario: string;
  dsEmail: string;
  nuFuncionario: number;
  flAtivo: boolean;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8089/api/usuario';

  cadastrar(dto: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.baseUrl}/cadastro`, dto);
  }

  buscarTodos(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(`${this.baseUrl}/buscar/todos`);
  }

  desativar(cdUsuario: number): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(`${this.baseUrl}/desativar/${cdUsuario}`, {});
  }

  reativar(cdUsuario: number): Observable<UsuarioResponse> {
    return this.http.patch<UsuarioResponse>(`${this.baseUrl}/reativar/${cdUsuario}`, {});
  }
}
