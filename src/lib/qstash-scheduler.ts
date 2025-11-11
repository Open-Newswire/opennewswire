import { QSTASH_OPENNEWSWIRE_URL, qstashClient } from "@/lib/qstash";
import { SavedSchedule, Schedule, Scheduler } from "@/lib/scheduler";

export class QStashScheduler implements Scheduler {
  async setSchedule(
    schedule: Schedule,
    cron: string,
    body?: any,
  ): Promise<void> {
    console.log(
      "Setting schedule with path:",
      QSTASH_OPENNEWSWIRE_URL + schedule.path,
    );
    await qstashClient.schedules.create({
      scheduleId: schedule.name,
      destination: QSTASH_OPENNEWSWIRE_URL + schedule.path,
      method: "POST",
      cron,
      headers: {
        "Content-Type": "application/json",
      },
      retries: 0,
      body,
    });
  }

  async getSchedules(): Promise<SavedSchedule[]> {
    const schedules = await qstashClient.schedules.list();

    return schedules.map((schedule) => ({
      name: schedule.scheduleId,
      cron: schedule.cron,
    }));
  }
}
