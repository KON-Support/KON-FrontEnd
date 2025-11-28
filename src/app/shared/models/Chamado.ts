import { Anexo } from './Anexo';
import { Categoria } from './Categoria';
import { SLA } from './Sla';
import { Status } from './Status';
import { Usuario } from './Usuario';

export class Chamado {
  constructor(
    public cdChamado: number,

    public dsTitulo: string,
    public dsDescricao: string,

    public status: Status,

    public solicitante: Usuario | null,
    public responsavel: Usuario | null,

    public anexo: Anexo | null,

    public categoria: Categoria | null,

    public sla: SLA | null,

    public dtCriacao: Date,
    public hrCriacao: string,

    public dtFechamento: Date | null,
    public hrFechamento: string | null,

    public dtVencimento: Date | null,
    public hrVencimento: string | null,

    public flSlaViolado: boolean
  ) {}
}
