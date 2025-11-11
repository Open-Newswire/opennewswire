import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingResult } from "@/types/shared";
import { addSeconds, intervalToDuration } from "date-fns";
import { useMemo } from "react";

function DurationDisplay({ durationInSeconds }: { durationInSeconds: number }) {
  const duration = useMemo(() => {
    var helperDate = addSeconds(new Date(0), durationInSeconds);
    return intervalToDuration({ start: new Date(0), end: helperDate });
  }, [durationInSeconds]);

  return (
    <div className="text-2xl font-bold font-mono line-break-anywhere">
      {durationInSeconds && durationInSeconds > 0 && duration ? (
        <>
          {duration.hours ? (
            <div className="inline-block">
              {duration.hours}
              <span className="text-sm mx-1">
                hour{duration.hours > 1 ? "s" : ""}
                {duration.minutes ? "," : null}
              </span>
            </div>
          ) : null}
          {duration.minutes ? (
            <div className="inline-block">
              {duration.minutes}
              <span className="text-sm mx-1">
                minute{duration.minutes > 1 ? "s" : ""}
                {duration.seconds ? "," : null}
              </span>
            </div>
          ) : null}
          {duration.seconds ? (
            <div className="inline-block">
              {duration.seconds}
              <span className="text-sm mx-1">
                second{duration.seconds > 1 ? "s" : ""}
              </span>
            </div>
          ) : null}
        </>
      ) : (
        "No Data"
      )}
    </div>
  );
}

export async function SessionDuration(props: LoadingResult<number>) {
  return (
    <Card className="relative h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Average Session Duration</CardTitle>
        <CardDescription>
          Session duration during selected date range
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {props.isLoading ? (
          <Skeleton className="h-8 w-50" />
        ) : (
          <div className="flex items-center justify-between">
            <DurationDisplay durationInSeconds={props.result} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
