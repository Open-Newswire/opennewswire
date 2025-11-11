import { TopSearchesChart } from "@/app/admin/analytics/(dashboard)/@topSearches/TopSearchesChart";
import { QueryAwareNavButton } from "@/app/admin/analytics/(shared)/QueryAwareNavButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TopSearchesCount } from "@/types/analytics";
import { LoadingResult } from "@/types/shared";

export async function TopSearches(props: LoadingResult<TopSearchesCount[]>) {
  if (props.isLoading) {
    return (
      <Card className="relative h-full">
        <CardHeader>
          <CardTitle>Top Searches</CardTitle>
          <CardDescription>Most frequently searched phrases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="absolute right-6 top-6">
            <QueryAwareNavButton title="View All" subpath="top-searches" />
          </div>
          <Skeleton className="w-full h-88" />
        </CardContent>
      </Card>
    );
  }

  const data = props.result.map((s) => ({
    count: Number(s.count),
    query: s.normalizedQuery,
  }));

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Top Searches</CardTitle>
        <CardDescription>Most frequently searched phrases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="absolute right-6 top-6">
          <QueryAwareNavButton title="View All" subpath="top-searches" />
        </div>
        <TopSearchesChart data={data} />
      </CardContent>
    </Card>
  );
}
