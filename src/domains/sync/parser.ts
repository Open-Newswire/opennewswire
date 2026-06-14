import { UserAgentPreference } from "@/domains/app-preferences/schemas";
import { getPreference } from "@/domains/app-preferences/service";
import { Feed } from "@/domains/feeds/types";
import { Parser } from "@/domains/sync/feed-parser/parser";
import { isBefore } from "date-fns";
import { StatusCodes } from "http-status-codes";
import {
  Context,
  FetchResult,
  FetchStatus,
  PageResult,
  ParserResult,
  TransientItem,
} from "./types";

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

const FETCH_TIMEOUT_MS = 7000;

function requestSignal(taskSignal?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  return taskSignal ? AbortSignal.any([timeout, taskSignal]) : timeout;
}

async function getHeaders() {
  const { userAgent } = await getPreference(UserAgentPreference);
  return {
    ...BASE_HEADERS,
    "user-agent": userAgent,
  };
}

/**
 * Fetches a feed, ignoring feed's last modified date and etag.
 */
export async function forceFetch(url: string, signal?: AbortSignal) {
  const headers = await getHeaders();
  const response = await fetch(url, {
    headers,
    signal: requestSignal(signal),
  });

  return await response.text();
}

const MAX_PAGES = 100;

/**
 * Fetches and parses a feed conditionally based on the feed's last modified date and etag.
 */
export async function parseFeed(context: Context): Promise<ParserResult> {
  const { logger, feed } = context;
  const parser = new Parser({
    logger: context.logger,
  });
  let url = feed.url;
  let page = 1;
  let allItems: TransientItem[] = [];
  let shouldContinue = true;
  let headers;
  const requestHeaders = await getHeaders();

  do {
    const fetchResult = await fetchFeed(
      url,
      feed,
      requestHeaders,
      context.signal,
    );

    if (fetchResult.status === FetchStatus.NotModified) {
      return { status: FetchStatus.NotModified };
    }

    const { items, paginationLinks } = await parser.parseString(
      fetchResult.body,
      feed,
    );
    headers = fetchResult.headers;

    logger.debug(`Parsing page ${page}`);
    const result = parsePage(items, context);
    allItems.push(...result.items);

    if (page >= MAX_PAGES) {
      logger.warn(
        `Reached MAX_PAGES (${MAX_PAGES}) for feed ${feed.id}; stopping pagination`,
      );
      shouldContinue = false;
    } else if (paginationLinks?.next && result.shouldContinue) {
      logger.debug(`Feed has more pages, continuing parse`);

      url = paginationLinks.next;
      page += 1;
    } else {
      logger.debug(`Stopping parse, last page or retention threshold reached`);

      shouldContinue = false;
    }
  } while (shouldContinue);

  return {
    status: FetchStatus.Completed,
    items: allItems,
    headers,
  };
}

async function fetchFeed(
  url: string,
  feed: Feed,
  requestHeaders: Record<string, string>,
  signal?: AbortSignal,
): Promise<FetchResult> {
  const response = await fetch(url, {
    headers: {
      ...requestHeaders,
      ...(feed.lastModifiedHeader && {
        "if-modified-since": feed.lastModifiedHeader,
      }),
      ...(feed.etag && {
        "if-none-match": feed.etag,
      }),
    },
    signal: requestSignal(signal),
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

function parsePage(items: TransientItem[], context: Context): PageResult {
  const { policy, logger } = context;

  const collector: TransientItem[] = [];

  for (let item of items) {
    // Determine if the item should be hidden based on filter keywords
    if (
      context.feed.filterKeywords &&
      context.feed.filterKeywords.split(",").length > 0
    ) {
      const keywords = context.feed.filterKeywords.split(",");

      const shouldHide = keywords.some((keyword) => {
        const normalizedKeyword = keyword.trim();
        const result = hasFilteredKeywords(item, normalizedKeyword);

        if (result) {
          logger.warn(`Encountered filtered keyword: ${normalizedKeyword}`);
        }

        return result;
      });

      item.isHidden = shouldHide;
    }

    // Stop paginating once we have enough items AND we've reached items older
    // than the retention cutoff. Feeds are newest-first, so this prevents
    // walking the entire archive when only recent items are needed.
    if (
      context.count >= policy.minimumItems &&
      isBefore(item.date, policy.cutoffDate)
    ) {
      return {
        items: collector,
        shouldContinue: false,
      };
    }

    collector.push(item);
    context.count += 1;
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
