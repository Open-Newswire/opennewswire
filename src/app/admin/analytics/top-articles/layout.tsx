import { PageContainer } from "@/components/shared/PageContainer";
import { ReactNode } from "react";

export default function TopArticlesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageContainer
      title="Top Articles"
      history={[{ title: "Analytics", href: "/admin/analytics" }]}
    >
      {children}
    </PageContainer>
  );
}
