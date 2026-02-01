import { FeedQuery } from "@/domains/feeds/schemas";
import { Prisma } from "@prisma/client";

export function buildOrderBy(query: FeedQuery) {
  if (["license", "language"].includes(query.sortBy)) {
    return {
      [query.sortBy]: {
        id: query.sortDirection,
      },
    };
  }

  return {
    [query.sortBy]: query.sortDirection,
  };
}

export function buildWhere(query: FeedQuery) {
  let where: Prisma.FeedWhereInput = {};

  if (query.search) {
    where["OR"] = [
      {
        title: {
          mode: "insensitive",
          contains: query.search,
        },
      },
      {
        url: {
          mode: "insensitive",
          contains: query.search,
        },
      },
    ];
  }

  if (query.language && query.language !== "all") {
    where.languageId = query.language;
  }

  if (query.license && query.license !== "all") {
    where.licenseId = query.license;
  }

  if (query.status && query.status !== "all") {
    where.isActive = query.status === "active";
  }

  return Object.keys(where).length > 0 ? where : undefined;
}
