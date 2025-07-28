import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WiFi Finder - Find Free WiFi Near You",
  description:
    "Find open venues with free Wi-Fi near your location. Discover cafes, libraries, and coworking spaces that are currently open.",
  keywords: "wifi, free wifi, cafes, libraries, coworking, open now, near me",
  authors: [{ name: "WiFi Finder" }],
  creator: "WiFi Finder",
  publisher: "WiFi Finder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WiFi Finder",
  },
  openGraph: {
    type: "website",
    siteName: "WiFi Finder",
    title: "WiFi Finder - Find Free WiFi Near You",
    description: "Find open venues with free Wi-Fi near your location",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200",
        width: 1200,
        height: 630,
        alt: "WiFi Finder App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WiFi Finder - Find Free WiFi Near You",
    description: "Find open venues with free Wi-Fi near your location",
    images: ["/placeholder.svg?height=630&width=1200"],
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/placeholder.svg?height=32&width=32" />
        <link rel="apple-touch-icon" href="/placeholder.svg?height=180&width=180" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
