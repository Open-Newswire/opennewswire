import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({ subsets: ["latin"] });
export const ccsymbols = localFont({
  src: "./ccsymbols.woff2",
  variable: "--font-ccsymbols",
});
