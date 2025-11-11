import prisma from "@/lib/prisma";
import { dispatchChildSync } from "@/services/sync/dispatcher/dispatcher";
import { Status, Trigger } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  isAutomatic: z.boolean().default(false).catch(false),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { isAutomatic } = schema.parse(body);
  const trigger = isAutomatic ? Trigger.AUTOMATIC : Trigger.MANUAL;

  // Create parent job
  const parentJob = await prisma.syncJob.create({
    data: {
      status: Status.IN_PROGRESS,
      trigger,
      triggeredAt: new Date(),
    },
  });

  await dispatchChildSync(parentJob);

  return new Response(`Batch job processed successfully.`);
}
