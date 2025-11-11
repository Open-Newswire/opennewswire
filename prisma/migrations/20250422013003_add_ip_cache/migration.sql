-- CreateTable
CREATE TABLE "IpAddressCache" (
    "ipAddress" TEXT NOT NULL,
    "countryCode" TEXT,
    "regionCode" TEXT,
    "city" TEXT,

    CONSTRAINT "IpAddressCache_pkey" PRIMARY KEY ("ipAddress")
);
