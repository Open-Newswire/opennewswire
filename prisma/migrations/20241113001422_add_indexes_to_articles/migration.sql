-- CreateIndex
CREATE INDEX "Article_date_isHidden_idx" ON "Article"("date", "isHidden");

-- CreateIndex
CREATE INDEX "Article_isHidden_idx" ON "Article"("isHidden");

-- CreateIndex
CREATE INDEX "Article_guid_idx" ON "Article"("guid");
