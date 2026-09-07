import type { Metadata } from "next";
import { IBM_Plex_Mono, Syne } from "next/font/google";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dipuckjones.com"),
  title: "Dipuck Jones — Unprompted",
  description: "Ask the field what the models say. Then ask about yourself.",
  openGraph: {
    title: "Dipuck Jones — Unprompted",
    description: "A live field of unasked questions.",
    type: "website",
    url: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="bg-void font-display text-white antialiased">{children}</body>
    </html>
  );
}
