import prisma from "@/lib/prisma";
import { run } from "@/domains/sync/runner/executor";
import { z } from "zod";

const schema = z.object({
  jobId: z.string(),
});

export const maxDuration = 10; // 10 seconds

export async function POST(request: Request) {
  const data = await request.json();
  const { jobId } = schema.parse(data);

  try {
    const job = await prisma.syncJob.findUniqueOrThrow({
      where: {
        id: jobId,
      },
      include: {
        feed: true,
      },
    });

    await run(job);

    return new Response(`Job "${jobId}" processed successfully.`);
  } catch (err) {
    console.error("Error prossing job id", jobId);
    console.error(err);
    return new Response(`Job "${jobId}" failed to process.`, {
      status: 500,
    });
  }
}
