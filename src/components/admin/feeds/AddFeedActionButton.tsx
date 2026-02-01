import { Button } from "@/components/ui/button";
import { addFeed } from "@/domains/feeds/triggers";

export function AddFeedActionButton() {
  return <Button onClick={addFeed}>Add Feed</Button>;
}
