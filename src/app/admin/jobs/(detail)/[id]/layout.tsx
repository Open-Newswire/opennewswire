import { fetchJob } from "@/domains/jobs/actions";
import { PageContainer } from "@/components/shared/PageContainer";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function JobDetailLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await fetchJob(id);

  if (!job) {
    return redirect("/admin/jobs");
  }

  return (
    <PageContainer
      title={`Job run on ${format(job.triggeredAt, "PP p")}`}
      history={[{ title: "Sync Jobs", href: "/admin/jobs" }]}
    >
      {children}
    </PageContainer>
  );
}
