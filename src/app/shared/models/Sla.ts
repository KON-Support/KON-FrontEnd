import { Categoria } from './Categoria';
import { Usuario } from './Usuario';

export class SLA {
  constructor(
    public cdSLA: number,

    public qtHorasResposta: number,
    public qtHorasResolucao: number,

    public flAtivo: boolean,

    public usuario: Usuario,
    public categoria: Categoria
  ) {}
}
