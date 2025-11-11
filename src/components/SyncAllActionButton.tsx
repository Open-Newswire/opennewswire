import { Button } from "@/components/ui/button";
import { enqueueAllSync } from "@/triggers/feeds";

export function SyncAllActionButton({
  variant = "secondary",
}: {
  variant?: "secondary" | "default";
}) {
  return (
    <Button variant={variant} onClick={enqueueAllSync}>
      Sync All
    </Button>
  );
}
