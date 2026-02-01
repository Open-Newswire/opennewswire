"use server";

import { requireAuth } from "@/domains/auth/wrapper";
import { getEventDetailsById } from "@/domains/analytics/service";

export const getEventDetails = requireAuth(async function getEventDetails(
  id: string,
) {
  return getEventDetailsById(id);
});
