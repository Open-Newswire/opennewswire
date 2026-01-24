import prisma from "@/lib/prisma";
import { ArticleQuery } from "@/schemas/articles";
import { ArticleVisibility } from "@/types/article";
import { FeedStatus } from "@/types/feeds";
import { SortDirection } from "@/types/query";
import { sanitizeSearchString } from "@/utils/sanitize-search-string";
import { Prisma } from "@prisma/client";
import { sql } from "kysely";

export function buildOrderBy(query: ArticleQuery) {
  if (query.sortBy === "feed") {
    return {
      feed: {
        title: query.sortDirection,
      },
    };
  }

  return {
    [query.sortBy]: query.sortDirection,
  };
}

export function buildWhere(query: ArticleQuery) {
  let where: Prisma.ArticleWhereInput = {};

  if (query.search) {
    const sanitizedSearch = sanitizeSearchString(query.search);

    where.title = {
      search: sanitizedSearch + ":*",
    };

    where.content = {
      search: sanitizedSearch + ":*",
    };
  }

  if (query.feedStatus && query.feedStatus !== FeedStatus.all) {
    where.feed = {
      isActive: query.feedStatus === FeedStatus.active,
    };
  }

  if (query.visibility && query.visibility !== ArticleVisibility.all) {
    where.isHidden = query.visibility === ArticleVisibility.hidden;
  }

  if (query.license || query.language) {
    where.feed = {};

    if (query.license) {
      where.feed.licenseId = query.license;
    }

    if (query.language) {
      where.feed.languageId = query.language;
    }
  }

  return where;
}

const BASE_QUERY = prisma.$kysely
  .selectFrom("Article as a")
  .innerJoin("Feed as f", "f.id", "a.feedId")
  .innerJoin("License as li", "li.id", "f.licenseId")
  .innerJoin("Language as la", "la.id", "f.languageId")
  .select([
    "a.id as id",
    "a.title",
    "a.author",
    "a.content as content",
    "a.date",
    "a.link",
    "a.feedId as feedId",
    "f.title as feedTitle",
    "f.backgroundColor as feedBackgroundColor",
    "f.textColor as feedTextColor",
    "f.iconUrl as feedIconUrl",
    "f.iconAssetUrl as feedIconAssetUrl",
    "f.iconSource as feedIconSource",
    "f.licenseText as licenseText",
    "f.licenseUrl as licenseUrl",
    "f.licenseId as licenseId",
    "li.slug as licenseSlug",
    "li.backgroundColor as licenseBackgroundColor",
    "li.textColor as licenseTextColor",
    "li.name as licenseName",
    "li.symbols as licenseSymbols",
    "f.languageId as languageId",
    "la.slug as languageSlug",
    "la.name as languageName",
    "la.isRtl as languageIsRtl",
  ])
  .where(sql`a.date`, "<=", sql`NOW()`);

export function buildArticleQueryStatement(query: ArticleQuery) {
  let baseQuery = BASE_QUERY;

  // Where
  if (query.licenses) {
    baseQuery = baseQuery.where("li.slug", "in", query.licenses);
  }

  if (query.languages) {
    baseQuery = baseQuery.where("la.slug", "in", query.languages);
  }

  if (query.feedStatus && query.feedStatus !== FeedStatus.all) {
    baseQuery = baseQuery.where(
      "f.isActive",
      "=",
      query.feedStatus === FeedStatus.active,
    );
  }

  if (query.visibility && query.visibility !== ArticleVisibility.all) {
    baseQuery = baseQuery.where(
      "a.isHidden",
      "=",
      query.visibility === ArticleVisibility.hidden,
    );
  }

  if (query.search) {
    const searchString = sanitizeSearchString(query.search);
    baseQuery = baseQuery.where((eb) =>
      eb(sql`"a"."tsEn"`, "@@", to_tsquery(searchString)),
    );
  }

  // Ordering
  let orderField;

  switch (query.sortBy) {
    case "feed":
      orderField = "f.title";
      break;
    case "date":
      orderField = "a.date";
      break;
    case "title":
      orderField = "a.title";
      break;
    default:
      orderField = "";
  }

  baseQuery = baseQuery.orderBy(
    orderField as any,
    query.sortDirection === SortDirection.Asc ? "asc" : "desc",
  );

  // Pagination
  baseQuery = baseQuery.limit(query.size).offset((query.page - 1) * query.size);

  return baseQuery;
}

function to_tsquery(searchString: string) {
  return sql`to_tsquery(${sql.lit("english")}, ${sql.lit(searchString)})`;
}
