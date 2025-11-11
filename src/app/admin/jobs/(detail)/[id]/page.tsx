import { fetchJob } from "@/actions/jobs";
import { ChildJobDetails } from "@/app/admin/jobs/(detail)/[id]/ChildJobDetails";
import { ParentJobDetails } from "@/app/admin/jobs/(detail)/[id]/ParentJobDetails";
import { SearchParams } from "@/types/shared";

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
