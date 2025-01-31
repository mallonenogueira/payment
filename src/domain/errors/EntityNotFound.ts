export class EntityNotFound extends Error {
  entity: string;

  constructor(entity: string) {
    super("Entidade não encontrada:");
    this.entity = entity;
  }
}
