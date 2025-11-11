import { AddFeedActionButton } from "@/app/admin/feeds/(list)/AddFeedActionButton";
import { PageContainer } from "@/components/shared/PageContainer";
import { SyncAllActionButton } from "@/components/SyncAllActionButton";
import { ReactNode } from "react";

export default function FeedListLayout({ children }: { children: ReactNode }) {
  return (
    <PageContainer
      title="Feeds"
      actions={
        <>
          <SyncAllActionButton />
          <AddFeedActionButton />
        </>
      }
    >
      {children}
    </PageContainer>
  );
}
