import { ParserOutput } from "@/lib/feed-parser/types";
import getRootDomain from "@/utils/get-root-domain";
import * as cheerio from "cheerio";
import { parse } from "url";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

export async function fetchIconFromFeed(feed: ParserOutput) {
  // Attempt to use the feed provided image first
  if (feed.image && feed.image.url) {
    return feed.image.url;
  }

  // If not, fetch the favicon from the feed's root domain
  if (feed.feedUrl) {
    try {
      return fetchIconFromRootDomain(feed.feedUrl);
    } catch (err) {
      console.error("Error fetching favicon from root domain", err);
    }
  }

  return null;
}

async function fetchIconFromRootDomain(url: string) {
  const host = parse(url).host;

  if (!host) {
    return;
  }

  const domain = getRootDomain(host);

  // Fetch the contents at the url
  const baseUrl = "https://" + domain;
  const respose = await fetch(baseUrl, {
    headers: {
      "User-Agent": USER_AGENT,
    },
    cache: "no-store",
    next: {
      revalidate: 0,
    },
  });
  const raw = await respose.text();

  // Load html into cheerio for parsing
  const $ = cheerio.load(raw);

  // Extract faviocn path
  const faviconPath =
    $('link[rel="shortcut icon"]').attr("href") ||
    $('link[rel="alternate icon"]').attr("href") ||
    $('link[rel="icon"]').attr("href");

  if (faviconPath) {
    return faviconPath.startsWith("http")
      ? faviconPath
      : `http://${domain}${faviconPath}`;
  }

  return null;
}
