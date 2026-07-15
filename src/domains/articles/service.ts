import {
  buildArticleQueryStatement,
  buildOrderBy,
  buildWhere,
} from "@/domains/articles/query-converter";
import { ArticleQuery } from "@/domains/articles/schemas";
import { ArticleWithMetadata } from "@/domains/articles/types";
import { fetchLanguages } from "@/domains/languages/actions";
import { fetchLicenses } from "@/domains/licenses/actions";
import prisma from "@/lib/prisma";
import { IconSource } from "@/lib/prisma-client";
import { PageNumberPagination } from "prisma-extension-pagination/dist/types";

function mapSlugsToIds(
  slugs: string[] | undefined,
  records: { id: string; slug: string | null }[],
): string[] | undefined {
  if (!slugs?.length) return undefined;
  const bySlug = new Map(records.map((r) => [r.slug, r.id]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((id): id is string => Boolean(id));
}

export async function fetchArticles(query: ArticleQuery) {
  return prisma.article
    .paginate({
      include: {
        feed: {
          include: {
            license: true,
            language: true,
          },
        },
      },
      where: buildWhere(query),
      orderBy: {
        ...buildOrderBy(query),
      },
    })
    .withPages({
      page: query.page,
      limit: query.size,
      includePageCount: true,
    });
}

export const fetchArticlesByFeed = async (feedId: string) => {
  return prisma.article.findMany({
    where: {
      feedId,
    },
    orderBy: {
      date: {
        sort: "desc",
      },
    },
  });
};

export const fetchArticlesForFeedReader = async (
  query: ArticleQuery,
): Promise<[ArticleWithMetadata[], PageNumberPagination]> => {
  const [languages, licenses] = await Promise.all([
    query.languages?.length ? fetchLanguages() : Promise.resolve([]),
    query.licenses?.length ? fetchLicenses() : Promise.resolve([]),
  ]);

  const rawQuery = buildArticleQueryStatement(query, {
    languageIds: mapSlugsToIds(query.languages, languages),
    licenseIds: mapSlugsToIds(query.licenses, licenses),
  });
  const results = await rawQuery.execute();

  const mapped: ArticleWithMetadata[] = results.map((r) => {
    return {
      id: r.id,
      title: r.title,
      link: r.link,
      content: r.content,
      date: r.date,
      feed: {
        id: r.feedId,
        iconUrl: r.feedIconUrl,
        assetIconUrl: r.feedIconAssetUrl,
        iconSource: r.feedIconSource as IconSource,
        title: r.feedTitle,
        licenseText: r.licenseText,
        licenseUrl: r.licenseUrl,
        backgroundColor: r.feedBackgroundColor,
        textColor: r.feedTextColor,
        language: {
          id: r.languageId as string,
          name: r.languageName,
          slug: r.languageSlug,
          isRtl: r.languageIsRtl,
        },
        license: {
          id: r.licenseId as string,
          name: r.licenseName,
          slug: r.licenseSlug,
          backgroundColor: r.licenseBackgroundColor,
          textColor: r.licenseTextColor,
          symbols: r.licenseSymbols,
        },
      },
    };
  });

  const isFirstPage = query.page === 1;
  const isLastPage = results.length < query.size;
  const paginationMeta: PageNumberPagination = {
    isFirstPage,
    isLastPage,
    currentPage: query.page,
    nextPage: isLastPage ? null : query.page + 1,
    previousPage: isFirstPage ? null : query.page - 1,
  };
  return [mapped, paginationMeta];
};
