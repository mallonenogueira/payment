import { PrismaClient } from "@prisma/client";
import { parseArgs } from "node:util";

const prisma = new PrismaClient();

async function main() {
  const {
    values: { environment },
  } = parseArgs({
    options: {
      environment: { type: "string" },
    },
  });

  console.log(`Rodando seed de: ${environment ?? "default"}`);

  switch (environment) {
    case "development":
      await developmentSeed();
      break;
    default:
      break;
  }
}

async function developmentSeed() {
  await prisma.product.create({
    data: {
      active: true,
      description: "Adicionado com seed produto de teste",
      title: "Produto de renovação mensal",
      type: "MONTH",
      installments: 1,
      price: 20,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
