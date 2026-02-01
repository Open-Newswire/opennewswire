import { LanguageQuery } from "@/domains/languages/schemas";
import { Prisma } from "@prisma/client";

export function buildOrderBy(query: LanguageQuery) {
  return {
    [query.sortBy]: query.sortDirection,
  };
}

export function buildWhere(query: LanguageQuery) {
  let where: Prisma.LanguageWhereInput = {};

  if (query.direction) {
    where.isRtl = query.direction === "rtl";
  }

  if (query.search) {
    where.name = {
      mode: "insensitive",
      contains: query.search,
    };
  }

  return Object.keys(where).length > 0 ? where : undefined;
}
