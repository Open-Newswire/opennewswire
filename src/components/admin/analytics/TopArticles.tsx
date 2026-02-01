import { QueryAwareNavButton } from "@/components/admin/analytics/QueryAwareNavButton";
import { TopArticlesTable } from "@/components/admin/analytics/TopArticlesTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TopArticleCount } from "@/domains/analytics";
import { LoadingResult } from "@/domains/shared/types";

export async function TopArticles(props: LoadingResult<TopArticleCount[]>) {
  return (
    <Card className="relative h-full">
      <CardHeader>
        <CardTitle>Top Articles</CardTitle>
        <CardDescription>Most frequently opened articles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="absolute right-6 top-6">
          <QueryAwareNavButton title="View All" subpath="top-articles" />
        </div>
        {props.isLoading ? (
          <Skeleton className="w-full h-75" />
        ) : (
          <TopArticlesTable
            data={{
              results: props.result,
              pagination: { pageCount: 1, totalCount: props.result.length },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
