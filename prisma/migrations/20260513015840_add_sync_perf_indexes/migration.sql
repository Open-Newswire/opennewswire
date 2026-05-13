-- CreateIndex
CREATE INDEX "AnalyticsEvent_isEnriched_occuredAt_idx" ON "public"."AnalyticsEvent"("isEnriched", "occuredAt");

-- CreateIndex
CREATE INDEX "Article_feedId_date_idx" ON "public"."Article"("feedId", "date");
