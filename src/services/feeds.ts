import { Parser } from "@/lib/feed-parser/parser";
import prisma from "@/lib/prisma";
import { FeedQuery, SaveFeedParams } from "@/schemas/feeds";
import {
  buildOrderBy,
  buildWhere,
} from "@/services/query-converters/feed-query-converter";
import { dispatchAllSync, dispatchSync } from "@/services/sync/dispatcher";
import { forceFetch } from "@/services/sync/parser/parser";
import { FeedPreview, FeedsWithLicenseAndLanguage } from "@/types/feeds";
import { fetchIconFromFeed } from "@/utils/parse-website-icon";

const parser = new Parser();

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
    const parsedFeed = await parser.parseString(rawFeed);
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
  const parsedFeed = await parser.parseString(rawFeed);
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
