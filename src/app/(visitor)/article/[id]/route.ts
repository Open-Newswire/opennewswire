import prisma from "@/lib/prisma";
import { recordArticleInteraction } from "@/services/analytics";
import { ANALYTICS_COOKIE_NAME } from "@/types/analytics";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: {
      id,
    },
  });

  if (!article) {
    return new NextResponse(null, { status: 404 });
  }

  const cookieStore = await cookies();
  const sessionid = cookieStore.get(ANALYTICS_COOKIE_NAME)?.value;

  // Don't track requests without a tracking cookie
  // If the request originates from the feed reader, a tracking cookie should
  // always be set first.
  if (!sessionid) {
    return redirect(article.link);
  }

  const headersList = await headers();
  const referer = headersList.get("referer");

  if (!referer) {
    return redirect(article.link);
  }

  const refererUrl = new URL(referer);
  const searchParams = refererUrl.searchParams;

  await recordArticleInteraction(id, sessionid, request, searchParams);

  redirect(article.link);
}
