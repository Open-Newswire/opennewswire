import { fetchFeedById } from "@/domains/feeds/actions";
import { TabsContent } from "@/components/ui/tabs";
import { fetchArticlesByFeed } from "@/domains/articles/service";
import { StoriesTable } from "@/components/admin/feeds/FeedArticlesTable";

export default async function FeedStories(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const feed = await fetchFeedById(params.id);

  if (!feed) {
    return <div>Feed not found</div>;
  }

  const items = await fetchArticlesByFeed(feed.id);
  return (
    <TabsContent value="articles">
      <StoriesTable items={items} />
    </TabsContent>
  );
}
