import { PageContainer } from "@/components/shared/PageContainer";
import { ReactNode } from "react";

export default function TopSearchesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageContainer
      title="Top Searches"
      history={[{ title: "Analytics", href: "/admin/analytics" }]}
    >
      {children}
    </PageContainer>
  );
}
