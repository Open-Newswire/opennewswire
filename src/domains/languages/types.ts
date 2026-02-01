import { Prisma, Language as PrismaLanguage } from "@prisma/client";

export type Language = PrismaLanguage;

export type OrderedLanguage = Prisma.LanguageGetPayload<{
  select: { id: true; order: true };
}>;
