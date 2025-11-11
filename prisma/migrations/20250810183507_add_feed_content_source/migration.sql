-- CreateEnum
CREATE TYPE "ContentSource" AS ENUM ('AUTOMATIC', 'CONTENT', 'CONTENT_SNIPPET', 'SUMMARY');

-- AlterTable
ALTER TABLE "Feed" ADD COLUMN     "contentSource" "ContentSource" NOT NULL DEFAULT 'AUTOMATIC';
