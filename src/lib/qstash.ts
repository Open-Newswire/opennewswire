import { Client } from "@upstash/qstash";

export const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!,
});

// QSTASH_OPENNEWSWIRE_URL is the url OStash can reach Open Newswire at. For local environments,
// QStash runs in a docker container, so the container's internal Docker hostname must be used to resolve
// Open Newswire running on the host machine.
export const QSTASH_OPENNEWSWIRE_URL =
  process.env.NODE_ENV === "development"
    ? "http://host.docker.internal:3000"
    : process.env.NEXT_PUBLIC_WEBSITE_URL;
