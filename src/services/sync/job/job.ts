import prisma from "@/lib/prisma";
import { parseFeed } from "../parser/parser";
import { Context, FetchStatus, TransientItem } from "../types";

export async function execute(context: Context) {
  const { feed, logger } = context;
  // 1. Fetch, parse, and sanitize feed
  let result = await parseFeed(context);

  if (result.status === FetchStatus.NotModified) {
    logger.info("Conditional fetch resulted in Not Modified response");
    return;
  }

  let parsedItems = result.items;

  // Some feeds return items with the same guid, which trips things up. Remove them
  parsedItems = dedupeItems(parsedItems);

  await logger.info(`Fetched and parsed ${parsedItems.length} articles total`);

  // 2. Find existing items matching guid
  const resultItemGuids = parsedItems.map((item) => item.guid);
  const existingItems = await prisma.article.findMany({
    where: {
      feed: {
        id: feed.id,
      },
      guid: {
        in: resultItemGuids,
      },
    },
  });
  const existingItemGuids = existingItems.map((item) => item.guid);

  await logger.info(`Found ${existingItems.length} matching existing articles`);

  // 3. Insert new items
  const newItems = parsedItems
    .filter((item) => !existingItemGuids.includes(item.guid))
    .map((t) => ({
      guid: t.guid,
      title: t.title,
      author: t.author,
      link: t.link,
      date: t.date,
      content: t.content,
      feedId: feed.id,
      isHidden: t.isHidden,
    }));

  await logger.info(`Found ${newItems.length} new articles`);

  // 4. Commit new items to the database
  await prisma.$transaction([
    prisma.article.createMany({
      data: newItems,
    }),
    prisma.feed.update({
      where: {
        id: feed.id,
      },
      data: {
        etag: result.headers.etag,
        lastModifiedHeader: result.headers.lastModified,
      },
    }),
  ]);
}

function dedupeItems(items: TransientItem[]) {
  return items.filter(
    (a, i, arr) => arr.findIndex((b) => b.guid === a.guid) === i,
  );
}
