import { Feed } from "@/domains/feeds/types";
import { SyncLogger, TransientItem } from "@/domains/sync";
import { ContentSource } from "@prisma/client";
import hash from "object-hash";
import * as utils from "./utils";

export class RssParser {
  private logger: SyncLogger;
  private feed: Feed;

  constructor(logger: SyncLogger, feed: Feed) {
    this.logger = logger;
    this.feed = feed;
  }

  parseEntry(entry: Record<string, any>): TransientItem {
    let item: TransientItem = {
      title: this.parseTitle(entry),
      date: this.parseDate(entry),
      link: this.parseLink(entry),
      author: this.parseAuthor(entry),
      guid: this.parseGuid(entry),
      content: this.parseContent(entry),
      isHidden: false,
    };

    return item;
  }

  private parseTitle(entry: Record<string, any>): string {
    const title = entry.title || entry["dc:title"];

    if (title) {
      return utils.getTextContent(title);
    }

    this.logger.debug(
      "Article does not have a title, defaulting to feed title",
    );
    return this.feed.title;
  }

  private parseDate(entry: Record<string, any>): Date {
    let date = entry.pubDate || entry.date || entry["dc:date"];

    if (!date) {
      this.logger.debug(
        "Article does not have a publication date, defaulting to today",
      );
      return new Date();
    }

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
      this.logger.debug(
        "Article publication date failed parsing, defaulting to today",
      );
      return new Date();
    }

    return parsed;
  }

  private parseLink(entry: Record<string, any>): string {
    if (typeof entry.link === "string") {
      return entry.link;
    }

    if (Array.isArray(entry.link) && entry.link.length > 0) {
      return entry.link[0];
    }

    this.logger.debug("Article does not have a link, defaulting to feed url");
    return this.feed.url;
  }

  private parseContent(entry: Record<string, any>): string | null {
    switch (this.feed.contentSource) {
      case ContentSource.CONTENT:
        return utils.getContent(entry.description) ?? null;
      case ContentSource.CONTENT_SNIPPET:
        return utils.getSnippet(utils.getContent(entry.description)) ?? null;
      case ContentSource.AUTOMATIC:
      default:
        if (entry.description) {
          return utils.getSnippet(utils.getContent(entry.description)) ?? null;
        }
    }

    return null;
  }

  private parseAuthor(entry: Record<string, any>): string | null {
    const author = entry.author || entry.creator || entry["dc:creator"];

    if (author) {
      return utils.compactAuthors(author) ?? null;
    }

    return null;
  }

  private parseGuid(entry: Record<string, any>): string {
    if (entry.guid) {
      const xmlGuid = entry.guid;
      const parsedGuid =
        xmlGuid["#text"] !== undefined
          ? String(xmlGuid["#text"])
          : String(xmlGuid);

      if (parsedGuid) {
        return parsedGuid;
      }
    }

    this.logger.debug(
      "Article does not have a usable guid, falling back to hashed-based guid generation",
    );
    return hash(entry);
  }
}
