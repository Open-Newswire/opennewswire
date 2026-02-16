import { SyncLogger } from "@/domains/sync";
import prisma from "@/lib/prisma";
import { SyncJob } from "@prisma/client";

export class DatabaseLogger implements SyncLogger {
  private job: SyncJob;
  private log: string[] = [];

  constructor(job: SyncJob) {
    this.job = job;
  }
  warn(msg: string, ...args: any) {
    console.warn(msg, args);
    this.write(msg);
  }

  info(msg: string, ...args: any) {
    console.log(msg, args);
    this.write(msg);
  }

  debug(msg: string, ...args: any) {
    console.debug(msg, args);
    this.write(msg);
  }

  error(msg: string, ...args: any) {
    console.error(msg, args);
    this.write(msg);
  }

  async flush() {
    await prisma.syncJob.update({
      where: {
        id: this.job.id,
      },
      data: {
        log: this.log,
      },
    });
  }

  private async write(message: string, ...args: any) {
    this.log.push(message);
  }
}
