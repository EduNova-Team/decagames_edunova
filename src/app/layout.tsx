import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DECAgames - Interactive DECA Competition Practice",
  description:
    "Transform your DECA practice tests into interactive learning games for better competition preparation",
  keywords: [
    "DECA",
    "education",
    "practice",
    "competition",
    "learning",
    "games",
  ],
  authors: [{ name: "DECAgames Team" }],
  icons: {
    icon: "/deca_games.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${lexend.variable} antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]`}
      >
        <div className="min-h-screen flex flex-col">
          {children}
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
