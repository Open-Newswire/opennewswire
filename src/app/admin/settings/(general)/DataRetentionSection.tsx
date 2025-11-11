import { getPreference } from "@/actions/app-preferences";
import { ArticleRetentionPreferenceForm } from "@/app/admin/settings/(general)/ArticleRetentionPreferenceForm";
import { EventsHistoryRetentionPreferenceForm } from "@/app/admin/settings/(general)/EventsHistoryRetentionPreferenceForm";
import { SyncJobHistoryRetentionPreferenceForm } from "@/app/admin/settings/(general)/SyncJobHistoryRetentionPreferenceForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArticleRetentionPreference,
  EventsHistoryRetentionPreference,
  SyncJobHistoryRetentionPreference,
} from "@/schemas/app-preferences";
import { Info } from "lucide-react";

export async function DataRetentionSection() {
  const articleRetention = await getPreference(ArticleRetentionPreference);
  const syncJobHistoryRetention = await getPreference(
    SyncJobHistoryRetentionPreference,
  );
  const eventsHistoryRetention = await getPreference(
    EventsHistoryRetentionPreference,
  );

  return (
    <section>
      <h3 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight">
        Data Retention
      </h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <h4 className="scroll-m-20 text-md font-semibold tracking-tight">
            Articles
          </h4>
          <ArticleRetentionPreferenceForm value={articleRetention} />
          <h4 className="scroll-m-20 text-md font-semibold tracking-tight">
            Sync Job History
          </h4>
          <SyncJobHistoryRetentionPreferenceForm
            value={syncJobHistoryRetention}
          />
          <h4 className="scroll-m-20 text-md font-semibold tracking-tight">
            Event History
          </h4>
          <EventsHistoryRetentionPreferenceForm
            value={eventsHistoryRetention}
          />
        </div>
        <Alert className="mb-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Increasing data retention may incur additional storage costs and
            adversely impact database query performance.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}
