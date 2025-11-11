import { fetchArticles } from "@/actions/articles";
import { ArticlesTable } from "@/components/articles/ArticlesTable";
import { ArticleQuery, ArticleQuerySchema } from "@/schemas/articles";
import { SearchParams } from "@/types/shared";
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
