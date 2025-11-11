"use server";

import { requireAuth } from "@/actions/auth-wrapper";
import { ArticleFeedReaderQuery, ArticleQuery } from "@/schemas/articles";
import * as ArticleService from "@/services/articles";
import { ArticleVisibility } from "@/types/article";
import { FeedStatus } from "@/types/feeds";

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
