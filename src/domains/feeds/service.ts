import { buildOrderBy, buildWhere } from "@/domains/feeds/query-converter";
import { FeedQuery, SaveFeedParams } from "@/domains/feeds/schemas";
import {
  Feed,
  FeedPreview,
  FeedsWithLicenseAndLanguage,
} from "@/domains/feeds/types";
import { BasicLogger } from "@/domains/sync/basic-logger";
import { dispatchAllSync, dispatchSync } from "@/domains/sync/dispatcher";
import { Parser } from "@/domains/sync/feed-parser/parser";
import { forceFetch } from "@/domains/sync/parser";
import prisma from "@/lib/prisma";
import { fetchIconFromFeed } from "@/utils/parse-website-icon";

const parser = new Parser({
  logger: new BasicLogger(),
});

export const fetchFeeds = async (query: FeedQuery) => {
  return prisma.feed
    .paginate({
      include: {
        license: true,
        language: true,
      },
      orderBy: {
        ...buildOrderBy(query),
      },
      where: buildWhere(query),
    })
    .withPages({
      page: query.page,
      limit: query.size,
      includePageCount: true,
    });
};

export const fetchFeedById = async (
  id: string,
): Promise<FeedsWithLicenseAndLanguage | null> => {
  return prisma.feed.findUnique({
    where: {
      id,
    },
    include: {
      license: true,
      language: true,
    },
  });
};

export const saveFeed = async (data: SaveFeedParams) => {
  return prisma.feed.create({
    data,
  });
};

prisma.feed.create;

export const updateFeed = async (id: string, data: SaveFeedParams) => {
  return prisma.feed.update({
    where: {
      id,
    },
    data,
  });
};

export const activateFeed = async (id: string) => {
  return prisma.feed.update({
    where: {
      id,
    },
    data: {
      isActive: true,
    },
  });
};

export const deactivateFeed = async (id: string) => {
  return prisma.feed.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
};

export const refreshLogo = async (id: string) => {
  const feed = await prisma.feed.findUnique({
    where: {
      id,
    },
  });

  if (!feed) {
    return;
  }

  try {
    const rawFeed = await forceFetch(feed.url);
    const parsedFeed = await parser.parseString(rawFeed, feed);
    const iconUrl = await fetchIconFromFeed(parsedFeed);

    await prisma.feed.update({
      data: {
        iconUrl,
      },
      where: {
        id,
      },
    });
  } catch (err) {
    console.log("Error fetching feed to parse logo", err);
  }
};

export const deleteFeed = async (id: string) => {
  return prisma.feed.delete({ where: { id } });
};

export const fetchFeedPreview = async (url: string): Promise<FeedPreview> => {
  const rawFeed = await forceFetch(url);
  const parsedFeed = await parser.parseString(rawFeed, {} as Feed);
  const iconUrl = (await fetchIconFromFeed(parsedFeed)) ?? undefined;

  return {
    url,
    iconUrl,
    title: parsedFeed.title,
    description: parsedFeed.description,
  };
};

export async function triggerSync(id: string) {
  const feed = await prisma.feed.findFirst({ where: { id } });

  if (!feed) {
    return;
  }

  await dispatchSync(feed);
}

export async function triggerAllSync() {
  await dispatchAllSync();
}
