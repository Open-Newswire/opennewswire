import { fetchArticlesForFeedReader } from "@/domains/articles/actions";
import {
  ArticleFeedReaderQuery,
  ArticleFeedReaderQuerySchema,
} from "@/domains/articles/schemas";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchParamsAsObject = Object.fromEntries(searchParams.entries());
  const query = parseSchemaWithDefaults(
    ArticleFeedReaderQuerySchema,
    searchParamsAsObject,
  ) as ArticleFeedReaderQuery;

  const [results, pagination] = await fetchArticlesForFeedReader(query);

  return NextResponse.json({
    results,
    pagination,
  });
}
