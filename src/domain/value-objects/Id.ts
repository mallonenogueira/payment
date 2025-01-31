import crypto from "node:crypto";

export class Id {
  public static createString() {
    return crypto.randomUUID();
  }
}