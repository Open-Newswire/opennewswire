"use server";

import prisma from "@/lib/prisma";
import { LanguageQuery, SaveLanguageParams } from "@/schemas/languages";
import {
  buildOrderBy,
  buildWhere,
} from "@/services/query-converters/language-query-converter";
import { OrderedLanguage } from "@/types/languages";

export async function fetchLanguages(query: LanguageQuery) {
  return prisma.language
    .paginate({
      orderBy: buildOrderBy(query),
      where: { ...buildWhere(query) },
    })
    .withPages({
      page: query.page,
      limit: query.size,
      includePageCount: true,
    });
}

export async function fetchAllLanguages() {
  return prisma.language.findMany({
    orderBy: {
      order: "asc",
    },
  });
}

export async function saveLanguage(data: SaveLanguageParams) {
  return prisma.language.create({
    data,
  });
}

export async function updateLanguage(id: string, data: SaveLanguageParams) {
  return prisma.language.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteLanguage(id: string) {
  return prisma.language.delete({ where: { id } });
}

export async function reorderLanguages(languages: OrderedLanguage[]) {
  const queries = languages.map(({ id, order }) => {
    return prisma.language.update({
      where: { id },
      data: {
        order,
      },
    });
  });

  await prisma.$transaction(queries);
}
