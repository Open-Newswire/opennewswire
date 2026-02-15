/**
 * Syncs languages, licenses, and feeds from production database to local.
 *
 * This script helps developers set up a prod-like environment locally for testing.
 *
 * Usage:
 *   PROD_POSTGRES_URL="postgresql://user:pass@host:5432/db" npm run sync-prod-data
 *
 * Environment Variables:
 *   PROD_POSTGRES_URL - Connection string for the production database (required)
 *   POSTGRES_URL      - Connection string for local database (uses .env default)
 */
import { PrismaClient } from "@prisma/client";

const prodDbUrl = process.env.PROD_POSTGRES_URL;

if (!prodDbUrl) {
  console.error("Error: PROD_POSTGRES_URL environment variable is required");
  console.error(
    'Usage: PROD_POSTGRES_URL="postgresql://..." npm run sync-prod-data',
  );
  process.exit(1);
}

const prodPrisma = new PrismaClient({
  datasources: {
    db: {
      url: prodDbUrl,
    },
  },
});

const localPrisma = new PrismaClient();

async function main() {
  console.log("Connecting to production database...");

  // Fetch data from production
  console.log("Fetching languages from production...");
  const languages = await prodPrisma.language.findMany();
  console.log(`  Found ${languages.length} languages`);

  console.log("Fetching licenses from production...");
  const licenses = await prodPrisma.license.findMany();
  console.log(`  Found ${licenses.length} licenses`);

  console.log("Fetching feeds from production...");
  const feeds = await prodPrisma.feed.findMany();
  console.log(`  Found ${feeds.length} feeds`);

  // Insert into local database
  console.log("\nSyncing to local database...");

  console.log("Upserting languages...");
  for (const language of languages) {
    await localPrisma.language.upsert({
      where: { id: language.id },
      update: {
        slug: language.slug,
        name: language.name,
        isRtl: language.isRtl,
        order: language.order,
      },
      create: language,
    });
  }
  console.log(`  Synced ${languages.length} languages`);

  console.log("Upserting licenses...");
  for (const license of licenses) {
    await localPrisma.license.upsert({
      where: { id: license.id },
      update: {
        slug: license.slug,
        name: license.name,
        symbols: license.symbols,
        backgroundColor: license.backgroundColor,
        textColor: license.textColor,
      },
      create: license,
    });
  }
  console.log(`  Synced ${licenses.length} licenses`);

  console.log("Upserting feeds...");
  for (const feed of feeds) {
    await localPrisma.feed.upsert({
      where: { id: feed.id },
      update: {
        isActive: feed.isActive,
        title: feed.title,
        url: feed.url,
        iconSource: feed.iconSource,
        iconUrl: feed.iconUrl,
        iconAssetUrl: feed.iconAssetUrl,
        description: feed.description,
        backgroundColor: feed.backgroundColor,
        textColor: feed.textColor,
        filterKeywords: feed.filterKeywords,
        licenseId: feed.licenseId,
        licenseUrl: feed.licenseUrl,
        licenseText: feed.licenseText,
        languageId: feed.languageId,
        lastModifiedHeader: feed.lastModifiedHeader,
        etag: feed.etag,
        contentSource: feed.contentSource,
        updatedAt: feed.updatedAt,
      },
      create: feed,
    });
  }
  console.log(`  Synced ${feeds.length} feeds`);

  console.log("\nSync complete!");
}

main()
  .then(async () => {
    await prodPrisma.$disconnect();
    await localPrisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prodPrisma.$disconnect();
    await localPrisma.$disconnect();
    process.exit(1);
  });
