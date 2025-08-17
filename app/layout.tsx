import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { QueryProvider } from "@/components/providers/query-provider"
import { ThemeProvider } from "@/components/theme/theme-provider"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "FleetPro - Professional Fleet Management",
  description:
    "Enterprise-grade modular application for comprehensive fleet, fuel, and vehicle management with advanced analytics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`dark ${montserrat.variable} ${inter.variable}`}>
        <head>
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
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
