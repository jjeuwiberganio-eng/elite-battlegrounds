import type { Metadata } from "next";
import { redirect } from "next/navigation";

import DashboardShell from "@/components/admin/DashboardShell";
import AdminHeader from "@/components/admin/Header";
import AdminSidebar from "@/components/admin/Sidebar";

import { getCurrentAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Super Admin",
    template: "%s | Super Admin",
  },

  description:
    "Elite Battlegrounds Series Super Admin Dashboard.",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({
  children,
}: Readonly<AdminLayoutProps>) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <DashboardShell>

      <AdminSidebar
        admin={admin}
      />

      <div className="flex min-h-screen flex-1 flex-col bg-slate-50">

        <AdminHeader
          admin={admin}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>

      </div>

    </DashboardShell>
  );
}