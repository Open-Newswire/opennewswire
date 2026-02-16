import { Feed } from "@/domains/feeds";
import { SyncLogger, TransientItem } from "@/domains/sync";
import { ContentSource } from "@prisma/client";
import hash from "object-hash";
import * as utils from "./utils";

export class AtomParser {
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

  private parseDate(entry: Record<string, any>) {
    let pubDate;

    if (entry.published && typeof entry.published === "string") {
      pubDate = entry.published;
    }

    if (!pubDate && entry.updated && typeof entry.updated === "string") {
      pubDate = entry.updated;
    }

    if (!pubDate) {
      this.logger.debug(
        "Article does not have a publication date, defaulting to today",
      );
      return new Date();
    }

    const parsed = new Date(pubDate);

    if (isNaN(parsed.getTime())) {
      this.logger.debug(
        "Article publication date failed parsing, defaulting to today",
      );
      return new Date();
    }

    return parsed;
  }

  private parseTitle(entry: Record<string, any>) {
    if (entry.title) {
      const title = utils.getTextContent(entry.title);

      if (title) {
        return title;
      }
    }

    this.logger.debug(
      "Article does not have a title, defaulting to feed title",
    );
    return this.feed.title;
  }

  private parseLink(entry: Record<string, any>) {
    if (entry.link && entry.link.length) {
      return utils.getAtomLink(entry.link, "alternate", 0);
    }

    this.logger.debug("Article does not have a url, defaulting to feed url");
    return this.feed.url;
  }

  private parseAuthor(entry: Record<string, any>) {
    if (entry.author) {
      let parsedAuthor = utils.compactAuthors(entry.author);

      if (!parsedAuthor) {
        return null;
      }

      return parsedAuthor;
    }

    return null;
  }

  private parseGuid(entry: Record<string, any>) {
    if (entry.id) {
      return String(entry.id);
    }

    this.logger.debug(
      "Article does not have a usable guid, falling back to hashed-based guid generation",
    );
    return hash(entry);
  }

  private parseContent(entry: Record<string, any>) {
    switch (this.feed.contentSource) {
      case ContentSource.SUMMARY:
        return utils.getContent(entry.summary) ?? null;
      case ContentSource.CONTENT:
        return utils.getContent(entry.content) ?? null;
      case ContentSource.CONTENT_SNIPPET:
        return utils.getSnippet(utils.getContent(entry.content)) ?? null;
      case ContentSource.AUTOMATIC:
      default:
        if (entry.content) {
          return utils.getSnippet(utils.getContent(entry.content)) ?? null;
        }
        if (entry.summary) {
          return utils.getContent(entry.summary) ?? null;
        }
    }

    return null;
  }
}
