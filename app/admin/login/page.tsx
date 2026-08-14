import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/src/auth/permissions";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  description:
    "Secure login for the Elite Battlegrounds Series Super Admin Dashboard.",
};

export default async function AdminLoginPage() {
  const admin = await getCurrentUser();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12">
      <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left Side */}
        <section>
          <span className="mb-4 inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
            SUPER ADMIN
          </span>

          <h1 className="text-5xl font-black leading-tight text-white">
            Elite Battlegrounds
            <br />
            Dashboard
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Securely manage tournaments, teams, matches, standings,
            playoffs, livestreams, media, announcements and every aspect
            of the Elite Battlegrounds Series.
          </p>

          <div className="mt-8 max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-bold text-white">
              Super Admin Access
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Use your authorized administrator account to access the
              tournament management dashboard.
            </p>
          </div>
        </section>

        {/* Right Side */}
        <section className="flex justify-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Admin Login
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to manage Elite Battlegrounds.
              </p>
            </div>

            <AdminLoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}