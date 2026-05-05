"use client";

import {
  BookOpen,
  CheckCircle2,
  Flame,
  GraduationCap,
  Layers3,
  Timer,
} from "lucide-react";

type Props = {
  totalHistory: number;
  dueCardsCount: number;
  currentStreak: number;
  totalQuizAttempts: number;
  perfectQuizzes: number;
  todayMinutes: number;
};

export default function RecentActivityStrip({
  totalHistory,
  dueCardsCount,
  currentStreak,
  totalQuizAttempts,
  perfectQuizzes,
  todayMinutes,
}: Props) {
  const items = [
    {
      label: "Materiały",
      value: totalHistory,
      helper: "zapisane analizy",
      icon: <Layers3 className="h-4 w-4" />,
    },
    {
      label: "Do powtórki",
      value: dueCardsCount,
      helper: "karty na dziś",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      label: "Seria",
      value: `${currentStreak} dni`,
      helper: "ciągłość nauki",
      icon: <Flame className="h-4 w-4" />,
    },
    {
      label: "Quizy",
      value: totalQuizAttempts,
      helper: "wszystkie podejścia",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      label: "Perfekcyjne",
      value: perfectQuizzes,
      helper: "maksymalny wynik",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
      label: "Dzisiaj",
      value: `${todayMinutes} min`,
      helper: "czas nauki dziś",
      icon: <Timer className="h-4 w-4" />,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {item.label}
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {item.icon}
            </div>
          </div>

          <p className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">
            {item.value}
          </p>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {item.helper}
          </p>
        </div>
      ))}
    </section>
  );
}