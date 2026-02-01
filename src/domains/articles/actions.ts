"use server";

import { requireAuth } from "@/domains/auth/wrapper";
import { ArticleFeedReaderQuery, ArticleQuery } from "@/domains/articles/schemas";
import * as ArticleService from "@/domains/articles/service";
import { ArticleVisibility } from "@/domains/articles/types";
import { FeedStatus } from "@/domains/feeds/types";

export const fetchArticles = requireAuth(async function fetchArticles(
  query: ArticleQuery,
) {
  return ArticleService.fetchArticles(query);
});

export async function fetchArticlesForFeedReader(
  query: ArticleFeedReaderQuery,
) {
  return ArticleService.fetchArticlesForFeedReader({
    visibility: ArticleVisibility.visible,
    feedStatus: FeedStatus.active,
    licenses: query.licenses,
    languages: query.languages,
    page: query.page ?? 1,
    size: query.size ?? 15,
    search: query.search,
    sortBy: "date",
    sortDirection: "desc",
  });
}
