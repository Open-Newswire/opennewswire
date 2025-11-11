-- AlterTable
ALTER TABLE "Feed" ADD COLUMN     "etag" TEXT,
ADD COLUMN     "lastModifiedHeader" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
