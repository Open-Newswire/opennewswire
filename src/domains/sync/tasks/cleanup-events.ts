import prisma from "@/lib/prisma";
import { EventsHistoryRetentionPreference } from "@/domains/app-preferences/schemas";
import { getPreference } from "@/domains/app-preferences/service";
import { sub } from "date-fns";
import { Task } from "graphile-worker";

export const cleanupEventsTask: Task = async (_payload, _helpers) => {
  const policy = await getPreference(EventsHistoryRetentionPreference);
  const cutoffDate = sub(new Date(), {
    [policy.unit]: policy.period,
  });

  console.log("Deleting events older than", cutoffDate);

  const deletedEvents = await prisma.analyticsEvent.deleteMany({
    where: {
      occuredAt: {
        lt: cutoffDate,
      },
    },
  });

  console.info(
    `Deleted ${deletedEvents.count} events outside the retention policy`,
  );
};
