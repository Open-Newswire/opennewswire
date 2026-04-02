import prisma from "@/lib/prisma";
import { EnrichmentStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { Task } from "graphile-worker";

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

const EVENT_LIMIT = 5000;

export const enrichEventsTask: Task = async (_payload, _helpers) => {
  try {
    const result = await getUnenrichedEvents();

    console.info(`Found ${result.events.length} unenriched events`);

    for (const event of result.events) {
      let locationResult: LocationResult | undefined;

      if (event.ipAddress) {
        locationResult = await resolveIpToLocation(event.ipAddress);

        if (locationResult.tryLater) {
          console.log(
            "IP address rate limit reached, will retry next cron run",
          );
          return;
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
      console.log("More events to enrich, will continue on next cron run");
    }
  } catch (error) {
    console.error("Failed to enrich events", error);
  }
};

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
