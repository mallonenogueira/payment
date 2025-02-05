export class EntityMissingParams {
  static readonly type = "EntityMissingParams";
  readonly type = EntityMissingParams.type;
  readonly message: string = "Parametros não encontrados.";

  constructor(readonly params: string[]) {}
}
