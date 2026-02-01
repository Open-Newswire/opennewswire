import prisma from "@/lib/prisma";
import { EventsHistoryRetentionPreference } from "@/domains/app-preferences/schemas";
import { getPreference } from "@/domains/app-preferences/service";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { sub } from "date-fns";
import { StatusCodes } from "http-status-codes";

export const maxDuration = 300; // 300 seconds

export const POST = verifySignatureAppRouter(async () => {
  try {
    const policy = await getPreference(EventsHistoryRetentionPreference);
    const cutoffDate = sub(new Date(), {
      [policy.unit]: policy.period,
    });

    console.log("Deleting events older than", cutoffDate);

    // Delete events that exceed the retention threshold
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

    return new Response(
      `Events successfully cleaned up. Deleted ${deletedEvents.count} events.`,
    );
  } catch (err) {
    return new Response(`Error cleaning up events: ${err}`, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
});
