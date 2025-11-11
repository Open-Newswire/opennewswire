import { getDiagnosticsReport } from "@/actions/app-preferences";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { TabsContent } from "@/components/ui/tabs";
import { ScheduledDiagnosticStatus } from "@/services/app-preferences";
import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";
import { DiagnosticFixButton } from "./DiagnosticFixButton";

function getStatusIcon(status?: ScheduledDiagnosticStatus) {
  switch (status) {
    case ScheduledDiagnosticStatus.Ok:
      return <CircleCheck className="text-green-500" />;
    case ScheduledDiagnosticStatus.Misconfigured:
      return <CircleAlert className="text-yellow-500" />;
    case ScheduledDiagnosticStatus.Missing:
    default:
      return <CircleX className="text-red-500" />;
  }
}

function DiagnosticItem({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status?: ScheduledDiagnosticStatus;
}) {
  return (
    <Item>
      <ItemMedia>{getStatusIcon(status)}</ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      <ItemActions />
    </Item>
  );
}

export default async function DiagnosticSettings() {
  const report = await getDiagnosticsReport();
  const hasIssues = Object.values(report).some(
    (status) => status !== ScheduledDiagnosticStatus.Ok,
  );

  return (
    <TabsContent value="diagnostics" className="my-4">
      <h3 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight">
        Scheduled System Jobs
      </h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          {hasIssues && (
            <Item variant="outline" className="bg-yellow-50">
              <ItemContent>
                <ItemTitle>
                  Misconfigured or missing scheduled jobs detected
                </ItemTitle>
              </ItemContent>
              <ItemActions>
                <DiagnosticFixButton />
              </ItemActions>
            </Item>
          )}
          <DiagnosticItem
            title="Sync Articles"
            description="Automatically pulls in the latest articles from your connected news feeds."
            status={report.syncAll}
          />
          <DiagnosticItem
            title="Cleanup Articles"
            description="Removes older articles based on your retention settings."
            status={report.cleanupArticles}
          />
          <DiagnosticItem
            title="Cleanup Sync History"
            description="Clears out old sync logs once they're no longer needed."
            status={report.cleanupJobs}
          />
          <DiagnosticItem
            title="Enrich Analytic Events"
            description="Adds location details to new analytics events using IP data."
            status={report.enrichEvents}
          />
        </div>
        <div>
          <Alert className="mb-auto">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <p>
                Open Newswire automatically runs background jobs to keep your
                feeds up to date and your data tidy. These are scheduled by a
                third-party scheduling service, which calls Open Newswire
                endpoints to run the correct job.
              </p>
              <p>
                System Diagnostics check whether the jobs are correctly
                configured and match your data retention preferences.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </TabsContent>
  );
}
