import { StatusChip } from "@/app/admin/jobs/(list)/StatusChip";
import { TriggerChip } from "@/app/admin/jobs/(list)/TriggerChip";
import { TableTrLabeled } from "@/components/Table";
import { SyncJobWithFeed } from "@/types/sync-jobs";
import { Code, Table, TableTbody, Title } from "@mantine/core";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

function JobMetadata({ job }: { job: SyncJobWithFeed }) {
  return (
    <Table my="md">
      <TableTbody>
        <TableTrLabeled label="Feed">
          <Link href={`/admin/feeds/${job.feedId}`}>{job.feed!.title}</Link>
        </TableTrLabeled>
        <TableTrLabeled label="Status">
          <StatusChip status={job.status} />
        </TableTrLabeled>
        <TableTrLabeled label="Trigger">
          <TriggerChip trigger={job.trigger} />
        </TableTrLabeled>
        <TableTrLabeled label="Triggered at">
          {job.triggeredAt ? format(job.triggeredAt, "PP pp") : "-"}
        </TableTrLabeled>
        <TableTrLabeled label="Completed at">
          {job.completedAt ? format(job.completedAt, "PP pp") : "-"}
        </TableTrLabeled>
      </TableTbody>
    </Table>
  );
}

function JobLogs({ job }: { job: SyncJobWithFeed }) {
  const logs = (job.log as Prisma.JsonArray) ?? [];

  return (
    <Code block>
      {logs.map((log) => {
        return `\n${log}`;
      })}
    </Code>
  );
}

export function ChildJobDetails({ job }: { job: SyncJobWithFeed }) {
  return (
    <>
      <Title order={3}>Metadata</Title>
      <JobMetadata job={job} />
      <Title order={3} my="lg">
        Logs
      </Title>
      <JobLogs job={job} />
    </>
  );
}
