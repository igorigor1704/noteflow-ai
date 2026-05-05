"use client";

import Link from "next/link";
import { Clock3, PlayCircle, Sparkles, Target } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import PremiumEmptyState from "../_components/PremiumEmptyState";
import SpacedRepetitionPanel from "../_components/SpacedRepetitionPanel";
import StudyGoalsCard from "../_components/StudyGoalsCard";
import TodaySmartQueue from "../_components/TodaySmartQueue";
import { defaultPreferences } from "../_lib/preferences";
import { useDashboardState } from "../_hooks/useDashboardState";

function MetricCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {helper}
      </p>
    </div>
  );
}

export default function TodayPage() {
  const dashboard = useDashboardState();
  const [mounted, setMounted] = useState(false);

  const reviewRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const remedialRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const preferences = dashboard.preferences ?? defaultPreferences;
  const dueCards = Array.isArray(dashboard.dueCards) ? dashboard.dueCards : [];
  const currentSpacedCard = dashboard.currentSpacedCard ?? null;
  const remedialTopics = Array.isArray(dashboard.remedialTopics)
    ? dashboard.remedialTopics
    : [];
  const smartQueue = Array.isArray(dashboard.smartQueue) ? dashboard.smartQueue : [];

  const progress = useMemo(() => {
    const goal = Math.max(preferences.dailyGoalMinutes, 1);
    return Math.min(100, Math.round((dashboard.stats.todayMinutes / goal) * 100));
  }, [dashboard.stats.todayMinutes, preferences.dailyGoalMinutes]);

  const remainingMinutes = useMemo(() => {
    return Math.max(0, preferences.dailyGoalMinutes - dashboard.stats.todayMinutes);
  }, [preferences.dailyGoalMinutes, dashboard.stats.todayMinutes]);

  const focusMinutes = Math.floor(dashboard.focusSeconds / 60)
    .toString()
    .padStart(2, "0");
  const focusSeconds = (dashboard.focusSeconds % 60).toString().padStart(2, "0");

  const startFocus = () => {
    dashboard.setFocusSeconds(preferences.preferredSessionLength * 60);
    dashboard.setFocusRunning(true);
  };

  const pauseFocus = () => {
    dashboard.setFocusRunning(false);
  };

  const dailyStatusText =
    dashboard.stats.todayMinutes > 0
      ? `Masz już ${dashboard.stats.todayMinutes} min nauki. Zostało ${remainingMinutes} min do dzisiejszego celu.`
      : `Jeszcze nie zacząłeś dzisiejszej nauki. Najlepszy ruch to jedna sesja ${preferences.preferredSessionLength} min.`;

  if (!mounted) {
    return (
      <main className="space-y-6">
        <div className="h-36 animate-pulse rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-32 animate-pulse rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
          <div className="h-32 animate-pulse rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
          <div className="h-32 animate-pulse rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
          <div className="h-32 animate-pulse rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="h-96 animate-pulse rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
          <div className="h-96 animate-pulse rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                Today
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                dzienny rytm nauki
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100 md:text-4xl">
              Skup się dziś tylko na tym, co naprawdę ma sens
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Jeden jasny plan: zrób najważniejszy krok, domknij powtórki i utrzymaj
              rytm bez chaosu.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={dashboard.focusRunning ? pauseFocus : startFocus}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
            >
              <PlayCircle className="h-4 w-4" />
              {dashboard.focusRunning ? "Pauza focus" : "Start focus"}
            </button>

            <button
              type="button"
              onClick={() =>
                reviewRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Przejdź do powtórek
            </button>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Dzisiejszy status
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                {remainingMinutes > 0
                  ? `Do celu zostało ${remainingMinutes} min`
                  : "Dzisiejszy cel został osiągnięty"}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {dailyStatusText}
              </p>
            </div>

            <div className="min-w-[220px]">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <span>Postęp</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-2.5 rounded-full bg-slate-950 transition-all dark:bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Dzisiejsza nauka"
          value={`${dashboard.stats.todayMinutes} min`}
          helper={
            dashboard.stats.todayMinutes > 0
              ? `Cel dzienny: ${preferences.dailyGoalMinutes} min`
              : `Zacznij od krótkiej sesji i wejdź w rytm`
          }
          icon={<Clock3 className="h-5 w-5" />}
        />

        <MetricCard
          label="Powtórki"
          value={`${dueCards.length}`}
          helper={
            dueCards.length > 0
              ? "kart czeka dziś do przerobienia"
              : "na dziś nie masz jeszcze kart"
          }
          icon={<Target className="h-5 w-5" />}
        />

        <MetricCard
          label="Ready score"
          value={`${dashboard.readyScore}%`}
          helper={
            dashboard.readyScore > 0
              ? "gotowości do działania"
              : "zacznij pracę, a wynik ruszy w górę"
          }
          icon={<Sparkles className="h-5 w-5" />}
        />

        <MetricCard
          label="Focus timer"
          value={`${focusMinutes}:${focusSeconds}`}
          helper={
            dashboard.focusRunning
              ? "sesja focus właśnie trwa"
              : `ustawiona sesja ${preferences.preferredSessionLength} min`
          }
          icon={<PlayCircle className="h-5 w-5" />}
        />
      </section>

      <TodaySmartQueue
        items={smartQueue}
        readyScore={dashboard.readyScore}
        onScrollToReview={() =>
          reviewRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
        onScrollToResult={() =>
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
        onScrollToRemedial={() =>
          remedialRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
        onStartFocus={dashboard.focusRunning ? pauseFocus : startFocus}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Daily plan
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                Prosty plan na dziś
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Krok 1
                </p>
                <h4 className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">
                  Zrób główny materiał
                </h4>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Najpierw domknij to, co najważniejsze, zamiast skakać po wielu rzeczach.
                </p>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Krok 2
                </p>
                <h4 className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">
                  Domknij powtórki
                </h4>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Nawet krótka seria kart odciąża kolejny dzień i poprawia regularność.
                </p>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Krok 3
                </p>
                <h4 className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">
                  Wejdź w focus
                </h4>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Jedna konkretna sesja daje więcej niż rozproszona nauka bez planu.
                </p>
              </div>
            </div>
          </section>

          <section
            ref={remedialRef}
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Remedial
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                Tematy do poprawy
              </h3>
            </div>

            {remedialTopics.length > 0 ? (
              <div className="space-y-4">
                {remedialTopics.map((topic) => (
                  <div
                    key={topic.topic}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-slate-950 dark:text-slate-100">
                          {topic.topic}
                        </h4>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {topic.recommendation}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          topic.priority === "high"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                            : topic.priority === "medium"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        }`}
                      >
                        {topic.wrongCount} błędów
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <PremiumEmptyState
                badge="Today"
                title="Na dziś nie masz tematów wymagających poprawy"
                description="To dobrze. Skup się na spokojnym domknięciu celu i regularnych powtórkach."
                ctaHref="/dashboard"
                ctaLabel="Wróć do pracy"
              />
            )}
          </section>

          {dueCards.length === 0 ? (
            <PremiumEmptyState
              badge="Today"
              title="Na dziś nie masz jeszcze powtórek"
              description="Dodaj materiał i wygeneruj analizę, a tutaj pojawią się karty do nauki."
              ctaHref="/dashboard"
              ctaLabel="Dodaj materiał"
              secondaryHref="/dashboard/library"
              secondaryLabel="Otwórz library"
            />
          ) : null}
        </div>

        <div className="space-y-6">
          <StudyGoalsCard
            preferences={preferences}
            todayMinutes={dashboard.stats.todayMinutes}
            currentStreak={dashboard.stats.streak}
            onUpdate={dashboard.updatePreferences}
          />

          <div ref={reviewRef}>
            <SpacedRepetitionPanel
              dueCards={dueCards}
              dueCardsCount={dueCards.length}
              spacedIndex={dashboard.spacedIndex}
              currentCard={currentSpacedCard}
              showSpacedBack={dashboard.showSpacedBack}
              showBack={dashboard.showSpacedBack}
              onPrev={() =>
                dashboard.setSpacedIndex((prev: number) =>
                  prev <= 0 ? Math.max(dueCards.length - 1, 0) : prev - 1
                )
              }
              onNext={() =>
                dashboard.setSpacedIndex((prev: number) =>
                  dueCards.length <= 1 ? 0 : prev >= dueCards.length - 1 ? 0 : prev + 1
                )
              }
              onToggleBack={() =>
                dashboard.setShowSpacedBack((prev: boolean) => !prev)
              }
              onReview={dashboard.reviewCurrentSpacedCard}
            />
          </div>

          <section
            ref={resultRef}
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Next action
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
              Po powtórkach wróć do aktywnego materiału
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Zrób due cards, uruchom focus i dopiero potem wróć do analizy, quizu
              albo kolejnego materiału.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
              >
                Wróć do dashboardu
              </Link>

              <Link
                href="/dashboard/library"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Otwórz library
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}