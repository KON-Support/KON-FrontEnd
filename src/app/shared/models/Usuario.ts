import { Plano } from './Plano';
import { Role } from './Role';

export class Usuario {
  constructor(
    public cdUsuario: number,

    public nmUsuario: string,
    public dsSenha: string,
    public dsEmail: string,

    public nuFuncionario: number,

    public plano: Plano | null,

    public dtCriacao: Date,
    public dtUltimoAcesso: Date | null,

    public flAtivo: boolean,

    public roleModel: Role[]
  ) { }
}
