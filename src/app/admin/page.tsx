import { PageContainer } from "@/components/shared/PageContainer";
import { Hammer } from "lucide-react";

export default function Page() {
  return (
    <PageContainer title="Home">
      <div className="grid h-screen place-items-center gap-4">
        <Hammer size={100} className="text-muted-foreground" />
      </div>
    </PageContainer>
  );
}
