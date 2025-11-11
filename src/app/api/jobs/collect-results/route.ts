import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  jobId: z.string(),
});

export const maxDuration = 6; // 6 seconds

export async function POST(request: Request) {
  const body = await request.json();
  const { jobId } = schema.parse(body);

  const job = await prisma.syncJob.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    return new Response(`Job with id ${jobId} not found`, { status: 404 });
  }

  if (job.parentId) {
    return new Response("Only parent jobs can have results collected", {
      status: 400,
    });
  }

  // Collect job results
  const childStatuses = await prisma.syncJob.groupBy({
    by: ["status"],
    where: {
      parentId: job.id,
    },
    _count: {
      status: true,
    },
  });
  const totalSuccess = childStatuses.find((s) => s.status === Status.COMPLETED)
    ?._count.status;
  const totalFailure = childStatuses.find((s) => s.status === Status.FAILED)
    ?._count.status;

  await prisma.syncJob.update({
    where: {
      id: job.id,
    },
    data: {
      status: Status.COMPLETED,
      completedAt: new Date(),
      totalFailure,
      totalSuccess,
    },
  });

  return new Response("Job results collected successfully");
}
