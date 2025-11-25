export class Plano {

  constructor(

    public cdPlano: number,
    public nmPlano: string,
    public vlPlano: number,
    public limiteUsuarios: number | null,
    public hrRespostaPlano: number | null,
    public hrResolucaoPlano: number | null

  ) { }

}