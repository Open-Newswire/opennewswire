import { fetchChildJobs } from "@/domains/jobs/actions";
import { StatusChip } from "@/components/admin/jobs/StatusChip";
import { TriggerChip } from "@/components/admin/jobs/TriggerChip";
import { JobsTable } from "@/components/admin/jobs/JobsTable";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SyncJobQuery, SyncJobQuerySchema } from "@/domains/jobs/schemas";
import { SearchParams } from "@/domains/shared/types";
import { SyncJobWithFeed } from "@/domains/jobs/types";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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

function ParentJobMetadata({ job }: { job: SyncJobWithFeed }) {
  return (
    <div className="rounded-md border">
      <Table className="table-fixed">
        <TableBody>
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
          <MetadataTableRow label="Completed">
            <Badge
              variant="outline"
              className="text-green-700 border-green-300 bg-green-50"
            >
              {job.totalSuccess ?? 0}
            </Badge>
          </MetadataTableRow>
          <MetadataTableRow label="Failed">
            <Badge
              variant="outline"
              className="text-red-700 border-red-300 bg-red-50"
            >
              {job.totalFailure ?? 0}
            </Badge>
          </MetadataTableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export async function ParentJobDetails({
  job,
  searchParams,
}: {
  job: SyncJobWithFeed;
  searchParams: SearchParams;
}) {
  const query = parseSchemaWithDefaults(
    SyncJobQuerySchema,
    searchParams,
  ) as SyncJobQuery;
  const [jobs, meta] = await fetchChildJobs(job.id, query);

  return (
    <div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Job Metadata</h3>
        <ParentJobMetadata job={job} />
      </div>
      <h3 className="text-lg font-semibold mt-8 mb-4">Child Jobs</h3>
      <JobsTable jobs={jobs} pagination={meta} />
    </div>
  );
}
