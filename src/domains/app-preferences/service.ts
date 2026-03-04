import prisma from "@/lib/prisma";
import { scheduler, schedules } from "@/lib/scheduler";
import { AppPreference } from "@/domains/app-preferences/types";
import { z } from "zod";

type UpdateHook = (value: unknown) => Promise<void>;
type DiagnosticProvider = () => boolean;

const updateHooks: Record<string, UpdateHook> = {};

let syncAllDiagnosticProvider: DiagnosticProvider | null = null;
let syncAllDiagnosticFixer: (() => Promise<void>) | null = null;

export function registerUpdateHook(key: string, hook: UpdateHook) {
  updateHooks[key] = hook;
}

export function registerSyncAllDiagnostics(
  provider: DiagnosticProvider,
  fixer: () => Promise<void>,
) {
  syncAllDiagnosticProvider = provider;
  syncAllDiagnosticFixer = fixer;
}

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

  // syncAll is managed by the worker, not QStash
  if (syncAllDiagnosticProvider) {
    report.syncAll = syncAllDiagnosticProvider()
      ? ScheduledDiagnosticStatus.Ok
      : ScheduledDiagnosticStatus.Missing;
  } else {
    report.syncAll = ScheduledDiagnosticStatus.Missing;
  }

  // Fetch QStash schedules for remaining jobs
  const createdSchedules = await scheduler.getSchedules();

  for (const [key, schedule] of Object.entries(schedules)) {
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

    // @ts-ignore
    report[key] = ScheduledDiagnosticStatus.Ok;
  }

  return report;
}

export async function runDiagnosticFix() {
  // Fix syncAll via registered fixer (worker restart)
  if (syncAllDiagnosticFixer && syncAllDiagnosticProvider && !syncAllDiagnosticProvider()) {
    await syncAllDiagnosticFixer();
  }

  // Fix QStash schedules for remaining jobs
  for (const schedule of Object.values(schedules)) {
    if (schedule.defaultCron) {
      await scheduler.setSchedule(
        {
          name: schedule.name,
          path: schedule.path,
        },
        schedule.defaultCron,
      );
      console.info("Set QStash schedule:", schedule.name);
    }
  }
}
