import { DataRetentionSection } from "@/app/admin/settings/(general)/DataRetentionSection";
import { SyncFrequencySection } from "@/app/admin/settings/(general)/SyncFrequencySection";
import { TabsContent } from "@/components/ui/tabs";

export default async function GeneralSettings() {
  return (
    <TabsContent value="general" className="my-4">
      <SyncFrequencySection />
      <DataRetentionSection />
    </TabsContent>
  );
}
