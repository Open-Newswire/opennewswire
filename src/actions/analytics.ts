"use server";

import { requireAuth } from "@/actions/auth-wrapper";
import { getEventDetailsById } from "@/services/analytics";

export const getEventDetails = requireAuth(async function getEventDetails(
  id: string,
) {
  return getEventDetailsById(id);
});
