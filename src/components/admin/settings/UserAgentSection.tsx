import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserAgentPreference } from "@/domains/app-preferences/schemas";
import { getPreference } from "@/domains/app-preferences/service";
import { Info } from "lucide-react";
import { UserAgentPreferenceForm } from "./UserAgentPreferenceForm";

export async function UserAgentSection() {
  const userAgent = await getPreference(UserAgentPreference);

  return (
    <section className="mb-10">
      <h3 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight">
        User Agent
      </h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UserAgentPreferenceForm value={userAgent} />
        <Alert className="mb-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            The User-Agent header sent when fetching feeds. Some feed providers
            may block requests based on this value.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}
