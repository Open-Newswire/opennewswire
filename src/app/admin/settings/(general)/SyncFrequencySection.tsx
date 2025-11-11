import { Alert, AlertDescription } from "@/components/ui/alert";
import { SyncFrequencyPreference } from "@/schemas/app-preferences";
import { getPreference } from "@/services/app-preferences";
import { Info } from "lucide-react";
import { SyncFrequencyPreferenceForm } from "./SyncFrequencyPreferenceForm";

export async function SyncFrequencySection() {
  const syncFrequency = await getPreference(SyncFrequencyPreference);

  return (
    <section className="mb-10">
      <h3 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight">
        Sync Frequency
      </h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SyncFrequencyPreferenceForm value={syncFrequency} />
        <Alert className="mb-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Increasing the sync frequency may incur additional hosting costs.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}
