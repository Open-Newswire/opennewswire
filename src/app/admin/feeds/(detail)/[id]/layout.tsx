import { fetchFeedById } from "@/domains/feeds/actions";
import { PageContainer } from "@/components/shared/PageContainer";
import { redirect } from "next/navigation";
import React from "react";
import { FeedActionButton } from "@/components/admin/feeds/FeedActionButton";
import { FeedDetailTabs } from "@/components/admin/feeds/FeedDetailTabs";
import { FeedsActionMenu } from "@/components/admin/feeds/FeedsActionMenu";

export default async function FeedDetailsLayout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await props.params;
  const { children } = props;

  const feed = await fetchFeedById(id);

  if (!feed) {
    redirect("/admin/feeds");
  }

  return (
    <>
      <PageContainer
        title={feed.title}
        history={[{ title: "Feeds", href: "/admin/feeds" }]}
        actions={
          <>
            <FeedsActionMenu feed={feed} />
            <FeedActionButton feed={feed} />
          </>
        }
      >
        <FeedDetailTabs feedId={id}>{children}</FeedDetailTabs>
      </PageContainer>
    </>
  );
}
