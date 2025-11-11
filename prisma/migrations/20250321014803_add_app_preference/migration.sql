-- CreateTable
CREATE TABLE "AppPreference" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "AppPreference_pkey" PRIMARY KEY ("key")
);
