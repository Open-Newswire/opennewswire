import { fetchFeedById } from "@/domains/feeds/actions";
import { fetchJobsByFeed } from "@/domains/jobs/actions";
import { JobsTable } from "@/components/admin/jobs/JobsTable";
import { TabsContent } from "@/components/ui/tabs";
import { SyncJobQuery, SyncJobQuerySchema } from "@/domains/jobs/schemas";
import { SearchParams } from "@/domains/shared/types";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";

export default async function FeedSyncHistory(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const feed = await fetchFeedById(params.id);

  if (!feed) {
    return <div>Feed not found</div>;
  }

  const query = parseSchemaWithDefaults(
    SyncJobQuerySchema,
    searchParams,
  ) as SyncJobQuery;
  const [jobs, meta] = await fetchJobsByFeed(feed, query);

  return (
    <TabsContent value="sync-history">
      <JobsTable jobs={jobs} pagination={meta} />
    </TabsContent>
  );
}
