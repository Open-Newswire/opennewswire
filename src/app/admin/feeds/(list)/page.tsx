import { fetchFeeds } from "@/actions/feeds";
import { FeedsTable } from "@/components/feeds/FeedsTable";
import { FeedQuery, FeedQuerySchema } from "@/schemas/feeds";
import { SearchParams } from "@/types/shared";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";

export const dynamic = "force-dynamic";

export default async function Feeds(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const query = parseSchemaWithDefaults(
    FeedQuerySchema,
    searchParams,
  ) as FeedQuery;
  const [feeds, meta] = await fetchFeeds(query);

  return <FeedsTable feeds={feeds} pagination={meta} />;
}
