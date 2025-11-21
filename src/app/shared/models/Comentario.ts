import { Anexo } from "./Anexo";
import { Chamado } from "./Chamado";
import { Usuario } from "./Usuario";

export class Comentario {
  constructor(
    public cdComentario: number,

    public chamado: Chamado,
    public usuario: Usuario,

    public anexo: Anexo | null,

    public dsConteudo: string,

    public hrCriacao: string,
    public dtCriacao: Date
  ) {}
}
