import prisma from "@/lib/prisma";
import { scheduler, schedules } from "@/lib/scheduler";
import { SyncFrequencyPreference } from "@/domains/app-preferences/schemas";
import { AppPreference } from "@/domains/app-preferences/types";
import { toCron } from "@/utils/cron";
import { z } from "zod";

// Hooks with preference-specific logic that run when a preference changes
const updateHooks = {
  [SyncFrequencyPreference.key]: async (
    value: z.infer<typeof SyncFrequencyPreference.schema>,
  ) => {
    const cron = toCron(value);
    await scheduler.setSchedule(schedules.syncAll, cron);
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

export enum ScheduledDiagnosticStatus {
  Missing = "Missing",
  Misconfigured = "Misconfigured",
  Ok = "Ok",
}

interface ScheduleDiagnosticReport {
  syncAll: ScheduledDiagnosticStatus;
  cleanupJobs: ScheduledDiagnosticStatus;
  cleanupArticles: ScheduledDiagnosticStatus;
  enrichEvents: ScheduledDiagnosticStatus;
}

export async function getDiagnosticsReport() {
  const report: Partial<ScheduleDiagnosticReport> = {};
  // Fetch all schedules from QStash
  const createdSchedules = await scheduler.getSchedules();

  for await (const [key, schedule] of Object.entries(schedules)) {
    const createdSchedule = createdSchedules.find(
      (s) => s.name == schedule.name,
    );

    if (!createdSchedule) {
      // @ts-ignore
      report[key] = ScheduledDiagnosticStatus.Missing;
      continue;
    }

    if (schedule.defaultCron && schedule.defaultCron != createdSchedule?.cron) {
      // @ts-ignore
      report[key] = ScheduledDiagnosticStatus.Misconfigured;
      continue;
    }

    if (schedule.name.startsWith("sync-all-")) {
      const preference = await getPreference(SyncFrequencyPreference);
      const expectedCron = toCron(preference);

      if (expectedCron !== createdSchedule.cron) {
        // @ts-ignore
        report[key] = ScheduledDiagnosticStatus.Misconfigured;
        continue;
      }
    }

    // @ts-ignore
    report[key] = ScheduledDiagnosticStatus.Ok;
  }

  return report;
}

export async function runDiagnosticFix() {
  for await (const schedule of Object.values(schedules)) {
    if (schedule.defaultCron) {
      await scheduler.setSchedule(
        {
          name: schedule.name,
          path: schedule.path,
        },
        schedule.defaultCron,
      );
      console.info("Set QStash schedule:", schedule.name);
      continue;
    }

    if (schedule.name.startsWith("sync-all-")) {
      const preference = await getPreference(SyncFrequencyPreference);
      const cron = toCron(preference);

      await scheduler.setSchedule(
        {
          name: schedule.name,
          path: schedule.path,
        },
        cron,
        {
          isAutomatic: true,
        },
      );
      console.info("Set QStash schedule:", schedule.name);
      continue;
    }
  }
}
