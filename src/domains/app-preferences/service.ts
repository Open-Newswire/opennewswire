import prisma from "@/lib/prisma";
import { SyncFrequencyPreference } from "@/domains/app-preferences/schemas";
import { rescheduleNextSyncAll } from "@/domains/sync/tasks/schedule-helpers";
import { AppPreference } from "@/domains/app-preferences/types";
import { z } from "zod";

// Hooks with preference-specific logic that run when a preference changes
const updateHooks = {
  [SyncFrequencyPreference.key]: async (
    value: z.infer<typeof SyncFrequencyPreference.schema>,
  ) => {
    await rescheduleNextSyncAll(value);
  },
};

export async function getPreference<S extends z.ZodTypeAny>(
  preferenceType: AppPreference<S>,
): Promise<z.infer<S>> {
  const preference = await prisma.appPreference.findUnique({
    where: { key: preferenceType.key },
  });

  return preferenceType.schema.parse(preference?.value ?? {});
}

export async function setPreference<S extends z.ZodTypeAny>(
  preferenceType: AppPreference<S>,
  value: z.infer<S>,
) {
  await prisma.appPreference.upsert({
    where: { key: preferenceType.key },
    create: {
      key: preferenceType.key,
      value: value,
    },
    update: {
      value: value,
    },
  });

  if (updateHooks[preferenceType.key]) {
    await updateHooks[preferenceType.key](value);
  }
}

export interface CronScheduleStatus {
  identifier: string;
  known: boolean;
}

export async function getDiagnosticsReport(): Promise<CronScheduleStatus[]> {
  const expectedIdentifiers = [
    "scheduled-enrich-events",
    "scheduled-cleanup-articles",
    "scheduled-cleanup-events",
    "scheduled-cleanup-jobs",
  ];

  let knownIdentifiers: string[] = [];

  try {
    const rows = await prisma.$queryRaw<{ identifier: string }[]>`
      SELECT identifier FROM graphile_worker._private_known_crontabs
    `;
    knownIdentifiers = rows.map((r) => r.identifier);
  } catch {
    // Table may not exist if worker hasn't started yet
  }

  return expectedIdentifiers.map((identifier) => ({
    identifier,
    known: knownIdentifiers.includes(identifier),
  }));
}
