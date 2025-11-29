import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chamado } from '../shared/models/Chamado';
import { Status } from '../shared/models/Status';
import { environment } from '../environments/environment';

export interface ChamadoRequest {
  dsTitulo: string;
  dsDescricao: string;
  status: Status;
  cdCategoria: number;
  solicitante: number;
  responsavel?: number | null;
  cdPlano?: number | null;
  anexo?: File | null;
}

@Injectable({
  providedIn: 'root',
})

export class ChamadoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1/chamado`;

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

    const formData = new FormData();
    
    formData.append('dsTitulo', chamado.dsTitulo);
    formData.append('dsDescricao', chamado.dsDescricao);
    formData.append('status', chamado.status);
    formData.append('cdCategoria', chamado.cdCategoria.toString());
    formData.append('solicitante', chamado.solicitante.toString());
    
    if (chamado.responsavel) {
      formData.append('responsavel', chamado.responsavel.toString());
    }
    
    if (chamado.cdPlano) {
      formData.append('cdPlano', chamado.cdPlano.toString());
    }
    
    if (chamado.anexo) {
      formData.append('anexo', chamado.anexo);
    }

    return this.http.post<Chamado>(`${this.baseUrl}/abrir`, formData);
  }

  atualizarStatus(cdChamado: number, status: Status): Observable<Chamado> {
    // Endpoint: PUT /api/v1/chamado/atualizar/status/:cdChamado?status=STATUS
    return this.http.put<Chamado>(
      `${this.baseUrl}/atualizar/status/${cdChamado}?status=${status}`,
      {}
    );
  }

  fecharChamado(cdChamado: number, status: Status): Observable<Chamado> {
    // Endpoint solicitado: PUT /api/v1/chamado/fechar/:cdChamado
    // Envia { status } no corpo para garantir informação do novo status
    return this.http.put<Chamado>(
      `${this.baseUrl}/fechar/${cdChamado}`,
      { status }
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