-- CreateIndex
CREATE INDEX "AnalyticsEvent_occuredAt_idx" ON "AnalyticsEvent" USING BRIN ("occuredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_idx" ON "AnalyticsEvent"("sessionId");

-- CreateIndex
CREATE INDEX "Article_feedId_idx" ON "Article"("feedId");

-- CreateIndex
CREATE INDEX "SyncJob_status_idx" ON "SyncJob"("status");

-- CreateIndex
CREATE INDEX "SyncJob_trigger_idx" ON "SyncJob"("trigger");

-- CreateIndex
CREATE INDEX "SyncJob_feedId_idx" ON "SyncJob"("feedId");

-- CreateIndex
CREATE INDEX "SyncJob_triggeredAt_idx" ON "SyncJob"("triggeredAt");

-- CreateIndex
CREATE INDEX "SyncJob_parentId_idx" ON "SyncJob"("parentId");
