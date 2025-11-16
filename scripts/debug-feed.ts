import { Parser } from "../src/lib/feed-parser/parser";

// Try different header sets to bypass Cloudflare
const BROWSER_HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
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

const SIMPLE_HEADERS = {
  "user-agent": "FeedFetcher/1.0",
  accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
};

// Default to simple headers - less likely to trigger Cloudflare
const BASE_HEADERS = SIMPLE_HEADERS;

async function debugFeed(url: string) {
  console.log(`\n🔍 Debugging feed: ${url}\n`);

  try {
    // Fetch the feed
    console.log("📡 Fetching feed...");
    const response = await fetch(url, {
      headers: BASE_HEADERS,
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);
    console.log("\nResponse headers:");
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    console.log();

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("\nResponse body:");
      console.error(errorBody.substring(0, 500)); // First 500 chars
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xml = await response.text();
    console.log(`✓ Fetched ${xml.length} characters\n`);

    // Parse the feed
    console.log("⚙️  Parsing feed...");
    const parser = new Parser();
    const result = await parser.parseString(xml);
    console.log(`✓ Parsed successfully\n`);

    // Display results
    console.log("=".repeat(80));
    console.log("PARSED FEED OUTPUT");
    console.log("=".repeat(80));
    console.log(JSON.stringify(result, null, 2));
    console.log("=".repeat(80));
    console.log(`\n📊 Summary:`);
    console.log(`   Feed Title: ${result.title || "(no title)"}`);
    console.log(`   Items: ${result.items?.length || 0}`);
    console.log(`   Feed URL: ${result.feedUrl || "(not specified)"}`);
    console.log(
      `   Last Build Date: ${result.lastBuildDate || "(not specified)"}`,
    );

    if (result.items && result.items.length > 0) {
      console.log(`\n📰 First item preview:`);
      const firstItem = result.items[0];
      console.log(`   Title: ${firstItem.title || "(no title)"}`);
      console.log(`   Link: ${firstItem.link || "(no link)"}`);
      console.log(`   Date: ${firstItem.pubDate || "(no date)"}`);
      console.log(
        `   Author: ${firstItem.author || firstItem.creator || "(no author)"}`,
      );
    }

    console.log("\n✅ Debug complete!\n");
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error instanceof Error ? error.message : error,
    );
    if (error instanceof Error && error.stack) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Get URL from command line arguments
const url = process.argv[2];

if (!url) {
  console.error("Usage: npm run debug-feed <feed-url>");
  console.error("Example: npm run debug-feed https://example.com/feed.xml");
  process.exit(1);
}

// Run the debug function
debugFeed(url);
