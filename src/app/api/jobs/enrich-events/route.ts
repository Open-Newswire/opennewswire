import prisma from "@/lib/prisma";
import { qstashClient } from "@/lib/qstash";
import { EnrichmentStatus } from "@prisma/client";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { StatusCodes } from "http-status-codes";

interface LocationResponse {
  countryCode: string;
  region: string;
  city: string;
  status?: string;
}

interface LocationResult {
  tryLater: boolean;
  result?: LocationResponse;
  status?: string;
}

// For local development, we run QStash in a Docker container. We need to use the host machine's Docker DNS name to connect to it
const HOST =
  process.env.NODE_ENV === "development"
    ? "http://host.docker.internal:3000"
    : process.env.NEXT_PUBLIC_WEBSITE_URL;
const BASE_URL = HOST + "/api/jobs/enrich-events";
const EVENT_LIMIT = 5000;

export const maxDuration = 300; // 300 seconds

export const POST =
  process.env.NODE_ENV === "development"
    ? handler
    : verifySignatureAppRouter(handler);

async function handler() {
  try {
    const result = await getUnenrichedEvents();

    console.info(`Found ${result.events.length} unenriched events`);

    for (const event of result.events) {
      let locationResult: LocationResult | undefined;

      if (event.ipAddress) {
        locationResult = await resolveIpToLocation(event.ipAddress);

        if (locationResult.tryLater) {
          await scheduleReprocess();
          console.log("IP address rate limit reached, scheduled followup");
          return new Response("Enriched events, location rate limit exceeded");
        }

        if (
          locationResult.result?.status === "fail" ||
          locationResult.status === "fail"
        ) {
          console.log("IP address lookup failed, skipping event");
          console.log(locationResult.result);
          continue;
        }
      }

      await updateEvent(event.id, locationResult);
    }

    if (result.hasMore) {
      await scheduleReprocess();
      console.log("More events to enrich, scheduling followup");
    }

    return new Response("Enriched events");
  } catch (err) {
    console.error(err);

    return new Response(`Error enriching events: ${err}`, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

async function getUnenrichedEvents() {
  const result = await prisma.analyticsEvent.findMany({
    where: {
      isEnriched: false,
    },
    orderBy: {
      occuredAt: "asc",
    },
    take: EVENT_LIMIT + 1,
  });

  if (result.length >= EVENT_LIMIT) {
    result.splice(EVENT_LIMIT, 1);

    return {
      events: result,
      hasMore: true,
    };
  } else {
    return {
      events: result,
      hasMore: false,
    };
  }
}

async function resolveIpToLocation(ipAddress: string) {
  const cachedResult = await getLocationFromCache(ipAddress);

  if (cachedResult) {
    return {
      result: {
        countryCode: cachedResult.countryCode!,
        region: cachedResult.regionCode!,
        city: cachedResult.city!,
      },
      tryLater: false,
    };
  }

  const response = await fetch(`http://ip-api.com/json/${ipAddress}`);

  if (response.status === StatusCodes.TOO_MANY_REQUESTS) {
    return {
      tryLater: true,
    };
  }

  const result = (await response.json()) as LocationResponse;

  if (result.city && result.countryCode) {
    await writeToIpCache(ipAddress, result);

    return {
      tryLater: false,
      result,
    };
  } else {
    console.log("Result did not contain all required fields: ", result);
    return {
      tryLater: false,
      status: "fail",
    };
  }
}

async function updateEvent(
  eventId: string,
  location: LocationResult | undefined,
) {
  const data = {
    isEnriched: true,
    enrichmentStatus: EnrichmentStatus.COMPLETED,
    ...(location?.result
      ? {
          countryCode: location.result.countryCode,
          regionCode: location.result.region,
          city: location.result?.city,
        }
      : {}),
  };
  await prisma.analyticsEvent.update({
    where: {
      id: eventId,
    },
    data,
  });
}

async function scheduleReprocess() {
  await qstashClient.publishJSON({
    url: BASE_URL,
    delay: "1m",
  });
}

async function getLocationFromCache(ipAddress: string) {
  return await prisma.ipAddressCache.findFirst({
    where: {
      ipAddress,
    },
  });
}

async function writeToIpCache(ipAddress: string, location: LocationResponse) {
  await prisma.ipAddressCache.create({
    data: {
      ipAddress,
      countryCode: location.countryCode,
      regionCode: location.region,
      city: location.city,
    },
  });
}
