import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // the main entry for your schema
  schema: "prisma/schema.prisma",
  // where migrations should be generated
  // what script to run for "prisma db seed"
  migrations: {
    path: "prisma/migrations",
    seed: 'ts-node --compiler-options {"module":"CommonJS"} seed.ts',
  },
  datasource: {
    url: process.env.POSTGRES_URL,
  },
});
