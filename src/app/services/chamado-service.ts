import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chamado } from '../shared/models/Chamado';
import { Status } from '../shared/models/Status';

export interface ChamadoRequest {
  dsTitulo: string;
  dsDescricao: string;
  status: Status;
  cdCategoria: number;
  solicitante: number;
  responsavel?: number | null;
}

@Injectable({
  providedIn: 'root',
})

export class ChamadoService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8089/api/v1/chamado';

  buscarChamados(): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(`${this.baseUrl}/listar/todos`);
  }

  buscarChamado(cdChamado: number): Observable<Chamado> {
    return this.http.get<Chamado>(`${this.baseUrl}/listar/${cdChamado}`);
  }

  buscarPorStatus(status: Status): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(`${this.baseUrl}/listar/status/${status}`);
  }

  abrirChamado(chamado: ChamadoRequest): Observable<Chamado> {
    return this.http.post<Chamado>(`${this.baseUrl}/abrir`, chamado);
  }

  atualizarStatus(cdChamado: number, status: Status): Observable<Chamado> {
    return this.http.put<Chamado>(
      `${this.baseUrl}/atualizar/status/${cdChamado}?status=${status}`,
      {}
    );
  }

  fecharChamado(cdChamado: number, status: Status): Observable<Chamado> {
    return this.http.put<Chamado>(
      `${this.baseUrl}/fechar/${cdChamado}?status=${status}`,
      {}
    );
  }

  atribuirChamado(
    cdChamado: number,
    responsavel?: number,
    cdCategoria?: number,
    cdSLA?: number
  ): Observable<Chamado> {
    return this.http.put<Chamado>(`${this.baseUrl}/atribuir/${cdChamado}`, {
      responsavel,
      cdCategoria,
      cdSLA,
    });
  }

  adicionarAnexo(cdChamado: number, cdAnexo: number): Observable<Chamado> {
    return this.http.put<Chamado>(
      `${this.baseUrl}/adicionar/anexo/${cdChamado}`,
      cdAnexo
    );
  }

  buscarPorSolicitante(cdUsuario: number): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(`${this.baseUrl}/listar/solicitante/${cdUsuario}`);
  }

  buscarPorResponsavel(cdUsuario: number): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(`${this.baseUrl}/listar/responsavel/${cdUsuario}`);
  }

  buscarNaoAtribuidos(): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(`${this.baseUrl}/listar/nao-atribuidos`);
  }

}