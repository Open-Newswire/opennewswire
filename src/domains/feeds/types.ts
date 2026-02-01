import { ContentSource, Prisma, Feed as PrismaFeed } from "@prisma/client";

export type Feed = PrismaFeed;

export type FeedsWithLicenseAndLanguage = Prisma.FeedGetPayload<{
  include: { license: true; language: true };
}>;

export interface FeedPreview {
  url: string;
  title?: string;
  description?: string;
  iconUrl?: string;
}

export enum FeedStatus {
  all = "all",
  active = "active",
  inactive = "inactive",
}

export const ContentSourceDisplayNames: Record<ContentSource, string> = {
  [ContentSource.AUTOMATIC]: "Automatic",
  [ContentSource.CONTENT]: "Content",
  [ContentSource.CONTENT_SNIPPET]: "Content Snippet",
  [ContentSource.SUMMARY]: "Summary",
};
