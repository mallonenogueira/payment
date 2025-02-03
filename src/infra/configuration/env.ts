export const env = {
  port: Number(process.env.PORT ?? 3000),
  resendToken: process.env.RESEND_TOKEN ?? "",
  mercadoPagoAccessToen: process.env.MERCADOPAGO_ACCESS_TOKEN ?? "",
};
