import { Feed } from "@/domains/feeds";
import { SyncLogger } from "@/domains/sync";
import { AtomParser } from "@/domains/sync/feed-parser/atom-parser";
import { RssParser } from "@/domains/sync/feed-parser/rss-parser";
import { ParserOutput } from "@/domains/sync/feed-parser/types";
import { XMLParser } from "fast-xml-parser";
import fields from "./fields";
import * as utils from "./utils";

interface ParserOptions {
  logger: SyncLogger;
}

export class Parser {
  private xmlParser: XMLParser;
  private logger: SyncLogger;

  constructor(options: ParserOptions) {
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
    this.logger = options.logger;
  }

  async parseString(xml: string, feed: Feed): Promise<ParserOutput> {
    try {
      const result = await this.xmlParser.parse(xml);

      if (!result) {
        throw new Error("Parser result is empty.");
      }

      let output = null;

      if (result.feed) {
        output = this.buildAtomFeed(result, feed);
      } else if (result.rss?.$version?.match(/^2/)) {
        output = this.buildRSS2(result, feed);
      } else if (result["rdf:RDF"]) {
        output = this.buildRSS1(result, feed);
      } else if (result.rss?.$version?.match(/0\.9/)) {
        output = this.buildRSS0_9(result, feed);
      } else {
        throw new Error("Feed not recognized as Atom or RSS 0.9, 1 or 2.");
      }

      return output;
    } catch (err) {
      throw new Error("Unable to parse feed: " + err);
    }
  }

  private buildAtomFeed(xmlObj: any, feed: Feed): ParserOutput {
    let output: ParserOutput = { items: [] };
    const parser = new AtomParser(this.logger, feed);

    if (xmlObj.feed.link) {
      output.link = utils.getAtomLink(xmlObj.feed.link, "alternate", 0);
      output.feedUrl = utils.getAtomLink(xmlObj.feed.link, "self", 1);
    }

    if (xmlObj.feed.title) {
      const title = utils.getTextContent(xmlObj.feed.title);

      if (title) {
        output.title = title;
      }
    }

    if (xmlObj.feed.updated) {
      output.lastBuildDate = xmlObj.feed.updated;
    }

    output.items = (xmlObj.feed.entry || []).map((entry: any) =>
      parser.parseEntry(entry),
    );

    return output;
  }

  private buildRSS0_9(xmlObj: any, feed: Feed) {
    var channel = xmlObj.rss.channel;
    var items = channel.item || [];

    return this.buildRSS(channel, items, feed);
  }

  private buildRSS1(xmlObj: any, feed: Feed) {
    xmlObj = xmlObj["rdf:RDF"];
    let channel = xmlObj.channel;
    let items = xmlObj.item || [];

    return this.buildRSS(channel, items, feed);
  }

  private buildRSS2(xmlObj: any, feed: Feed) {
    let channel = xmlObj.rss.channel;
    let items = channel.item || [];
    let output = this.buildRSS(channel, items, feed);

    return output;
  }

  private buildRSS(channel: any, items = [], feed: Feed) {
    let output: ParserOutput = { items: [] };
    let parser = new RssParser(this.logger, feed);
    let feedFields = fields.feed;

    if (
      channel["atom:link"] &&
      channel["atom:link"][0] &&
      channel["atom:link"][0].$href
    ) {
      output.feedUrl = channel["atom:link"][0].$href;
    }

    if (channel.image && channel.image.url) {
      output.image = {};
      let image = channel.image;

      if (image.link && Array.isArray(image.link))
        output.image.link = image.link[0];
      if (image.url) output.image.url = image.url;
      if (image.title) output.image.title = image.title;
      if (image.width) output.image.width = String(image.width);
      if (image.height) output.image.height = String(image.height);
    }

    const paginationLinks = this.generatePaginationLinks(channel);

    if (Object.keys(paginationLinks).length) {
      output.paginationLinks = paginationLinks;
    }

    utils.copyFromXML(channel, output, feedFields);

    output.items = items.map((xmlItem) => parser.parseEntry(xmlItem));

    return output;
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
