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
import { PrismaPg } from "@prisma/adapter-pg";
import {
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from "kysely";
import kyselyExtension from "prisma-extension-kysely";
import { pagination } from "prisma-extension-pagination";
import { DB } from "../../generated/kysely/types";
import { PrismaClient } from "../../generated/prisma/client";

declare global {
  var _prisma: ExtendedPrismaClient;
}

type ExtendedPrismaClient = ReturnType<typeof initPrismaClient>;

const STATEMENT_TIMEOUT_MS = process.env.PG_STATEMENT_TIMEOUT_MS ?? "300000";
const IDLE_IN_TXN_TIMEOUT_MS = process.env.PG_IDLE_IN_TXN_TIMEOUT_MS ?? "60000";

function withConnectionTimeouts(url: string | undefined): string | undefined {
  if (!url) return url;

  const options = encodeURIComponent(
    `-c statement_timeout=${STATEMENT_TIMEOUT_MS} ` +
      `-c idle_in_transaction_session_timeout=${IDLE_IN_TXN_TIMEOUT_MS}`,
  );
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}options=${options}`;
}

function initPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: withConnectionTimeouts(process.env.POSTGRES_URL),
  });

  return new PrismaClient({
    adapter,
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
