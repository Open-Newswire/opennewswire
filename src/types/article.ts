import { IconSource, Prisma } from "@prisma/client";

export type ArticleWithFeedLicenseAndLanguage = Prisma.ArticleGetPayload<{
  include: { feed: { include: { license: true; language: true } } };
}>;

export interface ArticleWithMetadata {
  id: string;
  title: string;
  link: string;
  content?: string | null;
  date?: Date | null;
  feed: CondensedFeed;
}

export interface CondensedFeed {
  title: string;
  iconUrl?: string | null;
  assetIconUrl?: string | null;
  iconSource: IconSource;
  licenseText?: string | null;
  licenseUrl?: string | null;
  backgroundColor: string;
  textColor: string;
  language: CondensedLanguage;
  license: CondensedLicense;
}

type CondensedLicense = Prisma.LicenseGetPayload<{
  select: {
    id: true;
    name: true;
    symbols: true;
    backgroundColor: true;
    textColor: true;
    slug: true;
  };
}>;

type CondensedLanguage = Prisma.LanguageGetPayload<{
  select: { id: true; name: true; isRtl: true; slug: true };
}>;

export enum ArticleVisibility {
  all = "all",
  hidden = "hidden",
  visible = "visible",
}
