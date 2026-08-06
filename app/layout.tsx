import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://elitebattlegrounds.com"),

  title: {
    default: "Elite Battlegrounds Series",
    template: "%s | Elite Battlegrounds Series",
  },

  description:
    "Elite Battlegrounds Series is an independent Mobile Legends: Bang Bang community tournament featuring schedules, standings, playoffs, livestreams, highlights, and tournament updates.",

  applicationName: "Elite Battlegrounds Series",

  keywords: [
    "Elite Battlegrounds",
    "MLBB",
    "Mobile Legends",
    "Tournament",
    "Esports",
    "Community Tournament",
    "Philippines",
  ],

  authors: [
    {
      name: "Elite Battlegrounds",
    },
  ],

  creator: "Elite Battlegrounds",

  publisher: "Elite Battlegrounds",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: "Elite Battlegrounds Series",
    title: "Elite Battlegrounds Series",
    description:
      "Official website of the Elite Battlegrounds Series community tournament.",
    url: "https://elitebattlegrounds.com",
  },

  twitter: {
    card: "summary_large_image",
    title: "Elite Battlegrounds Series",
    description:
      "Official website of the Elite Battlegrounds Series community tournament.",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0F172A",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}