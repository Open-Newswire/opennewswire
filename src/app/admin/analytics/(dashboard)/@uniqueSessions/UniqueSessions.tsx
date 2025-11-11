import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingResult } from "@/types/shared";

export async function UniqueSessions(props: LoadingResult<number>) {
  return (
    <Card className="relative h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Unique Sessions</CardTitle>
        <CardDescription>
          Unique sessions during selected date range
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {props.isLoading ? (
          <Skeleton className="h-8 w-25" />
        ) : (
          <div className="text-2xl font-bold font-mono">
            {props.result ?? "No Data"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
