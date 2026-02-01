import { fetchFeedById } from "@/domains/feeds/actions";
import { TabsContent } from "@/components/ui/tabs";
import { FeedMetadata } from "@/components/admin/feeds/FeedMetadata";

export default async function FeedStories(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const feed = await fetchFeedById(params.id);

  if (!feed) {
    return <div>Feed not found</div>;
  }

  return (
    <TabsContent value="info">
      <FeedMetadata feed={feed} />
    </TabsContent>
  );
}
