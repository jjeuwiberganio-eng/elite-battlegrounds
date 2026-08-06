import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/auth";

import AdminLoginForm from "@/components/admin/auth/AdminLoginForm";
import LoginInformationCard from "@/components/admin/auth/LoginInformationCard";

export const metadata: Metadata = {
  title: "Admin Login",
  description:
    "Secure login for the Elite Battlegrounds Series Super Admin Dashboard.",
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">
      <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-2">

        {/* Left Side */}
        <section className="flex flex-col justify-center">

          <span className="mb-4 inline-flex w-fit rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
            SUPER ADMIN
          </span>

          <h1 className="text-5xl font-black leading-tight text-slate-900">
            Elite Battlegrounds
            <br />
            Dashboard
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Securely manage tournaments, teams, schedules,
            standings, playoffs, livestreams, media,
            announcements and every aspect of the
            Elite Battlegrounds Series.
          </p>

          <div className="mt-10">
            <LoginInformationCard />
          </div>

        </section>

        {/* Right Side */}
        <section className="flex items-center justify-center">

          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

            <AdminLoginForm />

          </div>

        </section>

      </div>
    </main>
  );
}