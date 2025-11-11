/**
 * Configures the Prisma ORM for database access.
 *
 * Prisma is used for most data access across the codebase. Prefer using the fluent
 * query interface and types generated from the Prisma schema where possible.
 *
 * Kysely is also configured for flexible query building using prisma-extension-kysely. use prisma.$kysely
 * to build raw queries instead of prisma.$queryRaw.
 */
import { getCountryName } from "@/utils/get-country-name";
import { PrismaClient } from "@prisma/client";
import {
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from "kysely";
import kyselyExtension from "prisma-extension-kysely";
import { pagination } from "prisma-extension-pagination";
import { DB } from "../../prisma/generated/types";

declare global {
  var _prisma: ExtendedPrismaClient;
}

type ExtendedPrismaClient = ReturnType<typeof initPrismaClient>;

function initPrismaClient() {
  return new PrismaClient({
    omit: {
      user: {
        password_hash: true,
      },
    },
  })
    .$extends(pagination())
    .$extends(
      kyselyExtension({
        kysely: (driver) =>
          new Kysely<DB>({
            dialect: {
              createDriver: () => driver,
              createAdapter: () => new PostgresAdapter(),
              createIntrospector: (db) => new PostgresIntrospector(db),
              createQueryCompiler: () => new PostgresQueryCompiler(),
            },
          }),
      }),
    )
    .$extends({
      result: {
        analyticsEvent: {
          countryName: {
            needs: { countryCode: true },
            compute(event) {
              return event.countryCode
                ? getCountryName(event.countryCode)
                : undefined;
            },
          },
        },
      },
    });
}

let prisma: ExtendedPrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = initPrismaClient();
} else {
  if (!global._prisma) {
    global._prisma = initPrismaClient();
  }

  prisma = global._prisma;
}

export default prisma;
