export class EntityMissingParams extends Error {
  params: string[];

  constructor(params: string[]) {
    super("Parametros não encontrados.");
    this.params = params;
  }
}
