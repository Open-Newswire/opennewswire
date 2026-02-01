import { fetchFeeds } from "@/domains/feeds/actions";
import { FeedsTable } from "@/components/admin/feeds/FeedsTable";
import { FeedQuery, FeedQuerySchema } from "@/domains/feeds/schemas";
import { SearchParams } from "@/domains/shared/types";
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
