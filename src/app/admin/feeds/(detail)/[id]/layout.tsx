import { fetchFeedById } from "@/actions/feeds";
import { PageContainer } from "@/components/shared/PageContainer";
import { redirect } from "next/navigation";
import React from "react";
import { FeedActionButton } from "./FeedActionButton";
import { FeedDetailTabs } from "./FeedDetailTabs";
import { FeedsActionMenu } from "./FeedsActionMenu";

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
