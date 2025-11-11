import { Field, Item, ParserOutput } from "@/lib/feed-parser/types";
import { XMLParser } from "fast-xml-parser";
import fields from "./fields";
import * as utils from "./utils";

export class Parser {
  private xmlParser: XMLParser;

  constructor() {
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "$",
      isArray: (name) =>
        name === "Feature" ||
        name === "Segment" ||
        name === "item" ||
        name === "entry" ||
        name === "link" ||
        name === "category" ||
        name === "atom:link",
    });
  }

  async parseString(xml: string): Promise<ParserOutput> {
    try {
      const result = await this.xmlParser.parse(xml);

      if (!result) {
        throw new Error("Unable to parse XML.");
      }

      let feed = null;

      if (result.feed) {
        feed = this.buildAtomFeed(result);
      } else if (result.rss?.$version?.match(/^2/)) {
        feed = this.buildRSS2(result);
      } else if (result["rdf:RDF"]) {
        feed = this.buildRSS1(result);
      } else if (result.rss?.$version?.match(/0\.9/)) {
        feed = this.buildRSS0_9(result);
      } else {
        throw new Error("Feed not recognized as RSS 1 or 2.");
      }

      return feed;
    } catch (err) {
      throw new Error("Unable to parse XML." + err);
    }
  }

  private buildAtomFeed(xmlObj: any): ParserOutput {
    let feed: ParserOutput = { items: [] };

    // utils.copyFromXML(xmlObj.feed, feed, this.options.customFields.feed);

    if (xmlObj.feed.link) {
      feed.link = utils.getLink(xmlObj.feed.link, "alternate", 0);
      feed.feedUrl = utils.getLink(xmlObj.feed.link, "self", 1);
    }

    if (xmlObj.feed.title) {
      let title = xmlObj.feed.title || "";
      if (title._) title = title._;
      if (title) feed.title = title;
    }

    if (xmlObj.feed.updated) {
      feed.lastBuildDate = xmlObj.feed.updated;
    }

    feed.items = (xmlObj.feed.entry || []).map((entry: any) =>
      this.parseItemAtom(entry),
    );

    return feed;
  }

  private parseItemAtom(entry: any) {
    let item: Item = {};

    // utils.copyFromXML(entry, item, this.options.customFields.item);

    if (entry.title) {
      let title = entry.title || "";
      if (title._) title = title._;
      if (title) item.title = title;
    }

    if (entry.link && entry.link.length) {
      item.link = utils.getLink(entry.link, "alternate", 0);
    }

    if (entry.published && typeof entry.published === "string")
      item.pubDate = entry.published;
    if (!item.pubDate && entry.updated && typeof entry.updated === "string")
      item.pubDate = entry.updated;
    if (entry.author) {
      item.author = utils.compactAuthors(entry.author);
    }

    if (entry.content) {
      item.content = utils.getContent(entry.content);
      item.contentSnippet = utils.getSnippet(item.content);
    }

    if (entry.summary) {
      item.summary = utils.getContent(entry.summary);
    }

    if (entry.id) {
      item.id = String(entry.id);
    }

    this.setISODate(item);

    return item;
  }

  private buildRSS0_9(xmlObj: any) {
    var channel = xmlObj.rss.channel;
    var items = channel.item || [];

    return this.buildRSS(channel, items);
  }

  private buildRSS1(xmlObj: any) {
    xmlObj = xmlObj["rdf:RDF"];
    let channel = xmlObj.channel;
    let items = xmlObj.item || [];

    return this.buildRSS(channel, items);
  }

  private buildRSS2(xmlObj: any) {
    let channel = xmlObj.rss.channel;
    let items = channel.item || [];
    let feed = this.buildRSS(channel, items);

    return feed;
  }

  private buildRSS(channel: any, items = []) {
    let feed: ParserOutput = { items: [] };
    let feedFields = fields.feed;
    let itemFields = fields.item;

    if (
      channel["atom:link"] &&
      channel["atom:link"][0] &&
      channel["atom:link"][0].$href
    ) {
      feed.feedUrl = channel["atom:link"][0].$href;
    }

    if (channel.image && channel.image.url) {
      feed.image = {};
      let image = channel.image;

      if (image.link && Array.isArray(image.link))
        feed.image.link = image.link[0];
      if (image.url) feed.image.url = image.url;
      if (image.title) feed.image.title = image.title;
      if (image.width) feed.image.width = String(image.width);
      if (image.height) feed.image.height = String(image.height);
    }

    const paginationLinks = this.generatePaginationLinks(channel);

    if (Object.keys(paginationLinks).length) {
      feed.paginationLinks = paginationLinks;
    }

    utils.copyFromXML(channel, feed, feedFields);

    feed.items = items.map((xmlItem) => this.parseItemRss(xmlItem, itemFields));

    return feed;
  }

  private parseItemRss(xmlItem: any, itemFields: Field[]) {
    let item: Item = {};
    utils.copyFromXML(xmlItem, item, itemFields);

    if (xmlItem.enclosure) {
      // Extract all $ attributes from enclosure
      const enclosure = xmlItem.enclosure;
      item.enclosure = {
        url: enclosure.$url,
        length: enclosure.$length,
        type: enclosure.$type,
      };
    }

    if (xmlItem.description) {
      item.content = utils.getContent(xmlItem.description);
      item.contentSnippet = utils.getSnippet(item.content);
    }

    if (xmlItem.guid) {
      const xmlGuid = xmlItem.guid;
      item.guid =
        xmlGuid["#text"] !== undefined
          ? String(xmlGuid["#text"])
          : String(xmlGuid);
    }

    if (xmlItem["$rdf:about"]) {
      item["rdf:about"] = xmlItem["$rdf:about"];
    }

    if (xmlItem.category) item.categories = xmlItem.category;

    var mediaContent = xmlItem["media:content"] ?? null;
    if (mediaContent) {
      // Extract all $ attributes from media:content
      item.mediaContent = {
        url: mediaContent.$url,
        type: mediaContent.$type,
        width: mediaContent.$width,
        height: mediaContent.$height,
      };
    }

    // Compact author/creator arrays into single strings
    if (item.author) {
      item.author = utils.compactAuthors(item.author);
    }
    if (item.creator) {
      item.creator = utils.compactAuthors(item.creator);
    }

    this.setISODate(item);

    return item;
  }

  private setISODate(item: Item) {
    let date = item.pubDate || item.date;
    if (date) {
      try {
        item.isoDate = new Date(date.trim()).toISOString();
      } catch (e) {
        // Ignore bad date format
      }
    }
  }

  /**
   * Generates a pagination object where the rel attribute is the key and href attribute is the value
   *  { self: 'self-url', first: 'first-url', ...  }
   *
   * @access private
   * @param {Object} channel parsed XML
   * @returns {Object}
   */
  private generatePaginationLinks(channel: any) {
    if (!channel["atom:link"]) {
      return {};
    }
    const paginationRelAttributes = ["self", "first", "next", "prev", "last"];

    return channel["atom:link"].reduce((paginationLinks: any, link: any) => {
      if (!link.$rel || !paginationRelAttributes.includes(link.$rel)) {
        return paginationLinks;
      }
      paginationLinks[link.$rel] = link.$href;

      return paginationLinks;
    }, {});
  }
}
