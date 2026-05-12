"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import DashboardSidebar from "./_components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="mx-auto w-full max-w-[1680px] px-4 py-4 md:px-6 md:py-6 xl:px-8">
        <div className="mb-4 flex items-center justify-between rounded-[26px] border border-white/10 bg-white/[0.04] px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl xl:hidden">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300">
              NoteFlow AI
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              Study workspace
            </p>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            Pro
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="hidden xl:block xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)] xl:overflow-y-auto">
            <DashboardSidebar />
          </div>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}