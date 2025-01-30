export const env = {
  port: Number(process.env.PORT ?? 3000),
  mercadoPagoAccessToen: process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''
};
