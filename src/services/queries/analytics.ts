import prisma from "@/lib/prisma";
import { AnalyticsQuery, PaginatedAnalyticsQuery } from "@/schemas/analytics";
import { AnalyticsEventType, Prisma } from "@prisma/client";
import { addDays } from "date-fns";
import { sql } from "kysely";

export function topViewedArticles(
  query: PaginatedAnalyticsQuery,
  overridePage?: number,
  overrideSize?: number,
) {
  return prisma.$kysely
    .selectFrom("Article as a")
    .innerJoin("AnalyticsEvent as e", "e.articleId", "a.id")
    .groupBy(["a.id", "a.title"])
    .select([
      "a.id",
      "a.title",
      "a.feedId",
      "a.link",
      (eb) => eb.fn.count<number>("e.id").as("viewCount"),
    ])
    .orderBy("viewCount", "desc")
    .offset((overridePage ?? query.page) * (overrideSize || query.size))
    .limit(overrideSize ?? query.size)
    .$if(!!query.sd, (qb) => qb.where("e.occuredAt", ">=", query.sd!))
    .$if(!!query.ed, (qb) => qb.where("e.occuredAt", "<", query.ed!))
    .$if(!!query.language, (qb) =>
      qb.where(({ eb, fn }) =>
        eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
      ),
    )
    .$if(!!query.license, (qb) =>
      qb.where(({ eb, fn }) =>
        eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
      ),
    )
    .$if(!!query.countryCode, (qb) =>
      qb.where("e.countryCode", "=", query.countryCode!),
    )
    .$if(!!query.browserLanguage, (qb) =>
      qb.where("e.browserLanguage", "=", query.browserLanguage!),
    )
    .$if(!!query.eventType, (qb) =>
      qb.where(
        "e.eventType",
        "=",
        sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
      ),
    );

  // if (query.sd) {
  //   queryBuilder = queryBuilder.where("e.occuredAt", ">=", query.sd);
  // }

  // if (query.ed) {
  //   queryBuilder = queryBuilder.where("e.occuredAt", "<", addDays(query.ed, 1));
  // }

  // if (query.language) {
  //   queryBuilder = queryBuilder.where(({ eb, fn }) =>
  //     eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
  //   );
  // }

  // if (query.license) {
  //   queryBuilder = queryBuilder.where(({ eb, fn }) =>
  //     eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
  //   );
  // }

  // if (query.countryCode) {
  //   queryBuilder = queryBuilder.where("e.countryCode", "=", query.countryCode);
  // }

  // if (query.browserLanguage) {
  //   queryBuilder = queryBuilder.where(
  //     "e.browserLanguage",
  //     "=",
  //     query.browserLanguage,
  //   );
  // }

  // if (query.eventType) {
  //   queryBuilder = queryBuilder.where(
  //     "e.eventType",
  //     "=",
  //     sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
  //   );
  // }

  // return queryBuilder;
}

export function topViewedArticlesCount(query: PaginatedAnalyticsQuery) {
  let queryBuilder = prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .select([
      (eb) =>
        eb.fn.count<number>(sql<string>`distinct e."articleId"`).as("count"),
    ]);

  if (query.sd) {
    queryBuilder = queryBuilder.where("e.occuredAt", ">=", query.sd);
  }

  if (query.ed) {
    queryBuilder = queryBuilder.where("e.occuredAt", "<", addDays(query.ed, 1));
  }

  if (query.language) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
    );
  }

  if (query.license) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
    );
  }

  if (query.countryCode) {
    queryBuilder = queryBuilder.where("e.countryCode", "=", query.countryCode);
  }

  if (query.browserLanguage) {
    queryBuilder = queryBuilder.where(
      "e.browserLanguage",
      "=",
      query.browserLanguage,
    );
  }

  if (query.eventType) {
    queryBuilder = queryBuilder.where(
      "e.eventType",
      "=",
      sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
    );
  }

  return queryBuilder;
}

export function totalEvents(query: PaginatedAnalyticsQuery) {
  let queryBuilder = prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .select((eb) => eb.fn.count<number>("e.id").as("count"));

  if (query.sd) {
    queryBuilder = queryBuilder.where("e.occuredAt", ">=", query.sd);
  }

  if (query.ed) {
    queryBuilder = queryBuilder.where("e.occuredAt", "<", addDays(query.ed, 1));
  }

  if (query.language) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
    );
  }

  if (query.license) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
    );
  }

  if (query.countryCode) {
    queryBuilder = queryBuilder.where("e.countryCode", "=", query.countryCode);
  }

  if (query.browserLanguage) {
    queryBuilder = queryBuilder.where(
      "e.browserLanguage",
      "=",
      query.browserLanguage,
    );
  }

  if (query.eventType) {
    queryBuilder = queryBuilder.where(
      "e.eventType",
      "=",
      sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
    );
  }

  return queryBuilder;
}

export function topSearches(
  query: PaginatedAnalyticsQuery,
  overridePage?: number,
  overrideSize?: number,
) {
  let queryBuilder = prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .where("e.searchQuery", "is not", null)
    .select([
      sql<string>`lower(e."searchQuery")`.as("normalizedQuery"),
      (eb) =>
        eb.fn.count<number>(sql<string>`lower(e."searchQuery")`).as("count"),
    ])
    .groupBy(["normalizedQuery"])
    .orderBy("count", "desc")
    .offset((overridePage ?? query.page) * (overrideSize || query.size))
    .limit(overrideSize ?? query.size);

  if (query.sd) {
    queryBuilder = queryBuilder.where("e.occuredAt", ">=", query.sd);
  }

  if (query.ed) {
    queryBuilder = queryBuilder.where("e.occuredAt", "<", addDays(query.ed, 1));
  }

  if (query.language) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
    );
  }

  if (query.license) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
    );
  }

  if (query.countryCode) {
    queryBuilder = queryBuilder.where("e.countryCode", "=", query.countryCode);
  }

  if (query.browserLanguage) {
    queryBuilder = queryBuilder.where(
      "e.browserLanguage",
      "=",
      query.browserLanguage,
    );
  }

  if (query.eventType) {
    queryBuilder = queryBuilder.where(
      "e.eventType",
      "=",
      sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
    );
  }

  return queryBuilder;
}

export function topSearchesCount(query: PaginatedAnalyticsQuery) {
  let queryBuilder = prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .where("e.searchQuery", "is not", null)
    .select([
      (eb) =>
        eb.fn
          .count<number>(sql<string>`distinct lower(e."searchQuery")`)
          .as("count"),
    ])
    .orderBy("count", "desc");

  if (query.sd) {
    queryBuilder = queryBuilder.where("e.occuredAt", ">=", query.sd);
  }

  if (query.ed) {
    queryBuilder = queryBuilder.where("e.occuredAt", "<", addDays(query.ed, 1));
  }

  if (query.language) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
    );
  }

  if (query.license) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
    );
  }

  if (query.countryCode) {
    queryBuilder = queryBuilder.where("e.countryCode", "=", query.countryCode);
  }

  if (query.browserLanguage) {
    queryBuilder = queryBuilder.where(
      "e.browserLanguage",
      "=",
      query.browserLanguage,
    );
  }

  if (query.eventType) {
    queryBuilder = queryBuilder.where(
      "e.eventType",
      "=",
      sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
    );
  }

  return queryBuilder;
}

export function averageSessionDuration(query: PaginatedAnalyticsQuery) {
  let baseSubQuery = prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .select([
      "sessionId",
      sql`MAX("occuredAt") - MIN("occuredAt")`.as("session_duration"),
    ]);

  if (query.sd) {
    baseSubQuery = baseSubQuery.where("e.occuredAt", ">=", query.sd);
  }

  if (query.ed) {
    baseSubQuery = baseSubQuery.where("e.occuredAt", "<", addDays(query.ed, 1));
  }

  if (query.language) {
    baseSubQuery = baseSubQuery.where(({ eb, fn }) =>
      eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
    );
  }

  if (query.license) {
    baseSubQuery = baseSubQuery.where(({ eb, fn }) =>
      eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
    );
  }

  if (query.countryCode) {
    baseSubQuery = baseSubQuery.where("e.countryCode", "=", query.countryCode);
  }

  if (query.browserLanguage) {
    baseSubQuery = baseSubQuery.where(
      "e.browserLanguage",
      "=",
      query.browserLanguage,
    );
  }

  if (query.eventType) {
    baseSubQuery = baseSubQuery.where(
      "e.eventType",
      "=",
      sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
    );
  }

  let subquery = baseSubQuery.groupBy("sessionId").as("session_durations");

  return prisma.$kysely
    .selectFrom(subquery)
    .select(
      sql`AVG(EXTRACT(EPOCH FROM session_duration))`.as("avgSessionDuration"),
    );
}

export function uniqueSessions(query: PaginatedAnalyticsQuery) {
  let baseSubQuery = prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .select("e.sessionId");

  if (query.sd) {
    baseSubQuery = baseSubQuery.where("e.occuredAt", ">=", query.sd);
  }

  if (query.ed) {
    baseSubQuery = baseSubQuery.where("e.occuredAt", "<", addDays(query.ed, 1));
  }

  if (query.language) {
    baseSubQuery = baseSubQuery.where(({ eb, fn }) =>
      eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
    );
  }

  if (query.license) {
    baseSubQuery = baseSubQuery.where(({ eb, fn }) =>
      eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
    );
  }

  if (query.countryCode) {
    baseSubQuery = baseSubQuery.where("e.countryCode", "=", query.countryCode);
  }

  if (query.browserLanguage) {
    baseSubQuery = baseSubQuery.where(
      "e.browserLanguage",
      "=",
      query.browserLanguage,
    );
  }

  if (query.eventType) {
    baseSubQuery = baseSubQuery.where(
      "e.eventType",
      "=",
      sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
    );
  }

  let subQuery = baseSubQuery.distinct().as("temp");

  return prisma.$kysely
    .selectFrom(subQuery)
    .select((eb) => eb.fn.count<number>("temp.sessionId").as("count"));
}

export function distinctCountryCodes() {
  return prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .where("e.countryCode", "is not", null)
    .select("e.countryCode")
    .distinct()
    .orderBy("e.countryCode asc")
    .$narrowType<{ countryCode: string }>();
}

export function distinctBrowserLanguages() {
  return prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .where("e.browserLanguage", "is not", null)
    .select("e.browserLanguage")
    .distinct()
    .orderBy("e.browserLanguage asc");
}

export function countDistinctCountries(query: PaginatedAnalyticsQuery) {
  let queryBuilder = prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .select(["countryCode", sql<number>`COUNT(*)`.as("eventCount")]);

  if (query.sd) {
    queryBuilder = queryBuilder.where("occuredAt", ">=", query.sd);
  }

  if (query.ed) {
    queryBuilder = queryBuilder.where("e.occuredAt", "<", addDays(query.ed, 1));
  }

  if (query.language) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
    );
  }

  if (query.license) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
    );
  }

  if (query.countryCode) {
    queryBuilder = queryBuilder.where("e.countryCode", "=", query.countryCode);
  } else {
    queryBuilder = queryBuilder.where("e.countryCode", "is not", null);
  }

  if (query.browserLanguage) {
    queryBuilder = queryBuilder.where(
      "e.browserLanguage",
      "=",
      query.browserLanguage,
    );
  }

  if (query.eventType) {
    queryBuilder = queryBuilder.where(
      "e.eventType",
      "=",
      sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
    );
  }

  return queryBuilder.groupBy("countryCode").orderBy("eventCount", "desc");
}

export function buildEventsWhere(query: PaginatedAnalyticsQuery) {
  let where: Prisma.AnalyticsEventWhereInput = {};

  // Ignore start and end dates if sessionId is provided
  if ((query.sd || query.ed) && !query.sessionId) {
    where.occuredAt = {};

    if (query.sd) {
      where.occuredAt.gte = query.sd;
    }

    if (query.ed) {
      where.occuredAt.lt = addDays(query.ed, 1);
    }
  }

  if (query.countryCode) {
    where.countryCode = query.countryCode;
  }

  if (query.language && query.language !== "all") {
    where.selectedLanguages = {
      hasEvery: [query.language],
    };
  }

  if (query.license && query.license !== "all") {
    where.selectedLicenses = {
      hasEvery: [query.license],
    };
  }

  if (query.browserLanguage && query.browserLanguage !== "all") {
    where.browserLanguage = query.browserLanguage;
  }

  if (query.sessionId) {
    where.sessionId = query.sessionId;
  }

  if (query.eventType) {
    where.eventType = query.eventType;
  }

  return Object.keys(where).length > 0 ? where : undefined;
}

export function buildEventsOrderBy(query: PaginatedAnalyticsQuery) {
  return {
    [query.sortBy]: query.sortDirection,
  };
}

export function uniqueSessionsByDay(query: PaginatedAnalyticsQuery) {
  let queryBuilder = prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .select([
      (eb) =>
        eb
          .fn<Date>("date_trunc", [sql.lit("DAY"), eb.ref("e.occuredAt")])
          .as("day"),
      (eb) =>
        eb.fn.count<number>(sql<string>`distinct e."sessionId"`).as("count"),
    ]);

  if (query.sd) {
    queryBuilder = queryBuilder.where("e.occuredAt", ">=", query.sd);
  }

  if (query.ed) {
    queryBuilder = queryBuilder.where("e.occuredAt", "<", addDays(query.ed, 1));
  }

  if (query.language) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
    );
  }

  if (query.license) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
    );
  }

  if (query.countryCode) {
    queryBuilder = queryBuilder.where("e.countryCode", "=", query.countryCode);
  }

  if (query.browserLanguage) {
    queryBuilder = queryBuilder.where(
      "e.browserLanguage",
      "=",
      query.browserLanguage,
    );
  }

  if (query.eventType) {
    queryBuilder = queryBuilder.where(
      "e.eventType",
      "=",
      sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
    );
  }

  queryBuilder = queryBuilder.groupBy("day").orderBy("day");

  return queryBuilder;
}

export function topArticlesForReport(query: AnalyticsQuery) {
  let queryBuilder = prisma.$kysely
    .selectFrom("Article as a")
    .innerJoin("AnalyticsEvent as e", "e.articleId", "a.id")
    .leftJoin("Feed as f", "a.feedId", "f.id")
    .groupBy(["a.id", "a.title", "f.title"])
    .select([
      "a.title as Title",
      "a.link as URL",
      "f.title as Feed",
      (eb) => eb.fn.count<number>("e.id").as("Count"),
    ])
    .orderBy("Count", "desc");

  if (query.sd) {
    queryBuilder = queryBuilder.where("e.occuredAt", ">=", query.sd);
  }

  if (query.ed) {
    queryBuilder = queryBuilder.where("e.occuredAt", "<", addDays(query.ed, 1));
  }

  if (query.language) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
    );
  }

  if (query.license) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
    );
  }

  if (query.countryCode) {
    queryBuilder = queryBuilder.where("e.countryCode", "=", query.countryCode);
  }

  if (query.browserLanguage) {
    queryBuilder = queryBuilder.where(
      "e.browserLanguage",
      "=",
      query.browserLanguage,
    );
  }

  if (query.eventType) {
    queryBuilder = queryBuilder.where(
      "e.eventType",
      "=",
      sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
    );
  }

  return queryBuilder;
}

export function topSearchesForReport(query: AnalyticsQuery) {
  let queryBuilder = prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .where("e.searchQuery", "is not", null)
    .select([
      sql<string>`lower(e."searchQuery")`.as("Query"),
      (eb) =>
        eb.fn.count<number>(sql<string>`lower(e."searchQuery")`).as("Count"),
    ])
    .groupBy(["Query"])
    .orderBy("Count", "desc");

  if (query.sd) {
    queryBuilder = queryBuilder.where("e.occuredAt", ">=", query.sd);
  }

  if (query.ed) {
    queryBuilder = queryBuilder.where("e.occuredAt", "<", addDays(query.ed, 1));
  }

  if (query.language) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
    );
  }

  if (query.license) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
    );
  }

  if (query.countryCode) {
    queryBuilder = queryBuilder.where("e.countryCode", "=", query.countryCode);
  }

  if (query.browserLanguage) {
    queryBuilder = queryBuilder.where(
      "e.browserLanguage",
      "=",
      query.browserLanguage,
    );
  }

  if (query.eventType) {
    queryBuilder = queryBuilder.where(
      "e.eventType",
      "=",
      sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
    );
  }

  return queryBuilder;
}

export function countDistinctCountriesForReport(query: AnalyticsQuery) {
  let queryBuilder = prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .select(["countryCode", sql<number>`COUNT(*)`.as("count")]);

  if (query.sd) {
    queryBuilder = queryBuilder.where("occuredAt", ">=", query.sd);
  }

  if (query.ed) {
    queryBuilder = queryBuilder.where("e.occuredAt", "<", addDays(query.ed, 1));
  }

  if (query.language) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
    );
  }

  if (query.license) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
    );
  }

  if (query.countryCode) {
    queryBuilder = queryBuilder.where("e.countryCode", "=", query.countryCode);
  } else {
    queryBuilder = queryBuilder.where("e.countryCode", "is not", null);
  }

  if (query.browserLanguage) {
    queryBuilder = queryBuilder.where(
      "e.browserLanguage",
      "=",
      query.browserLanguage,
    );
  }

  if (query.eventType) {
    queryBuilder = queryBuilder.where(
      "e.eventType",
      "=",
      sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
    );
  }

  return queryBuilder.groupBy("countryCode").orderBy("count", "desc");
}

export function eventsForReport(query: AnalyticsQuery) {
  let queryBuilder = prisma.$kysely
    .selectFrom("AnalyticsEvent as e")
    .select([
      "occuredAt",
      "sessionId",
      "eventType",
      "browserLanguage",
      "ipAddress",
      "countryCode",
      "regionCode",
      "city",
      "articleId",
      "selectedLanguages",
      "selectedLicenses",
      "searchQuery",
    ]);

  if (query.sd) {
    queryBuilder = queryBuilder.where("e.occuredAt", ">=", query.sd);
  }

  if (query.ed) {
    queryBuilder = queryBuilder.where("e.occuredAt", "<", addDays(query.ed, 1));
  }

  if (query.language) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.language), "=", fn.any("e.selectedLanguages")),
    );
  }

  if (query.license) {
    queryBuilder = queryBuilder.where(({ eb, fn }) =>
      eb(eb.val(query.license), "=", fn.any("e.selectedLicenses")),
    );
  }

  if (query.countryCode) {
    queryBuilder = queryBuilder.where("e.countryCode", "=", query.countryCode);
  }

  if (query.browserLanguage) {
    queryBuilder = queryBuilder.where(
      "e.browserLanguage",
      "=",
      query.browserLanguage,
    );
  }

  if (query.eventType) {
    queryBuilder = queryBuilder.where(
      "e.eventType",
      "=",
      sql<AnalyticsEventType>`${query.eventType}::"AnalyticsEventType"`,
    );
  }

  return queryBuilder;
}
