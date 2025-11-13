import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🔥 SEO + OpenGraph + bättre metadata
export const metadata = {
  title: "BuildWise – Bygg din perfekta dator med AI",
  description:
    "Bygg eller uppgradera din dator med AI-assistans. Få rekommendationer på grafikkort, processorer och komponenter – enkelt och gratis.",
  keywords: [
    "bygga dator",
    "bygga pc",
    "gaming dator",
    "grafikkort",
    "processor",
    "AI pc builder",
    "dator guide",
    "pc byggare sverige"
  ],
  openGraph: {
    title: "BuildWise – Sveriges smartaste PC-byggare",
    description:
      "Bygg eller uppgradera din dator med hjälp av AI. Enkelt, snabbt och gratis.",
    url: "https://buildwise.se",
    siteName: "BuildWise",
    images: [
      {
        url: "https://buildwise.se/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BuildWise – AI PC Builder",
      },
    ],
    locale: "sv_SE",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
