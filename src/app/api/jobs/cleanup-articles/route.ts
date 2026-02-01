import prisma from "@/lib/prisma";
import { ArticleRetentionPreference } from "@/domains/app-preferences/schemas";
import { getPreference } from "@/domains/app-preferences/service";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { sub } from "date-fns";
import { StatusCodes } from "http-status-codes";

export const maxDuration = 300; // 300 seconds

export const POST = verifySignatureAppRouter(async () => {
  try {
    const policy = await getPreference(ArticleRetentionPreference);
    const cutoffDate = sub(new Date(), {
      [policy.unit]: policy.period,
    });
    const feeds = await prisma.feed.findMany();

    for (const feed of feeds) {
      console.log("Deleting articles for feed", feed.id);

      // Keep all items occuring after cutoff date
      // OR keep the minimum number of items, whichever is greater

      // Delete items that exceed the retention threshold
      const numItemsAfterCutoffDate = await prisma.article.count({
        where: {
          date: {
            gte: cutoffDate,
          },
          feedId: feed.id,
        },
      });

      console.info(
        `${numItemsAfterCutoffDate} articles were published after the retention cutoff date`,
      );

      // If we have more than the minimum items since the cutoff date, delete
      // any items older than the cutoff date
      if (numItemsAfterCutoffDate > policy.minCount) {
        await prisma.article.deleteMany({
          where: {
            date: {
              lt: cutoffDate,
            },
            feedId: feed.id,
          },
        });
      } else {
        // Otherwise delete all but the # minimum items, regardless of date
        await prisma.$queryRaw`
        DELETE FROM "Article"
        WHERE id NOT IN (
          SELECT id
          FROM "Article"
          WHERE "Article"."feedId" = ${feed.id}
          ORDER BY "date" DESC
          LIMIT ${policy.minCount}
        )
        AND "Article"."feedId" = ${feed.id}`;
      }

      console.info(`Deleting articles outside the rentention policy`);
    }

    return new Response("Articles successfully cleaned up");
  } catch (err) {
    return new Response(`Error cleaning up jobs: ${err}`, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
});
