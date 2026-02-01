import { fetchChildJobs } from "@/domains/jobs/actions";
import { StatusChip } from "@/components/admin/jobs/StatusChip";
import { TriggerChip } from "@/components/admin/jobs/TriggerChip";
import { JobsTable } from "@/components/admin/jobs/JobsTable";
import { TableTrLabeled } from "@/components/Table";
import { SyncJobQuery, SyncJobQuerySchema } from "@/domains/jobs/schemas";
import { SearchParams } from "@/domains/shared/types";
import { SyncJobWithFeed } from "@/domains/jobs/types";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import { Table, TableTbody, Title } from "@mantine/core";
import { format } from "date-fns";

function ParentJobMetadata({ job }: { job: SyncJobWithFeed }) {
  return (
    <Table my="md">
      <TableTbody>
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
    <>
      <Title order={3}>Job Metadata</Title>
      <ParentJobMetadata job={job} />
      <Title order={3} my="lg">
        Child Jobs
      </Title>
      <JobsTable jobs={jobs} pagination={meta} />
    </>
  );
}
