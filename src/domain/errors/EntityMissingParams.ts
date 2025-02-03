export class EntityMissingParams extends Error {
  static readonly type = 'EntityMissingParams';
  readonly type = EntityMissingParams.type;
  readonly params: string[];

  constructor(params: string[]) {
    super("Parametros não encontrados.");
    this.params = params;
  }
}
