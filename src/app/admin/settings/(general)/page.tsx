import { DataRetentionSection } from "@/components/admin/settings/DataRetentionSection";
import { SyncFrequencySection } from "@/components/admin/settings/SyncFrequencySection";
import { UserAgentSection } from "@/components/admin/settings/UserAgentSection";
import { TabsContent } from "@/components/ui/tabs";

export default async function GeneralSettings() {
  return (
    <TabsContent value="general" className="my-4">
      <SyncFrequencySection />
      <UserAgentSection />
      <DataRetentionSection />
    </TabsContent>
  );
}
