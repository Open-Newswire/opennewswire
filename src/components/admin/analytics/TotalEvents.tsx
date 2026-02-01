import { QueryAwareNavButton } from "@/components/admin/analytics/QueryAwareNavButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingResult } from "@/domains/shared/types";

export async function TotalEvents(props: LoadingResult<number>) {
  return (
    <Card className="relative h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Total Events</CardTitle>
        <CardDescription>
          Total events recorded in the selected date range
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {props.isLoading ? (
          <Skeleton className="h-8 w-25" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold font-mono">{props.result}</div>
            <QueryAwareNavButton title="View Events" subpath="events" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
