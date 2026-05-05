"use client";

import type { StudyPreferences } from "../_lib/preferences";

type Props = {
  isOpen: boolean;
  draft: StudyPreferences;
  onChange: <K extends keyof StudyPreferences>(
    key: K,
    value: StudyPreferences[K]
  ) => void;
  onSubmit: () => void;
};

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

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        Krok {number}
      </p>
      <h4 className="mt-2 text-base font-bold text-slate-950 dark:text-slate-100">
        {title}
      </h4>
      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}

export default function OnboardingModal({
  isOpen,
  draft,
  onChange,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-6 dark:border-slate-800 md:px-8 md:py-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                  Welcome
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  pierwszy start NoteFlow AI
                </span>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100 md:text-4xl">
                Ustaw swój styl nauki i zacznij od razu
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                NoteFlow zamienia materiał w streszczenie, pytania, fiszki i quiz.
                Ustaw tylko kilka rzeczy, żeby aplikacja od razu działała pod Twój rytm.
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Jak to działa
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
                Dodajesz materiał → dostajesz analizę → uczysz się z quizów, fiszek i planu dnia.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 xl:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-8">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Szybki start
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                Co zrobisz po wejściu do aplikacji
              </h3>

              <div className="mt-5 grid gap-4">
                <StepCard
                  number="1"
                  title="Dodaj materiał"
                  description="Wklej tekst albo wrzuć plik i uruchom analizę."
                />
                <StepCard
                  number="2"
                  title="Przerób wynik"
                  description="Przeczytaj streszczenie, pojęcia, pytania i przejdź przez quiz."
                />
                <StepCard
                  number="3"
                  title="Wróć do Today"
                  description="Aplikacja ma Ci podpowiadać, co robić dziś bez chaosu."
                />
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Profil
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                Ustaw swój rytm nauki
              </h3>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Jak mam się do Ciebie zwracać?
                  </label>
                  <input
                    value={draft.displayName}
                    onChange={(e) => onChange("displayName", e.target.value)}
                    placeholder="Np. Maja"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Główny cel
                  </label>
                  <select
                    value={draft.primaryFocus}
                    onChange={(e) =>
                      onChange(
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
                    Cel dzienny (minuty)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={600}
                    value={draft.dailyGoalMinutes}
                    onChange={(e) =>
                      onChange("dailyGoalMinutes", Number(e.target.value) || 30)
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
                    value={draft.weeklyTargetSessions}
                    onChange={(e) =>
                      onChange(
                        "weeklyTargetSessions",
                        Number(e.target.value) || 4
                      )
                    }
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Tryb nauki
                  </label>
                  <select
                    value={draft.learningGoal}
                    onChange={(e) =>
                      onChange(
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
                    value={draft.learningStyle}
                    onChange={(e) =>
                      onChange(
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
                    value={draft.preferredSessionLength}
                    onChange={(e) =>
                      onChange(
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
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Ustawienia
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                Dodatkowe opcje
              </h3>

              <div className="mt-5 space-y-4">
                <label className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Powiadomienia
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Włącz przypomnienia o nauce.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.notificationsEnabled}
                    onChange={(e) =>
                      onChange("notificationsEnabled", e.target.checked)
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
                      Szybciej wejdziesz w rytm pracy.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.autoStartFocus}
                    onChange={(e) =>
                      onChange("autoStartFocus", e.target.checked)
                    }
                    className="h-5 w-5"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Pokazuj tipy onboardingowe
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Małe podpowiedzi w interfejsie.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.showOnboardingTips}
                    onChange={(e) =>
                      onChange("showOnboardingTips", e.target.checked)
                    }
                    className="h-5 w-5"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.24)] dark:border-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Gotowe?
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">
                Zapisz ustawienia i wejdź do aplikacji
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/80">
                To jest jednorazowy start. Potem wszystko możesz zmienić w ustawieniach.
              </p>

              <button
                type="button"
                onClick={onSubmit}
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                Wejdź do NoteFlow
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}