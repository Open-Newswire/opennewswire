import { fetchArticles } from "@/domains/articles/actions";
import { ArticlesTable } from "@/components/admin/articles/ArticlesTable";
import { ArticleQuery, ArticleQuerySchema } from "@/domains/articles/schemas";
import { SearchParams } from "@/domains/shared/types";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";

export default async function Articles(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const query = parseSchemaWithDefaults(
    ArticleQuerySchema,
    searchParams,
  ) as ArticleQuery;
  const [articles, meta] = await fetchArticles(query);

  return <ArticlesTable articles={articles} pagination={meta} />;
}
