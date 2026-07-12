import prisma from "@/lib/prisma";
import { EnrichmentStatus } from "@/lib/prisma-client";
import { Task } from "graphile-worker";
import { StatusCodes } from "http-status-codes";

interface LocationFields {
  countryCode: string;
  regionCode: string;
  city: string;
}

interface BatchResponseItem {
  status: "success" | "fail";
  query: string;
  countryCode?: string;
  region?: string;
  city?: string;
}

const EVENT_LIMIT = 5000;
const BATCH_SIZE = 100;
const FETCH_TIMEOUT_MS = 5000;

export const enrichEventsTask: Task = async (_payload, _helpers) => {
  try {
    const { events, hasMore } = await getUnenrichedEvents();
    console.info(`Found ${events.length} unenriched events`);

    if (events.length === 0) return;

    const uniqueIps = [
      ...new Set(
        events.map((e) => e.ipAddress).filter((ip): ip is string => !!ip),
      ),
    ];

    const locationByIp = new Map<string, LocationFields>();
    let rateLimited = false;

    if (uniqueIps.length > 0) {
      const cached = await prisma.ipAddressCache.findMany({
        where: { ipAddress: { in: uniqueIps } },
      });
      for (const c of cached) {
        if (c.countryCode && c.regionCode && c.city) {
          locationByIp.set(c.ipAddress, {
            countryCode: c.countryCode,
            regionCode: c.regionCode,
            city: c.city,
          });
        }
      }

      const uncached = uniqueIps.filter((ip) => !locationByIp.has(ip));
      const newCacheEntries: {
        ipAddress: string;
        countryCode: string;
        regionCode: string;
        city: string;
      }[] = [];

      for (let i = 0; i < uncached.length; i += BATCH_SIZE) {
        const chunk = uncached.slice(i, i + BATCH_SIZE);
        const result = await batchLookup(chunk);
        if (result.tryLater) {
          rateLimited = true;
          break;
        }
        for (const item of result.results) {
          if (
            item.status === "success" &&
            item.countryCode &&
            item.region &&
            item.city
          ) {
            const loc = {
              countryCode: item.countryCode,
              regionCode: item.region,
              city: item.city,
            };
            locationByIp.set(item.query, loc);
            newCacheEntries.push({ ipAddress: item.query, ...loc });
          }
        }
      }

      if (newCacheEntries.length > 0) {
        await prisma.ipAddressCache.createMany({
          data: newCacheEntries,
          skipDuplicates: true,
        });
      }
    }

    await applyEnrichment(events, locationByIp);

    if (rateLimited) {
      console.log(
        "IP address rate limit reached during run; partial enrichment applied",
      );
    }
    if (hasMore) {
      console.log("More events to enrich, will continue on next cron run");
    }
  } catch (error) {
    console.error("Failed to enrich events", error);
  }
};

async function getUnenrichedEvents() {
  const result = await prisma.analyticsEvent.findMany({
    where: { isEnriched: false },
    orderBy: { occuredAt: "asc" },
    take: EVENT_LIMIT + 1,
  });
  if (result.length > EVENT_LIMIT) {
    result.pop();
    return { events: result, hasMore: true };
  }
  return { events: result, hasMore: false };
}

async function batchLookup(
  ips: string[],
): Promise<{ tryLater: boolean; results: BatchResponseItem[] }> {
  try {
    const response = await fetch(
      "http://ip-api.com/batch?fields=status,query,countryCode,region,city",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ips),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      },
    );
    if (response.status === StatusCodes.TOO_MANY_REQUESTS) {
      return { tryLater: true, results: [] };
    }
    const results = (await response.json()) as BatchResponseItem[];
    return { tryLater: false, results };
  } catch (err) {
    console.error("ip-api batch lookup failed", err);
    return { tryLater: false, results: [] };
  }
}

// Events with an IP we could not resolve are left unenriched so they retry next run.
// Events with no IP, or with a resolved IP, are marked enriched in this pass.
async function applyEnrichment(
  events: Array<{ id: string; ipAddress: string | null }>,
  locationByIp: Map<string, LocationFields>,
) {
  const groups = new Map<
    string,
    { ids: string[]; location: LocationFields | null }
  >();

  for (const event of events) {
    const loc = event.ipAddress ? locationByIp.get(event.ipAddress) : undefined;
    if (event.ipAddress && !loc) continue;
    const key = loc
      ? `${loc.countryCode}|${loc.regionCode}|${loc.city}`
      : "__none__";
    const existing = groups.get(key);
    if (existing) {
      existing.ids.push(event.id);
    } else {
      groups.set(key, { ids: [event.id], location: loc ?? null });
    }
  }

  for (const { ids, location } of groups.values()) {
    await prisma.analyticsEvent.updateMany({
      where: { id: { in: ids } },
      data: {
        isEnriched: true,
        enrichmentStatus: EnrichmentStatus.COMPLETED,
        ...(location
          ? {
              countryCode: location.countryCode,
              regionCode: location.regionCode,
              city: location.city,
            }
          : {}),
      },
    });
  }
}
