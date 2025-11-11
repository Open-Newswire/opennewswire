// import { EventMap } from "@/app/admin/analytics/@locations/EventMap";
// import { AnalyticsFilterBar } from "@/app/admin/analytics/(shared)/AnalyticsFilterBar";
// import { SessionDuration } from "@/app/admin/analytics/@sessionDuration/SessionDuration";
// import { TopArticles } from "@/app/admin/analytics/@topArticles/TopArticles";
// import { TopSearches } from "@/app/admin/analytics/@topSearches/TopSearches";
// import { TotalEvents } from "@/app/admin/analytics/@totalEvents/TotalEvents";
// import { UniqueSessions } from "@/app/admin/analytics/@uniqueSessions/UniqueSessions";
// import { PageHeader } from "@/components/PageHeader";
import { loadAnalyticsQueryParams } from "@/schemas/analytics";
import { SearchParams } from "@/types/shared";
// import { Suspense } from "react";

export default async function Feeds(props: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await loadAnalyticsQueryParams(props.searchParams);

  return (
    <div>
      {/* <PageHeader title="Analytics"></PageHeader>
      <AnalyticsFilterBar />

      <div className="grid grid-cols-2 gap-4 auto-rows-max">
        <div className="grid grid-cols-3 gap-4 col-span-2">
          <div className="col-span-1">
            <Suspense fallback={<div>Loading</div>}>
              <TotalEvents query={query} />
            </Suspense>
          </div>
          <div className="col-span-1">
            <Suspense fallback={<div>Loading</div>}>
              <SessionDuration query={query} />
            </Suspense>
          </div>
          <div className="col-span-1">
            <Suspense fallback={<div>Loading</div>}>
              <UniqueSessions query={query} />
            </Suspense>
          </div>
        </div>
        <div className="col-span-1">
          <Suspense fallback={<div>Loading</div>}>
            <TopSearches query={query} />
          </Suspense>
        </div>
        <div className="col-span-1">
          <Suspense fallback={<div>Loading</div>}>
            <EventMap query={query} />
          </Suspense>
        </div>
        <div className="col-span-2">
          <Suspense fallback={<div>Loading</div>}>
            <TopArticles query={query} />
          </Suspense>
        </div>
      </div> */}
    </div>
  );
}
