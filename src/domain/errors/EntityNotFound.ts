export class EntityNotFound {
  static readonly type = "EntityNotFound";
  readonly message: string = "Entity not found";
  readonly type = EntityNotFound.type;

  constructor(readonly entity: string) {}
}
