"use client";

import Link from "next/link";
import { Crown, Library, Moon, Sparkles, Sun, Target, Timer, Trophy } from "lucide-react";
import type { ThemeMode, UserStats } from "../_lib/types";
import { usePro } from "../../lib/pro/usePro";

type Props = {
  theme: ThemeMode;
  onToggleTheme: () => void;
  stats: UserStats;
};

const statCards = (stats: UserStats) => [
  {
    label: "XP",
    value: stats.xp,
    helper: "łączny postęp",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    label: "Level",
    value: stats.level,
    helper: "poziom konta",
    icon: <Trophy className="h-4 w-4" />,
  },
  {
    label: "Streak",
    value: stats.streak,
    helper: "dni nauki",
    icon: <Target className="h-4 w-4" />,
  },
  {
    label: "Analizy",
    value: stats.totalAnalyses,
    helper: "zapisane materiały",
    icon: <Library className="h-4 w-4" />,
  },
  {
    label: "Dzisiaj",
    value: `${stats.todayMinutes} min`,
    helper: "czas nauki dziś",
    icon: <Timer className="h-4 w-4" />,
  },
];

export default function DashboardHeader({
  theme,
  onToggleTheme,
  stats,
}: Props) {
  const { isPro, hydrated } = usePro();

  return (
    <header className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-white/95 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
      <div className="border-b border-slate-200/80 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.10),transparent_24%),linear-gradient(180deg,#ffffff,rgba(248,250,252,0.98))] p-6 md:p-8 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.98))]">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                NoteFlow Workspace
              </span>

              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                Professional study system
              </span>

              {hydrated && (
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
                    isPro
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
                  }`}
                >
                  {isPro ? "Plan Pro aktywny" : "Free plan"}
                </span>
              )}
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
              Dashboard
            </p>

            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl md:leading-[1.02] dark:text-slate-100">
              Ucz się szybciej, czyściej i bez chaosu
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Analizy, fiszki, quizy, focus timer i historia materiałów w jednym
              miejscu. To Twój główny workspace do tworzenia materiałów, wracania
              do analiz i utrzymywania regularnej nauki.
            </p>
          </div>

          <div className="flex max-w-[560px] flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/library"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Library
            </Link>

            <Link
              href="/dashboard/today"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Today
            </Link>

            <Link
              href="/pricing"
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                hydrated && isPro
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                  : "bg-slate-950 text-white shadow-sm hover:opacity-90 dark:bg-white dark:text-slate-950"
              }`}
            >
              <Crown className="h-4 w-4" />
              {hydrated && isPro ? "Plan Pro aktywny" : "Upgrade to Pro"}
            </Link>

            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              {theme === "light" ? (
                <>
                  <Moon className="h-4 w-4" />
                  Dark mode
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
                  Light mode
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-5">
        {statCards(stats).map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] px-5 py-5 shadow-sm dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.88))]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                {item.label}
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {item.icon}
              </div>
            </div>

            <p className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-slate-100">
              {item.value}
            </p>

            <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              {item.helper}
            </p>
          </div>
        ))}
      </div>
    </header>
  );
}