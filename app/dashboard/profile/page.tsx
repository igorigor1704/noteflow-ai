"use client";

import Link from "next/link";
import { Settings, Sparkles, User } from "lucide-react";
import { useDashboardState } from "../_hooks/useDashboardState";
import type { StudyPreferences } from "../_lib/preferences";

const focusOptions: Array<StudyPreferences["primaryFocus"]> = [
  "studia",
  "matura",
  "języki",
  "projekty",
  "inne",
];

const learningGoalOptions: Array<StudyPreferences["learningGoal"]> = [
  "regular",
  "exam",
  "fast-review",
  "deep-work",
];

const learningStyleOptions: Array<StudyPreferences["learningStyle"]> = [
  "mixed",
  "flashcards",
  "quiz",
  "reading",
];

const sessionLengthOptions: Array<StudyPreferences["preferredSessionLength"]> = [
  15,
  25,
  45,
  60,
];

function updatePref<K extends keyof StudyPreferences>(
  preferences: StudyPreferences,
  onUpdate: (next: StudyPreferences) => void,
  key: K,
  value: StudyPreferences[K]
) {
  onUpdate({
    ...preferences,
    [key]: value,
  });
}

export default function ProfilePage() {
  const dashboard = useDashboardState();
  const preferences = dashboard.preferences;

  return (
    <main className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                Profile
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                ustawienia nauki
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100 md:text-4xl">
              Twój profil nauki
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Tu ustawiasz sposób działania aplikacji: cel dzienny, długość sesji,
              styl nauki i podstawowe preferencje.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Dashboard
            </Link>

            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
            >
              <Sparkles className="h-4 w-4" />
              Pro
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <User className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Konto
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                Podstawowe ustawienia
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Imię
              </label>
              <input
                value={preferences.displayName}
                onChange={(e) =>
                  updatePref(
                    preferences,
                    dashboard.updatePreferences,
                    "displayName",
                    e.target.value
                  )
                }
                placeholder="Np. Maja"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Główny focus
              </label>
              <select
                value={preferences.primaryFocus}
                onChange={(e) =>
                  updatePref(
                    preferences,
                    dashboard.updatePreferences,
                    "primaryFocus",
                    e.target.value as StudyPreferences["primaryFocus"]
                  )
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {focusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Cel dzienny (min)
              </label>
              <input
                type="number"
                min={5}
                max={600}
                value={preferences.dailyGoalMinutes}
                onChange={(e) =>
                  updatePref(
                    preferences,
                    dashboard.updatePreferences,
                    "dailyGoalMinutes",
                    Number(e.target.value) || 30
                  )
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Sesje tygodniowo
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={preferences.weeklyTargetSessions}
                onChange={(e) =>
                  updatePref(
                    preferences,
                    dashboard.updatePreferences,
                    "weeklyTargetSessions",
                    Number(e.target.value) || 4
                  )
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <Settings className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Nauka
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                Styl i tryb pracy
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Cel nauki
              </label>
              <select
                value={preferences.learningGoal}
                onChange={(e) =>
                  updatePref(
                    preferences,
                    dashboard.updatePreferences,
                    "learningGoal",
                    e.target.value as StudyPreferences["learningGoal"]
                  )
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {learningGoalOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Styl nauki
              </label>
              <select
                value={preferences.learningStyle}
                onChange={(e) =>
                  updatePref(
                    preferences,
                    dashboard.updatePreferences,
                    "learningStyle",
                    e.target.value as StudyPreferences["learningStyle"]
                  )
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {learningStyleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Długość sesji
              </label>
              <select
                value={preferences.preferredSessionLength}
                onChange={(e) =>
                  updatePref(
                    preferences,
                    dashboard.updatePreferences,
                    "preferredSessionLength",
                    Number(e.target.value) as StudyPreferences["preferredSessionLength"]
                  )
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {sessionLengthOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} min
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Powiadomienia
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Przypomnienia o nauce.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notificationsEnabled}
                onChange={(e) =>
                  updatePref(
                    preferences,
                    dashboard.updatePreferences,
                    "notificationsEnabled",
                    e.target.checked
                  )
                }
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Auto start focus
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Start sesji bez zbędnego klikania.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.autoStartFocus}
                onChange={(e) =>
                  updatePref(
                    preferences,
                    dashboard.updatePreferences,
                    "autoStartFocus",
                    e.target.checked
                  )
                }
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Tipy onboardingowe
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Podpowiedzi w interfejsie.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.showOnboardingTips}
                onChange={(e) =>
                  updatePref(
                    preferences,
                    dashboard.updatePreferences,
                    "showOnboardingTips",
                    e.target.checked
                  )
                }
                className="h-5 w-5"
              />
            </label>
          </div>
        </section>
      </div>
    </main>
  );
}