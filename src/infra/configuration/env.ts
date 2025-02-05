export const env = {
  port: Number(process.env.PORT ?? 3000),
  resendToken: process.env.RESEND_TOKEN ?? "",
  hashSalt: process.env.HASH_SALT,
  jwtSecret: process.env.JWT_SECRET ?? 'develop',
  mercadoPagoAccessToen: process.env.MERCADOPAGO_ACCESS_TOKEN ?? "",
};
