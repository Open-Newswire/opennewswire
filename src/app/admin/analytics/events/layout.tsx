import { PageContainer } from "@/components/shared/PageContainer";
import { ReactNode } from "react";

export default function EventsLayout({ children }: { children: ReactNode }) {
  return (
    <PageContainer
      title="Events"
      history={[{ title: "Analytics", href: "/admin/analytics" }]}
    >
      {children}
    </PageContainer>
  );
}
