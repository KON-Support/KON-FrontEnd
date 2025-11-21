import { Chamado } from './Chamado';
import { Usuario } from './Usuario';

export class Anexo {
  constructor(
    public cdAnexo: number,

    public chamado: Chamado,
    public usuario: Usuario,

    public nmArquivo: string,
    public dsTipoArquivo: string,

    public dtUpload: Date,
    public hrUpload: string,

    public arquivo: Uint8Array
  ) {}
}
