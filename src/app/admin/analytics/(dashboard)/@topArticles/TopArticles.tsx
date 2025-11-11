import { QueryAwareNavButton } from "@/app/admin/analytics/(shared)/QueryAwareNavButton";
import { TopArticlesTable } from "@/components/analytics/top-articles/TopArticlesTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TopArticleCount } from "@/types/analytics";
import { LoadingResult } from "@/types/shared";

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
          <TopArticlesTable data={props.result} />
        )}
      </CardContent>
    </Card>
  );
}
