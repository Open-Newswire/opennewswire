import { queryLanguages } from "@/actions/languages";
import { LanguageQuery, LanguageQuerySchema } from "@/schemas/languages";
import { SearchParams } from "@/types/shared";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import { LanguagesTable } from "./LanguagesTable";

export default async function Languages(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const query = parseSchemaWithDefaults(
    LanguageQuerySchema,
    searchParams,
  ) as LanguageQuery;
  const [languages, meta] = await queryLanguages(query);

  return <LanguagesTable languages={languages} pagination={meta} />;
}
