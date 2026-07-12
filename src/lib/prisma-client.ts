/**
 * Shared Prisma model types, enums, and the `Prisma` type namespace.
 *
 * Prisma 7's `prisma-client` generator emits the client to a custom output path
 * (see `prisma/schema.prisma`) instead of populating the `@prisma/client`
 * package. Import model types and enums from here rather than from
 * `@prisma/client`.
 *
 * This re-exports the generator's browser-safe entry point, so it is safe to
 * import from both server code and client components (`"use client"`) — it pulls
 * in no Node.js runtime. The `PrismaClient` class itself is not exported here;
 * the configured database client is the singleton in `@/lib/prisma`.
 */
export * from "../../generated/prisma/browser";
