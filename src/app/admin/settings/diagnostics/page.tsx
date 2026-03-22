import { getDiagnosticsReport } from "@/domains/app-preferences/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { TabsContent } from "@/components/ui/tabs";
import { CircleCheck, CircleX, Info } from "lucide-react";

const DISPLAY_NAMES: Record<string, { title: string; description: string }> = {
  "scheduled-enrich-events": {
    title: "Enrich Analytic Events",
    description:
      "Adds location details to new analytics events using IP data.",
  },
  "scheduled-cleanup-articles": {
    title: "Cleanup Articles",
    description:
      "Removes older articles based on your retention settings.",
  },
  "scheduled-cleanup-events": {
    title: "Cleanup Events",
    description:
      "Clears out old analytics events based on your retention settings.",
  },
  "scheduled-cleanup-jobs": {
    title: "Cleanup Sync History",
    description:
      "Clears out old sync logs once they're no longer needed.",
  },
};

function DiagnosticItem({
  title,
  description,
  known,
}: {
  title: string;
  description: string;
  known: boolean;
}) {
  return (
    <Item>
      <ItemMedia>
        {known ? (
          <CircleCheck className="text-green-500" />
        ) : (
          <CircleX className="text-red-500" />
        )}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

export default async function DiagnosticSettings() {
  const report = await getDiagnosticsReport();

  return (
    <TabsContent value="diagnostics" className="my-4">
      <h3 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight">
        Scheduled System Jobs
      </h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          {report.map((schedule) => {
            const display = DISPLAY_NAMES[schedule.identifier] ?? {
              title: schedule.identifier,
              description: "",
            };
            return (
              <DiagnosticItem
                key={schedule.identifier}
                title={display.title}
                description={display.description}
                known={schedule.known}
              />
            );
          })}
        </div>
        <div>
          <Alert className="mb-auto">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <p>
                Open Newswire automatically runs background jobs to keep your
                feeds up to date and your data tidy. These jobs are managed by
                the built-in worker process and scheduled via cron.
              </p>
              <p>
                System Diagnostics verify that all expected job schedules are
                registered with the worker.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </TabsContent>
  );
}
