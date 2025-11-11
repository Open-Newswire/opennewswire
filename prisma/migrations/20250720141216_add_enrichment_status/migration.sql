-- CreateEnum
CREATE TYPE "EnrichmentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "AnalyticsEvent" ADD COLUMN     "enrichmentError" TEXT,
ADD COLUMN     "enrichmentStatus" "EnrichmentStatus" NOT NULL DEFAULT 'PENDING';
