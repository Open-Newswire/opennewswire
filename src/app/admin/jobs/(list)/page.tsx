import { fetchJobs } from "@/domains/jobs/actions";
import { SyncJobQuery, SyncJobQuerySchema } from "@/domains/jobs/schemas";
import { SearchParams } from "@/domains/shared/types";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import { JobsTable } from "@/components/admin/jobs/JobsTable";

export default async function Jobs(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const query = parseSchemaWithDefaults(
    SyncJobQuerySchema,
    searchParams,
  ) as SyncJobQuery;
  const [jobs, meta] = await fetchJobs(query);

  return <JobsTable jobs={jobs} pagination={meta} />;
}
