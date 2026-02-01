import { queryLanguages } from "@/domains/languages/actions";
import { LanguageQuery, LanguageQuerySchema } from "@/domains/languages/schemas";
import { SearchParams } from "@/domains/shared/types";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import { LanguagesTable } from "@/components/admin/languages/LanguagesTable";

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
