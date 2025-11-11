import { fetchFeedById } from "@/actions/feeds";
import { TabsContent } from "@/components/ui/tabs";
import { fetchArticlesByFeed } from "@/services/articles";
import { StoriesTable } from "./ArticlesTable";

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
