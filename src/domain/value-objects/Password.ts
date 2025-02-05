import { env } from "@/infra/configuration/env";
import bcrypt from "bcrypt";

export class Password {
  static salt = env.hashSalt ?? bcrypt.genSaltSync(10);

  static hash(password: string) {
    return bcrypt.hashSync(password, Password.salt);
  }

  static compare(password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword);
  }
}
