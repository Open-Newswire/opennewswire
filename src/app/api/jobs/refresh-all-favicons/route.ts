import prisma from "@/lib/prisma";
import * as FeedService from "@/domains/feeds/service";

export const maxDuration = 300;

export async function POST() {
  const feeds = await prisma.feed.findMany();

  for (const feed of feeds) {
    try {
      await FeedService.refreshLogo(feed.id);
    } catch (err) {
      console.error(err);
    }
  }
}
