"use client";

type ProgressChartsProps = {
  activity?: Record<string, number>;
  xp: number;
  streak: number;
  totalAnalyses: number;
  totalCorrectAnswers: number;
};

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getLast7Days() {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    const key = formatLocalDate(date);
    const label = new Intl.DateTimeFormat("pl-PL", {
      weekday: "short",
    }).format(date);

    return { key, label };
  });
}

export default function ProgressCharts({
  activity = {},
  xp,
  streak,
  totalAnalyses,
  totalCorrectAnswers,
}: ProgressChartsProps) {
  const safeActivity =
    activity && typeof activity === "object" ? activity : {};

  const week = getLast7Days();
  const weeklyActivity = week.map((day) => safeActivity[day.key] ?? 0);
  const maxWeekly = Math.max(...weeklyActivity, 1);
  const xpIntoLevel = xp % 100;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Statystyki postępu
          </p>
          <h2 className="text-2xl font-semibold">Aktywność i rozwój</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              XP
            </p>
            <p className="mt-2 text-2xl font-bold">{xp}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Streak
            </p>
            <p className="mt-2 text-2xl font-bold">{streak}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Analizy
            </p>
            <p className="mt-2 text-2xl font-bold">{totalAnalyses}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Dobre odp.
            </p>
            <p className="mt-2 text-2xl font-bold">{totalCorrectAnswers}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ostatnie 7 dni
              </p>
              <h3 className="text-lg font-semibold">Wykres aktywności</h3>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              max: {maxWeekly}
            </span>
          </div>

          <div className="flex h-64 items-end gap-3">
            {week.map((day, index) => {
              const value = weeklyActivity[index];
              const height = `${Math.max(8, (value / maxWeekly) * 100)}%`;

              return (
                <div
                  key={day.key}
                  className="flex flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {value}
                  </span>

                  <div className="flex h-full w-full items-end">
                    <div
                      className="w-full rounded-t-2xl bg-slate-900 transition-all dark:bg-white"
                      style={{ height }}
                      title={`${day.key}: ${value}`}
                    />
                  </div>

                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Postęp poziomu
                </p>
                <h3 className="text-lg font-semibold">XP do kolejnego levelu</h3>
              </div>
              <span className="text-sm font-medium">{xpIntoLevel}/100</span>
            </div>

            <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-3 rounded-full bg-slate-950 transition-all dark:bg-white"
                style={{ width: `${xpIntoLevel}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Podsumowanie
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Łączna aktywność w tygodniu
                </span>
                <span className="font-semibold">
                  {weeklyActivity.reduce((sum, value) => sum + value, 0)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Średnia dzienna aktywność
                </span>
                <span className="font-semibold">
                  {(
                    weeklyActivity.reduce((sum, value) => sum + value, 0) / 7
                  ).toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Skuteczność quizów
                </span>
                <span className="font-semibold">{totalCorrectAnswers}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Obecny streak
                </span>
                <span className="font-semibold">{streak}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}