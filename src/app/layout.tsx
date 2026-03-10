import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lynq — Employer Dashboard",
  description:
    "Manage jobs, candidates, campaigns, and analytics — all in one place.",
  metadataBase: new URL("https://app.lynq.work"),
  openGraph: {
    title: "Lynq — Employer Dashboard",
    description:
      "Manage jobs, candidates, campaigns, and analytics — all in one place.",
    siteName: "Lynq",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Lynq — Employer Dashboard",
    description:
      "Manage jobs, candidates, campaigns, and analytics — all in one place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
