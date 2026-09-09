import type { Metadata } from "next";
import { IBM_Plex_Mono, Syne } from "next/font/google";
import "./globals.css";

const sans = Syne({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["500", "700", "800"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dipuckjones.com"),
  title: "Dipuck Jones — THE LOT",
  description: "Berlin after hours. Walk the career lot. 13 years of B2B SaaS growth, MentionX. Classic lockup still in the darkroom.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
