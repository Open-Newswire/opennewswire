import { StatusChip } from "@/components/admin/jobs/StatusChip";
import { TriggerChip } from "@/components/admin/jobs/TriggerChip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SyncJobWithFeed } from "@/domains/jobs/types";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

function MetadataTableRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <TableRow>
      <TableCell className="font-semibold w-45">{label}</TableCell>
      <TableCell>{children}</TableCell>
    </TableRow>
  );
}

function JobMetadata({ job }: { job: SyncJobWithFeed }) {
  return (
    <div className="rounded-md border">
      <Table className="table-fixed">
        <TableBody>
          <MetadataTableRow label="Feed">
            <Link
              href={`/admin/feeds/${job.feedId}`}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              {job.feed!.title}
            </Link>
          </MetadataTableRow>
          <MetadataTableRow label="Status">
            <StatusChip status={job.status} />
          </MetadataTableRow>
          <MetadataTableRow label="Trigger">
            <TriggerChip trigger={job.trigger} />
          </MetadataTableRow>
          <MetadataTableRow label="Triggered at">
            {job.triggeredAt ? format(job.triggeredAt, "PP pp") : "-"}
          </MetadataTableRow>
          <MetadataTableRow label="Completed at">
            {job.completedAt ? format(job.completedAt, "PP pp") : "-"}
          </MetadataTableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function JobLogs({ job }: { job: SyncJobWithFeed }) {
  const logs = (job.log as Prisma.JsonArray) ?? [];

  return (
    <pre className="rounded-md border bg-muted p-4 text-sm overflow-auto whitespace-pre-wrap">
      {logs.map((log) => `\n${log}`)}
    </pre>
  );
}

export function ChildJobDetails({ job }: { job: SyncJobWithFeed }) {
  return (
    <div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Metadata</h3>
        <JobMetadata job={job} />
      </div>
      <h3 className="text-lg font-semibold mt-8 mb-4">Logs</h3>
      <JobLogs job={job} />
    </div>
  );
}
