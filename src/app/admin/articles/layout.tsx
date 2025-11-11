import { PageContainer } from "@/components/shared/PageContainer";
import { SyncAllActionButton } from "@/components/SyncAllActionButton";
import { ReactNode } from "react";

export default function ArticleListLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <PageContainer
        title="Articles"
        actions={<SyncAllActionButton variant="default" />}
      >
        {children}
      </PageContainer>
    </>
  );
}
