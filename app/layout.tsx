import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import type React from "react";
import { Toaster } from "sonner";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "FleetPro - Personal AI App Platform",
    template: "%s | FleetPro",
  },
  description:
    "Personal AI-powered app platform with modular tools for vehicle management, fuel tracking, and admin controls. Built for individuals managing personal fleet data.",
  keywords: [
    "personal AI platform",
    "vehicle management app",
    "fuel tracking",
    "bike maintenance",
    "car management",
    "personal fleet tracker",
    "modular app platform",
    "AI dashboard",
    "vehicle analytics",
    "fuel efficiency tracker",
  ],
  authors: [{ name: "FleetPro" }],
  creator: "FleetPro",
  publisher: "FleetPro",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://personal-ai-apps.vercel.app",
    title: "FleetPro - Personal AI App Platform",
    description:
      "Manage your vehicles, track fuel, and analyze performance with AI-powered modular apps",
    siteName: "FleetPro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FleetPro Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FleetPro - Personal AI App Platform",
    description:
      "AI-powered modular platform for personal vehicle and fuel management",
    images: ["/twitter-image.jpg"],
    creator: "@fleetpro",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      { url: "/apple-touch-icon-precomposed.png", sizes: "180x180" },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://personal-ai-apps.vercel.app"),
  alternates: {
    canonical: "/",
  },
  category: "productivity",
  classification: "Personal Management Software",
  other: {
    "application-name": "FleetPro",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "FleetPro",
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`dark ${montserrat.variable} ${inter.variable}`}
      >
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover"
          />
          <meta name="format-detection" content="telephone=no" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <style>{`
              html {
                font-family: ${inter.style.fontFamily};
                --font-sans: ${inter.style.fontFamily};
                --font-heading: ${montserrat.style.fontFamily};
              }
          `}</style>
        </head>
        <body className="font-sans antialiased">
          <ThemeProvider defaultTheme="dark" defaultThemeId="default">
            <QueryProvider>{children}</QueryProvider>
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
