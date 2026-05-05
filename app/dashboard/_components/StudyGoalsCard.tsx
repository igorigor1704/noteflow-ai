"use client";

import type { StudyPreferences } from "../_lib/preferences";

type Props = {
  preferences: StudyPreferences;
  todayMinutes: number;
  currentStreak: number;
  onUpdate: (next: StudyPreferences) => void;
};

const sessionOptions = [15, 25, 45, 60];
const goalOptions = [
  { value: "regular", label: "Regular" },
  { value: "exam", label: "Exam" },
  { value: "fast-review", label: "Fast review" },
  { value: "deep-work", label: "Deep work" },
];
const styleOptions = [
  { value: "mixed", label: "Mixed" },
  { value: "flashcards", label: "Flashcards" },
  { value: "quiz", label: "Quiz" },
  { value: "reading", label: "Reading" },
];

export default function StudyGoalsCard({
  preferences,
  todayMinutes,
  currentStreak,
  onUpdate,
}: Props) {
  const dailyGoal = preferences.dailyGoalMinutes ?? 60;
  const weeklyTarget = preferences.weeklyTargetSessions ?? 5;
  const learningGoal = preferences.learningGoal ?? "regular";
  const learningStyle = preferences.learningStyle ?? "mixed";
  const preferredSessionLength = preferences.preferredSessionLength ?? 25;

  const progress = Math.min(100, Math.round((todayMinutes / Math.max(dailyGoal, 1)) * 100));

  const patchPreferences = (patch: Partial<StudyPreferences>) => {
    onUpdate({
      ...preferences,
      ...patch,
    });
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Study goals
        </p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
          Cele i rytm nauki
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Prosty panel ustawień. Tylko rzeczy, które naprawdę wpływają na codzienny workflow.
        </p>
      </div>

      <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Dzisiejszy progres
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-slate-100">
              {todayMinutes} / {dailyGoal} min
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Streak: {currentStreak} dni · tygodniowy target: {weeklyTarget} sesji
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            {progress}% celu
          </div>
        </div>

        <div className="mt-4 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-2.5 rounded-full bg-slate-950 transition-all dark:bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Dzienny cel
          </label>
          <input
            type="number"
            min={5}
            step={5}
            value={dailyGoal}
            onChange={(e) =>
              patchPreferences({
                dailyGoalMinutes: Number.isFinite(Number(e.target.value))
                  ? Number(e.target.value)
                  : dailyGoal,
              })
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Tygodniowy target
          </label>
          <input
            type="number"
            min={1}
            max={14}
            value={weeklyTarget}
            onChange={(e) =>
              patchPreferences({
                weeklyTargetSessions: Number.isFinite(Number(e.target.value))
                  ? Number(e.target.value)
                  : weeklyTarget,
              })
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Tryb nauki
          </label>
          <select
            value={learningGoal}
            onChange={(e) =>
              patchPreferences({
                learningGoal: e.target.value as StudyPreferences["learningGoal"],
              })
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {goalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Styl nauki
          </label>
          <select
            value={learningStyle}
            onChange={(e) =>
              patchPreferences({
                learningStyle: e.target.value as StudyPreferences["learningStyle"],
              })
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {styleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Preferowana długość sesji
        </label>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sessionOptions.map((value) => {
            const active = preferredSessionLength === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  patchPreferences({
                    preferredSessionLength: value as StudyPreferences["preferredSessionLength"],
                  })
                }
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {value} min
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}