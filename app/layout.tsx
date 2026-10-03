import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://elite-battlegrounds-series.vercel.app"),
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
  authors: [{ name: "Elite Battlegrounds" }],
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
    url: "https://elite-battlegrounds-series.vercel.app",
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
  /*
   * iOS Safari has a well-known quirk: maximumScale <= 1 (or
   * userScalable: false) doesn't just block the browser's own native
   * pinch-zoom - it also stops iOS from reliably delivering the second
   * touch point to the page's JS at all, which breaks any custom
   * pinch-to-zoom implementation on the page (like the mobile playoff
   * bracket's MobileBracketScaler), even though it works fine on
   * Android. Allowing scale here, combined with that component's own
   * `touch-action: none`, lets iOS route two-finger input to it
   * correctly while still preventing a lone pinch from zooming that
   * specific element's surroundings.
   *
   * Trade-off: the rest of the site becomes pinch-zoomable on iOS too,
   * since touch-action: none is only set on the bracket itself, not
   * globally. That's the accepted cost of fixing the bracket - and
   * it's also generally better for accessibility (users who need to
   * zoom text) than fighting it site-wide.
   */
  maximumScale: 5,
  userScalable: true,
  themeColor: "#FAFAF8",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body
        className="
          min-h-screen
          bg-[#FAFAF8]
          text-slate-900
          antialiased
        "
      >
        {children}
      </body>
    </html>
  );
}