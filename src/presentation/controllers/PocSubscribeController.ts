import { env } from "@/infra/configuration/env";
import { HttpServer } from "../../infra/http/HttpServer";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { randomUUID } from "node:crypto";

// https://api.mercadopago.com/v1/payment_methods
// https://api.mercadopago.com/v1/payments/search
// https://api.mercadopago.com/v1/payments/{id}

export class SubscribeController {
  constructor(server: HttpServer) {
    server.post("/subscribe", this.create.bind(this));
    server.get("/subscribe", this.find.bind(this));
    server.get("/payments", this.payments.bind(this));
  }

  async payments() {
    const client = new MercadoPagoConfig({
      accessToken: env.mercadoPagoAccessToen,
    });

    return new Payment(client).search({

    });
  }

  
  async find() {
    const client = new MercadoPagoConfig({
      accessToken: env.mercadoPagoAccessToen,
    });

    const preference = new Preference(client);

    const preferences = preference.search({
      
    });

    return preferences;

    // new Payment(client).search({

    // });
  }


  async create() {
    const client = new MercadoPagoConfig({
      accessToken: env.mercadoPagoAccessToen,
    });

    const preference = new Preference(client);

    const preferenceResponse = await preference.create({
      body: {
        auto_return: "all",
        back_urls: {
          success: "https://desenv.mallone.dev",
          failure: "https://desenv.mallone.dev",
          pending: "https://desenv.mallone.dev",
        },
        items: [
          {
            // Sugestões de categorias - https://api.mercadopago.com/item_categories
            category_id: "virtual_goods",
            id: randomUUID(),
            title: "Assinatura mensal",
            quantity: 1,
            unit_price: 200,
            currency_id: 'BRL'
          },
        ],

        // Nada obrigatório
        payer: {
          date_created: 'string',
          name: "string",
          // Nome do comprador.
          surname: "string",
          // Apelido do comprador.
          email: "string",
          // Endereço de e-mail do comprador.
          phone: {
            // Telefone do comprador.
            area_code: "",
            number: "",
          },
          identification: {
            type: "string",
            number: "string",
          },
          address: {
            // Endereço do comprador.
            zip_code: "string",
            // Código postal.
            street_name: "string",
            // Nome da rua.
            street_number: "number",
            // Número.
          },
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          default_payment_method_id: '',
          // máximo parcelas
          installments: 1,
          default_installments: 1,
        }
      },
    });

    console.log(preferenceResponse);

    return preferenceResponse;
  }
}
