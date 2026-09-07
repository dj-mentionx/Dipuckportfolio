import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
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
  title: "Dipuck Jones — declassified",
  description:
    "A case file of what AI models currently say about Dipuck Jones, and a free AI visibility card for your own name.",
  openGraph: {
    title: "Dipuck Jones — declassified",
    description: "Drag to declassify the file the models already keep.",
    type: "website",
    url: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body className="bg-paper font-serif text-ink antialiased">{children}</body>
    </html>
  );
}
