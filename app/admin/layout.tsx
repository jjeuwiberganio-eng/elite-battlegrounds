import type { Metadata } from "next";
import type { ReactNode } from "react";

import AuthSessionProvider from "@/components/admin/shared/AuthSessionProvider";
import AdminTopBar from "@/components/admin/shared/AdminTopBar";
import AdminToaster from "@/components/admin/shared/AdminToaster";
import { ConfirmProvider } from "@/components/admin/shared/ConfirmProvider";

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
    <AuthSessionProvider>
      <ConfirmProvider>
        <div className="min-h-screen bg-slate-950">
          <AdminTopBar />
          {children}
        </div>

        <AdminToaster />
      </ConfirmProvider>
    </AuthSessionProvider>
  );
}
