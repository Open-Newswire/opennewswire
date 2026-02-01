import prisma from "@/lib/prisma";
import { SyncJobHistoryRetentionPreference } from "@/domains/app-preferences/schemas";
import { getPreference } from "@/domains/app-preferences/service";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { sub } from "date-fns";
import { StatusCodes } from "http-status-codes";

export const maxDuration = 300; // 300 seconds

export const POST = verifySignatureAppRouter(async () => {
  const retentionPolicy = await getPreference(
    SyncJobHistoryRetentionPreference,
  );
  const cutoffDate = sub(new Date(), {
    [retentionPolicy.unit]: retentionPolicy.period,
  });

  try {
    await prisma.syncJob.deleteMany({
      where: {
        triggeredAt: {
          lt: cutoffDate,
        },
      },
    });

    return new Response("Jobs successfully cleaned up");
  } catch (err) {
    return new Response(`Error cleaning up jobs: ${err}`, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
});
