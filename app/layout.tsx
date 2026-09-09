import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Syne } from "next/font/google";
import "./globals.css";
import { PERSON, POSITIONING, SITE_URL } from "@/lib/archive";

const sans = Syne({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["500", "700", "800"],
});

const display = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: "400",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dipuck Jones — THE LOT",
    template: "%s — Dipuck Jones",
  },
  description: "A darkroom rack of prints you can rotate. 13 years of B2B SaaS growth, MentionX, Berlin.",
  openGraph: {
    title: "Dipuck Jones — THE LOT",
    description: POSITIONING.argument,
    url: SITE_URL,
    siteName: PERSON.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dipuck Jones — THE LOT",
    description: POSITIONING.argument,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
