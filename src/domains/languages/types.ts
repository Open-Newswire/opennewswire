import { Prisma, Language as PrismaLanguage } from "@/lib/prisma-client";

export type Language = PrismaLanguage;

export type OrderedLanguage = Prisma.LanguageGetPayload<{
  select: { id: true; order: true };
}>;
