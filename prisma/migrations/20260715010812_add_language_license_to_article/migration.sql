-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "languageId" TEXT,
ADD COLUMN     "licenseId" TEXT;

-- CreateIndex
CREATE INDEX "Article_languageId_idx" ON "Article"("languageId");

-- CreateIndex
CREATE INDEX "Article_licenseId_idx" ON "Article"("licenseId");

-- CreateIndex
CREATE INDEX "Article_languageId_date_idx" ON "Article"("languageId", "date");

-- CreateIndex
CREATE INDEX "Article_licenseId_date_idx" ON "Article"("licenseId", "date");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Keep Article.languageId / Article.licenseId in sync when a Feed's values change.
-- The columns are replicated from Feed; this trigger is the source of truth for updates.
CREATE OR REPLACE FUNCTION sync_article_feed_metadata()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Article"
  SET "languageId" = NEW."languageId",
      "licenseId" = NEW."licenseId"
  WHERE "feedId" = NEW."id";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feed_metadata_sync
AFTER UPDATE OF "languageId", "licenseId" ON "Feed"
FOR EACH ROW
WHEN (
  OLD."languageId" IS DISTINCT FROM NEW."languageId"
  OR OLD."licenseId" IS DISTINCT FROM NEW."licenseId"
)
EXECUTE FUNCTION sync_article_feed_metadata();
