import { fetchJob } from "@/domains/jobs/actions";
import { ChildJobDetails } from "@/components/admin/jobs/ChildJobDetails";
import { ParentJobDetails } from "@/components/admin/jobs/ParentJobDetails";
import { SearchParams } from "@/domains/shared/types";

export default async function SyncJobDetails(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const job = await fetchJob(params.id);

  if (!job) {
    return <div>Error loading job</div>;
  }

  if (job.feed) {
    return <ChildJobDetails job={job} />;
  }

  return <ParentJobDetails job={job} searchParams={searchParams} />;
}
