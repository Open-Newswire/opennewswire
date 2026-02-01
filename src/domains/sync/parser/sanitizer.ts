import { Item } from "@/lib/feed-parser/types";
import { Feed } from "@/domains/feeds/types";
import { ContentSource } from "@prisma/client";
import { parseISO } from "date-fns";
import hash from "object-hash";
import { Context, TransientItem } from "../types";

/**
 * Sanitize attempts to correct for differences between feed shapes by normalizing
 * property names and content types into a standard shape OpenNewswire can use.
 * @param item An item originating from the Parser
 * @returns a TransientItem to eventually be persisted
 */
export function sanitize(item: Item, context: Context): TransientItem {
  const guid = extractGuid(item, context);
  const title = extractTitle(item, context);
  const link = extractLink(item, context);
  const date = extractPublicationDate(item, context);
  const content = extractContent(item, context.feed);
  const author = extractAuthor(item);

  return {
    guid,
    date,
    content,
    author,
    title,
    link,
    isHidden: false,
  };
}

function extractTitle(item: Item, context: Context): string {
  if (item.title) {
    return item.title;
  }

  context.logger.info(
    "Article does not have a title, falling back to the feed's title",
  );

  return context.feed.title;
}

function extractLink(item: Item, context: Context): string {
  if (item.link) {
    return item.link;
  }

  context.logger.info(
    "Article does not have a link, falling back to the feed's url",
  );

  return context.feed.url;
}

function extractGuid(item: Item, context: Context): string {
  if (item.guid && typeof item.guid === "string") {
    return item.guid;
  }

  if (item.guid && typeof item.guid !== "string") {
    context.logger.info(
      "Article guid is not in string format, falling back to id",
    );
  }

  if (item.id) {
    return item.id;
  }

  context.logger.info(
    "Article does not have a usable guid, falling back to hashed-based guid generation",
  );

  return hash(item);
}

function extractPublicationDate(item: Item, context: Context): Date {
  if (!item.isoDate) {
    context.logger.info(
      "Article does not have a publication date, defaulting to today",
    );

    return new Date();
  }

  try {
    return parseISO(item.isoDate);
  } catch (err) {
    context.logger.info(
      "Article publication date failed parsing, defaulting to today",
    );

    return new Date();
  }
}

function extractContent(item: Item, feed: Feed): string | null {
  if (feed.contentSource === ContentSource.CONTENT) {
    return item.content ?? null;
  }

  if (feed.contentSource === ContentSource.CONTENT_SNIPPET) {
    return item.contentSnippet ?? null;
  }

  if (feed.contentSource === ContentSource.SUMMARY) {
    return item.summary ?? null;
  }

  if (item.contentSnippet) {
    return item.contentSnippet;
  }

  if (item.content) {
    return item.content;
  }

  return null;
}

function extractAuthor(item: Item): string | null {
  if (item.creator) {
    return item.creator;
  }

  if (item.author) {
    return item.author;
  }

  console.warn("Item has no parsable author");

  return null;
}
