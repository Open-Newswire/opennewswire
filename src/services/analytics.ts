import prisma from "@/lib/prisma";
import { AnalyticsQuery, PaginatedAnalyticsQuery } from "@/schemas/analytics";
import {
  averageSessionDuration,
  buildEventsOrderBy,
  buildEventsWhere,
  countDistinctCountries,
  countDistinctCountriesForReport,
  distinctBrowserLanguages,
  distinctCountryCodes,
  eventsForReport,
  topArticlesForReport,
  topSearches,
  topSearchesCount,
  topSearchesForReport,
  topViewedArticles,
  topViewedArticlesCount,
  totalEvents,
  uniqueSessions,
  uniqueSessionsByDay,
} from "@/services/queries/analytics";
import {
  AnalyticsEventDetails,
  TopArticleCount,
  TopSearchesCount,
} from "@/types/analytics";
import { PaginatedData } from "@/types/shared";
import { getCountryName } from "@/utils/get-country-name";
import { AnalyticsEventType } from "@prisma/client";
import { parse as parseLanguageCode } from "accept-language-parser";
import { format } from "date-fns";
import { NextRequest } from "next/server";

async function enrichSearchParams(params: URLSearchParams) {
  const selectedLanguages = params.get("languages");
  const selectedLicenses = params.get("licenses");

  const languages = selectedLanguages
    ? (
        await prisma.language.findMany({
          where: {
            slug: {
              in: selectedLanguages?.split(","),
            },
          },
          select: {
            id: true,
          },
        })
      ).map((language) => language.id)
    : [];

  const licences = selectedLicenses
    ? (
        await prisma.license.findMany({
          where: {
            slug: {
              in: selectedLicenses?.split(","),
            },
          },
          select: {
            id: true,
          },
        })
      ).map((licence) => licence.id)
    : [];

  return {
    languages,
    licences,
  };
}

function parseBrowserLanguage(acceptLanguage: string | null) {
  if (!acceptLanguage) {
    return null;
  }
  const parsedLanguages = parseLanguageCode(acceptLanguage);
  const languages = parsedLanguages.map((lang) => lang.code);
  const primaryLanguage = languages[0];
  return primaryLanguage;
}

export async function recordQuery(sessionId: string, request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for");
  const browserLanguage = parseBrowserLanguage(
    request.headers.get("accept-language"),
  );
  const searchParams = request.nextUrl.searchParams;
  const searchQuery = searchParams.get("search");
  const enrichedSearchParams = await enrichSearchParams(searchParams);

  await prisma.analyticsEvent.create({
    data: {
      eventType: AnalyticsEventType.QUERY,
      sessionId: sessionId,
      ipAddress: ip,
      browserLanguage: browserLanguage,
      searchQuery: searchQuery,
      selectedLanguages: enrichedSearchParams.languages,
      selectedLicenses: enrichedSearchParams.licences,
    },
  });
}

export async function recordArticleInteraction(
  articleId: string,
  sessionId: string,
  request: NextRequest,
  searchParams: URLSearchParams,
) {
  const ip = request.headers.get("x-forwarded-for");
  const browserLanguage = parseBrowserLanguage(
    request.headers.get("accept-language"),
  );
  const enrichedSearchParams = await enrichSearchParams(searchParams);

  await prisma.analyticsEvent.create({
    data: {
      eventType: AnalyticsEventType.INTERACTION,
      sessionId: sessionId,
      ipAddress: ip,
      browserLanguage: browserLanguage,
      articleId: articleId,
      selectedLanguages: enrichedSearchParams.languages,
      selectedLicenses: enrichedSearchParams.licences,
    },
  });
}

export async function getTopArticlesForReport(query: AnalyticsQuery) {
  return topArticlesForReport(query).execute();
}

export async function getTopSearchesForReport(query: AnalyticsQuery) {
  return topSearchesForReport(query).execute();
}

export async function getCountDistinctCountriesForReport(
  query: AnalyticsQuery,
) {
  const result = await countDistinctCountriesForReport(query).execute();

  return result.map((r) => ({
    Country: getCountryName(r.countryCode || ""),
    Count: r.count,
  }));
}

export async function getTopArticles(
  query: PaginatedAnalyticsQuery,
): Promise<TopArticleCount[]> {
  const topArticles = await topViewedArticles(query, 0, 10).execute();
  const feeds = await prisma.feed.findMany({
    where: {
      id: {
        in: topArticles.map((article) => article.feedId),
      },
    },
  });

  const metdataById = new Map(feeds.map((feed) => [feed.id, feed]));

  return topArticles.map((article) => {
    const feed = metdataById.get(article.feedId);
    return {
      articleId: article.id,
      count: article.viewCount,
      title: article.title,
      link: article.link,
      feed,
    };
  });
}

export async function getTopArticlesPaginated(
  query: PaginatedAnalyticsQuery,
): Promise<PaginatedData<TopArticleCount>> {
  const topArticles = await topViewedArticles(query, query.page - 1).execute();
  const totalCountWrapper =
    await topViewedArticlesCount(query).executeTakeFirst();
  const totalCount = Number(totalCountWrapper?.count) ?? 0;
  const pageCount = Math.ceil(totalCount / query.size);

  const feeds = await prisma.feed.findMany({
    where: {
      id: {
        in: topArticles.map((article) => article.feedId),
      },
    },
  });

  const metdataById = new Map(feeds.map((feed) => [feed.id, feed]));

  const results = topArticles.map((article) => {
    const feed = metdataById.get(article.feedId);
    return {
      articleId: article.id,
      count: article.viewCount,
      title: article.title,
      link: article.link,
      feed,
    };
  });

  return {
    results,
    pagination: {
      totalCount,
      pageCount,
    },
  };
}

export async function getTotalEvents(query: PaginatedAnalyticsQuery) {
  const result = await totalEvents(query).executeTakeFirst();

  return result?.count ?? 0;
}

export async function getTopSearches(
  query: PaginatedAnalyticsQuery,
): Promise<TopSearchesCount[]> {
  const result = await topSearches(query, 0, 10).execute();

  return result;
}

export async function getTopSearchesPaginated(
  query: PaginatedAnalyticsQuery,
): Promise<PaginatedData<TopSearchesCount>> {
  const results = await topSearches(query, query.page - 1).execute();
  const totalCountWrapper = await topSearchesCount(query).executeTakeFirst();
  const totalCount = Number(totalCountWrapper?.count) ?? 0;
  const pageCount = Math.ceil(totalCount / query.size);

  return {
    results,
    pagination: {
      pageCount,
      totalCount,
    },
  };
}

export async function getAverageSessionDuration(
  query: PaginatedAnalyticsQuery,
) {
  const result = await averageSessionDuration(query).executeTakeFirst();

  return (result?.avgSessionDuration ?? 0) as number;
}

export async function getUniqueSessions(query: PaginatedAnalyticsQuery) {
  const result = await uniqueSessions(query).executeTakeFirst();

  return result?.count ?? 0;
}

export async function getDistinctCountryCodes() {
  return await distinctCountryCodes().execute();
}

export async function getDistinctBrowserLanguages() {
  return await distinctBrowserLanguages().execute();
}

export async function getCountDistinctCountries(
  query: PaginatedAnalyticsQuery,
) {
  return await countDistinctCountries(query).execute();
}

export async function getEvents(query: PaginatedAnalyticsQuery) {
  const results = await prisma.analyticsEvent
    .paginate({
      where: buildEventsWhere(query),
      orderBy: {
        ...buildEventsOrderBy(query),
      },
    })
    .withPages({
      page: query.page,
      limit: query.size,
      includePageCount: true,
    });

  return results;
}

export async function getEventDetailsById(
  id: string,
): Promise<AnalyticsEventDetails | undefined> {
  const result = await prisma.analyticsEvent.findFirst({
    where: {
      id,
    },
  });

  if (!result) {
    return;
  }

  const selectedLanguages = await prisma.language.findMany({
    where: {
      id: {
        in: result.selectedLanguages,
      },
    },
  });

  const selectedLicenses = await prisma.license.findMany({
    where: {
      id: {
        in: result.selectedLicenses,
      },
    },
  });

  return {
    selectedLanguages,
    selectedLicenses,
  };
}

export async function getUniqueSessionsByDay(query: PaginatedAnalyticsQuery) {
  const result = await uniqueSessionsByDay(query).execute();

  return result.map((r) => ({
    count: Number(r.count),
    day: r.day,
  }));
}

export async function getEventsForReport(query: AnalyticsQuery) {
  const result = await eventsForReport(query).execute();

  return result.map((r) => ({
    "Occurred At": format(r.occuredAt, "PP pp"),
    "Session ID": r.sessionId,
    "Event Type": r.eventType === "INTERACTION" ? "Interaction" : "Query",
    "Browser Language": r.browserLanguage,
    ipAddress: r.ipAddress,
    "Country Code": r.countryCode,
    "Country Name": getCountryName(r.countryCode),
    "Region Code": r.regionCode,
    City: r.city,
    "Article ID": r.articleId,
    "Search Query": r.searchQuery,
  }));
}
