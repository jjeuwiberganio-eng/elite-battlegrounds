import type { Metadata } from "next";
import "@/app/globals.css";

import AnnouncementBar from "@/components/layout/announcement/AnnouncementBar";
import Footer from "@/components/layout/footer/Footer";
import Navbar from "@/components/layout/navbar/Navbar";
import ScrollToTop from "@/components/layout/shared/ScrollToTop";
import LiveIndicator from "@/components/live/LiveIndicator";

export const metadata: Metadata = {
  title: {
    default: "Elite Battlegrounds Series",
    template: "%s | Elite Battlegrounds Series",
  },

  description:
    "Official Elite Battlegrounds Series tournament website featuring schedules, standings, playoffs, livestreams, highlights, and tournament updates.",

  openGraph: {
    title: "Elite Battlegrounds Series",
    description:
      "Official Elite Battlegrounds Series tournament website.",
    type: "website",
    locale: "en_PH",
    siteName: "Elite Battlegrounds Series",
  },

  twitter: {
    card: "summary_large_image",
    title: "Elite Battlegrounds Series",
    description:
      "Official Elite Battlegrounds Series tournament website.",
  },
};

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({
  children,
}: Readonly<PublicLayoutProps>) {
  return (
    <>
      {/* Announcement Banner */}
      <AnnouncementBar />

      {/* Live Tournament Indicator */}
      <LiveIndicator />

      {/* Main Navigation */}
      <Navbar />

      {/* Public Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll To Top */}
      <ScrollToTop />
    </>
  );
}