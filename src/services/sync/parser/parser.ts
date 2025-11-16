import { Parser } from "@/lib/feed-parser/parser";
import { Item } from "@/lib/feed-parser/types";
import { Feed } from "@/types/feeds";
import { isBefore } from "date-fns";
import { StatusCodes } from "http-status-codes";
import {
  Context,
  FetchResult,
  FetchStatus,
  PageResult,
  ParserResult,
  TransientItem,
} from "../types";
import { sanitize } from "./sanitizer";

// TODO: Make these configurable
const BASE_HEADERS = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-US,en;q=0.9",
  "cache-control": "max-age=0",
  priority: "u=0, i",
  "sec-ch-ua":
    '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
};

/**
 * Fetches a feed, ignoring feed's last modified date and etag.
 */
export async function forceFetch(url: string) {
  const response = await fetch(url, {
    headers: BASE_HEADERS,
  });

  return await response.text();
}

/**
 * Fetches and parses a feed conditionally based on the feed's last modified date and etag.
 */
export async function parseFeed(context: Context): Promise<ParserResult> {
  const { logger, feed } = context;
  const parser = new Parser();
  let url = feed.url;
  let page = 1;
  let allItems: TransientItem[] = [];
  let shouldContinue = true;
  let headers;

  do {
    const fetchResult = await fetchFeed(url, feed);

    if (fetchResult.status === FetchStatus.NotModified) {
      return { status: FetchStatus.NotModified };
    }

    const { items, paginationLinks } = await parser.parseString(
      fetchResult.body,
    );
    headers = fetchResult.headers;

    logger.info(`Parsing page ${page}`);
    const result = parsePage(items, context);

    if (paginationLinks?.next && result.shouldContinue) {
      logger.info(`Feed has more pages, continuing parse`);

      url = paginationLinks.next;
      page += 1;
    } else {
      logger.info(`Stopping parse, last page or retention threshold reached`);

      shouldContinue = false;
    }

    allItems.push(...result.items);
  } while (shouldContinue);

  return {
    status: FetchStatus.Completed,
    items: allItems,
    headers,
  };
}

async function fetchFeed(url: string, feed: Feed): Promise<FetchResult> {
  const response = await fetch(url, {
    headers: {
      ...BASE_HEADERS,
      ...(feed.lastModifiedHeader && {
        "if-modified-since": feed.lastModifiedHeader,
      }),
      ...(feed.etag && {
        "if-none-match": feed.etag,
      }),
    },
    signal: AbortSignal.timeout(7000),
  });

  if (response.status === StatusCodes.NOT_MODIFIED) {
    return { status: FetchStatus.NotModified };
  }

  if (!response.ok) {
    throw new Error(
      `Feed provider returned a non-ok HTTP status code: ${response.status} ${response.statusText}`,
    );
  }

  const body = await response.text();
  const headers = {
    lastModified: response.headers.get("last-modified"),
    etag: response.headers.get("etag"),
  };

  return {
    status: FetchStatus.Completed,
    body,
    headers,
  };
}

function parsePage(items: Item[], context: Context): PageResult {
  const { policy, logger } = context;

  const collector: TransientItem[] = [];

  for (let item of items) {
    // Sanitize the item to remove feed discrepancies between dates, guids, and more
    const transient = sanitize(item, context);

    // Determine if the item should be hidden based on filter keywords
    if (
      context.feed.filterKeywords &&
      context.feed.filterKeywords.split(",").length > 0
    ) {
      const keywords = context.feed.filterKeywords.split(",");

      const shouldHide = keywords.some((keyword) => {
        const normalizedKeyword = keyword.trim();
        const result = hasFilteredKeywords(transient, normalizedKeyword);

        if (result) {
          logger.info(`Encountered filtered keyword: ${normalizedKeyword}`);
        }

        return result;
      });

      transient.isHidden = shouldHide;
    }

    // Execute retention logic
    if (
      context.count >= policy.minimumItems &&
      isBefore(policy.cutoffDate, transient.date)
    ) {
      return {
        items: collector,
        shouldContinue: false,
      };
    }

    collector.push(transient);
  }

  return {
    items: collector,
    shouldContinue: true,
  };
}

function hasFilteredKeywords(item: TransientItem, keyword: string): boolean {
  return [item.title, item.content, item.author].some(
    (field) => field && field.includes(keyword),
  );
}
