import { inter } from "@/app/fonts";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import type { Metadata } from "next";
import "./globals.css";
import "./mantine-core.css"; // Custom "@mantine/core/styles.css" to make Mantine and Shadcn play nicr

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${inter.className} notranslate`}>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
