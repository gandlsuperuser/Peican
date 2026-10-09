import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRMPT (R) — FRESH FOOD ARCHIVE | Daily Handcrafted Drops",
  description:
    "Daily small-batch artisanal culinary drops crafted at dawn and delivered fresh. Signature gelato bowls, flaky taro pastries, Sichuan prime spiced beef, midnight grass jelly, and hand-cut tri-tone liangpi.",
  openGraph: {
    title: "PRMPT (R) — FRESH FOOD ARCHIVE",
    description: "Daily small-batch artisanal culinary drops crafted at dawn and delivered fresh.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter-tight)]">
        {children}
      </body>
    </html>
  );
}
