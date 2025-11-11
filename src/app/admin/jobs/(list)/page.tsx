import { fetchJobs } from "@/actions/jobs";
import { SyncJobQuery, SyncJobQuerySchema } from "@/schemas/sync-jobs";
import { SearchParams } from "@/types/shared";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import { JobsTable } from "../../../../components/jobs/JobsTable";

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
