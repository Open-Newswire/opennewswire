import { QueryProvider } from "@/app/(visitor)/QueryProvider";
import { Shell } from "@/app/(visitor)/Shell";
import { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Open Newswire",
  description: "Find open source news content from across the world.",
  appleWebApp: {
    statusBarStyle: "default",
  },
  other: {
    google: "notranslate",
  },
};

export default function Layout({
  sidebar,
  articles,
}: {
  articles: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <NuqsAdapter>
      <QueryProvider>
        <Shell navigation={sidebar}>{articles}</Shell>
      </QueryProvider>
    </NuqsAdapter>
  );
}
