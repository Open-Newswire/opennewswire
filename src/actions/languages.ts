"use server";

import { requireAuth } from "@/actions/auth-wrapper";
import {
  LanguageQuery,
  SaveLanguageParams,
  SaveLanguageSchema,
} from "@/schemas/languages";
import * as LanguageService from "@/services/languages";
import { OrderedLanguage } from "@/types/languages";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

const LANGUAGE_CACHE_TAG = "languages";

const getCachedLanguages = unstable_cache(
  async () => LanguageService.fetchAllLanguages(),
  [],
  { tags: [LANGUAGE_CACHE_TAG] },
);

export async function fetchLanguages() {
  return getCachedLanguages();
}

export const queryLanguages = requireAuth(async function queryLanguages(
  query: LanguageQuery,
) {
  return LanguageService.fetchLanguages(query);
});

export const saveNewLanguage = requireAuth(async function saveNewLanguage(
  untrustedParams: SaveLanguageParams,
) {
  const params = parseSchemaWithDefaults(SaveLanguageSchema, untrustedParams);
  const language = await LanguageService.saveLanguage(params);

  revalidateTag(LANGUAGE_CACHE_TAG);
  revalidatePath("/admin/languages");

  return language;
});

export const updateLanguage = requireAuth(async function updateLanguage(
  id: string,
  untrustedParams: SaveLanguageParams,
) {
  const params = parseSchemaWithDefaults(SaveLanguageSchema, untrustedParams);
  const license = await LanguageService.updateLanguage(id, params);

  revalidateTag(LANGUAGE_CACHE_TAG);
  revalidatePath(`/admin/languages/${id}`);

  return license;
});

export const deleteLanguage = requireAuth(async function deleteLanguage(
  id: string,
) {
  await LanguageService.deleteLanguage(id);

  revalidateTag(LANGUAGE_CACHE_TAG);
});

export const reorderLanguages = requireAuth(async function reorderLanguages(
  orderedLanguages: OrderedLanguage[],
) {
  await LanguageService.reorderLanguages(orderedLanguages);

  revalidateTag(LANGUAGE_CACHE_TAG);
  revalidatePath("/admin/languages");
});
