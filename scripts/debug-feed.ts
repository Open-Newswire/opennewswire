import { Parser } from "../src/domains/sync/feed-parser/parser";
import { SyncLogger } from "../src/domains/sync/types";

const BASE_HEADERS = {
  "user-agent": "FeedFetcher/1.0",
  accept:
    "application/rss+xml, application/atom+xml, application/xml, text/xml",
};

const logger: SyncLogger = {
  info: console.log,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};

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
    const parser = new Parser({ logger });
    const result = await parser.parseString(xml, {} as any);
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
      console.log(`   Date: ${firstItem.date || "(no date)"}`);
      console.log(`   Author: ${firstItem.author || "(no author)"}`);
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
