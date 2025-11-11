-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('QUERY', 'INTERACTION');

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "occuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    "eventType" "AnalyticsEventType" NOT NULL,
    "browserLanguage" TEXT,
    "ipAddress" TEXT,
    "articleId" TEXT,
    "selectedLanguages" TEXT[],
    "selectedLicenses" TEXT[],
    "searchQuery" TEXT,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
