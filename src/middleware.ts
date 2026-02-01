import { recordQuery } from "@/domains/analytics/service";
import { ANALYTICS_COOKIE_NAME } from "@/domains/analytics/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * Captures analytics data from the request and sets a cookie to anonymously track the user.
 *
 * Leverages Next.js's middleware convention. See https://nextjs.org/docs/app/building-your-application/routing/middleware for more.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.method !== "GET") {
    return response;
  }

  const trackingId =
    request.cookies.get(ANALYTICS_COOKIE_NAME)?.value ?? crypto.randomUUID();

  // Record an event
  await recordQuery(trackingId, request);

  // Ensure the cookie is set
  response.cookies.set(ANALYTICS_COOKIE_NAME, trackingId, {
    secure: true,
    httpOnly: true,
    path: "/",
  });

  return response;
}

export const config = {
  matcher: "/", // Only match the feed reader, which is served from the app's root path
  runtime: "nodejs",
};
