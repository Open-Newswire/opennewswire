import { Button } from "@/components/ui/button";
import { addFeed } from "@/triggers/feeds";

export function AddFeedActionButton() {
  return <Button onClick={addFeed}>Add Feed</Button>;
}
