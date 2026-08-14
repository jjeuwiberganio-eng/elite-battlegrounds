import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Elite Battlegrounds Admin",
    template: "%s | Elite Battlegrounds Admin",
  },
  description:
    "Elite Battlegrounds Series administration dashboard.",
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      {children}
    </div>
  );
}