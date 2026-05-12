"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Brain,
  CreditCard,
  LayoutDashboard,
  Library,
  Sparkles,
  Zap,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/today",
    label: "Today",
    icon: Brain,
  },
  {
    href: "/dashboard/library",
    label: "Library",
    icon: Library,
  },
  {
    href: "/pricing",
    label: "Pricing",
    icon: CreditCard,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="space-y-5">
      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1020]/90 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <div className="border-b border-white/10 p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-200">
            <Zap className="h-3.5 w-3.5" />
            NoteFlow AI
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-white">
            Study workspace
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Nowoczesny AI dashboard do nauki, analiz PDF i fiszek.
          </p>
        </div>

        <nav className="space-y-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-[24px] px-4 py-4 transition ${
                  isActive
                    ? "bg-white text-slate-950"
                    : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                }`}
              >
                <div
                  className={`rounded-2xl p-2.5 ${
                    isActive
                      ? "bg-slate-100"
                      : "bg-white/[0.06] text-violet-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.label}</p>
                </div>
              </Link>
            );
          })}
        </nav>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-violet-400/20 bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 p-5 text-white shadow-2xl shadow-violet-950/30">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]">
          <Sparkles className="h-3.5 w-3.5" />
          Premium
        </div>

        <h3 className="mt-4 text-2xl font-black tracking-tight">
          Zamień to w prawdziwy study SaaS
        </h3>

        <p className="mt-3 text-sm leading-7 text-white/75">
          AI Tutor, quizy, analiza PDF, workflow i workspace premium.
        </p>

        <Link
          href="/pricing"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
        >
          Zobacz pricing
        </Link>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Workspace flow
            </p>

            <p className="text-sm text-slate-400">
              PDF → analiza → fiszki → quiz
            </p>
          </div>
        </div>
      </section>
    </aside>
  );
}