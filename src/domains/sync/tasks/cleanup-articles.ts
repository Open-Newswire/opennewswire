import { ArticleRetentionPreference } from "@/domains/app-preferences/schemas";
import { getPreference } from "@/domains/app-preferences/service";
import prisma from "@/lib/prisma";
import { sub } from "date-fns";
import { Task } from "graphile-worker";

export const cleanupArticlesTask: Task = async (_payload, _helpers) => {
  const policy = await getPreference(ArticleRetentionPreference);
  const cutoffDate = sub(new Date(), {
    [policy.unit]: policy.period,
  });
  const feeds = await prisma.feed.findMany();

  for (const feed of feeds) {
    console.log("Deleting articles for feed", feed.id);

    // Keep all items occurring after cutoff date
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
      await prisma.$kysely
        .deleteFrom("Article")
        .where("feedId", "=", feed.id)
        .where("date", "<", cutoffDate)
        .execute();
    } else {
      // Otherwise delete all but the # minimum items, regardless of date
      await prisma.$kysely
        .deleteFrom("Article")
        .where("feedId", "=", feed.id)
        .where("id", "not in", (qb) =>
          qb
            .selectFrom("Article")
            .select("id")
            .where("feedId", "=", feed.id)
            .orderBy("date", "desc")
            .limit(policy.minCount),
        )
        .execute();
    }

    console.info(`Deleting articles outside the rentention policy`);
  }
};
