import Link from "next/link";
import { Sparkles } from "lucide-react";
import DashboardSidebar from "./_components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto w-full max-w-[1680px] px-4 py-4 md:px-6 md:py-6 xl:px-8">
        <div className="mb-4 flex items-center justify-between rounded-[26px] border border-slate-200 bg-white px-4 py-3 shadow-sm xl:hidden dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              NoteFlow AI
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-slate-100">
              Study workspace
            </p>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
          >
            <Sparkles className="h-4 w-4" />
            Pro
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)] xl:overflow-y-auto">
            <DashboardSidebar />
          </div>

          <div className="min-w-0">
            <div className="rounded-[32px] border border-white/60 bg-white/75 p-3 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-950/70">
              <div className="rounded-[28px]">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}