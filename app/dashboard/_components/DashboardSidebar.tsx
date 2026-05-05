"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  FolderKanban,
  LayoutGrid,
  Library,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Start pracy i analiza materiału",
    icon: LayoutGrid,
  },
  {
    href: "/dashboard/today",
    label: "Today",
    description: "Plan dnia, focus i powtórki",
    icon: BookOpen,
  },
  {
    href: "/dashboard/library",
    label: "Library",
    description: "Wszystkie zapisane materiały",
    icon: Library,
  },
  {
    href: "/pricing",
    label: "Pricing",
    description: "Plan FREE i funkcje PRO",
    icon: Sparkles,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="space-y-5">
      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Zap className="h-3.5 w-3.5" />
            NoteFlow AI
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">
            Study workspace
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Czysty, prosty panel do nauki bez chaosu i bez przeładowania.
          </p>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-start gap-3 rounded-[22px] border px-4 py-4 transition ${
                    isActive
                      ? "border-slate-950 bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.2)] dark:border-white dark:bg-white dark:text-slate-950"
                      : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                  }`}
                >
                  <div
                    className={`mt-0.5 rounded-2xl p-2.5 transition ${
                      isActive
                        ? "bg-white/15 dark:bg-slate-200"
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <ArrowRight
                        className={`h-4 w-4 transition ${
                          isActive
                            ? "text-white/80 dark:text-slate-700"
                            : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                        }`}
                      />
                    </div>

                    <p
                      className={`mt-1 text-xs leading-5 ${
                        isActive
                          ? "text-white/75 dark:text-slate-700"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Workspace flow
            </p>
            <h3 className="mt-2 text-lg font-bold text-slate-950 dark:text-slate-100">
              Najlepszy układ pracy
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <FolderKanban className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Krok 1
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Dodaj materiał i zrób analizę
            </p>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Krok 2
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Wróć do Today i przerób to, co najważniejsze
            </p>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Krok 3
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Trzymaj porządek w Library i wracaj do zapisanych analiz
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.24)] dark:border-slate-700">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
          <Star className="h-3.5 w-3.5" />
          Premium
        </div>

        <h3 className="mt-4 text-2xl font-black tracking-tight">
          Zrób z tego prawdziwy study SaaS
        </h3>

        <p className="mt-3 text-sm leading-7 text-white/75">
          Oral exam mode, mocniejszy workflow i bardziej premium feeling całej
          aplikacji.
        </p>

        <Link
          href="/pricing"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
        >
          Zobacz pricing
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </aside>
  );
}