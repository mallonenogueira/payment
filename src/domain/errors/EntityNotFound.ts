export class EntityNotFound extends Error {
  static readonly type = 'EntityNotFound';
  readonly type = EntityNotFound.type;
  readonly entity: string;

  constructor(entity: string) {
    super("Entidade não encontrada:");
    this.entity = entity;
  }
}
