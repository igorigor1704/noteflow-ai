"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  FileText,
  Library,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import HistoryPanel from "./_components/HistoryPanel";
import MaterialInputPanel from "./_components/MaterialInputPanel";
import OnboardingModal from "./_components/OnboardingModal";
import ResultTabsPanel from "./_components/ResultTabsPanel";
import SpacedRepetitionPanel from "./_components/SpacedRepetitionPanel";
import StudyGoalsCard from "./_components/StudyGoalsCard";
import { useDashboardState } from "./_hooks/useDashboardState";
import { demoAnalysis } from "./_data/demoAnalysis";
import { useStudyStore } from "../store/useStudyStore";

function StatCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{helper}</p>
    </div>
  );
}

export default function DashboardPage() {
  const dashboard = useDashboardState();
  const addAnalysis = useStudyStore((state) => state.addAnalysis);
  const addFlashcardsToSpacedSystem = useStudyStore(
    (state) => state.addFlashcardsToSpacedSystem
  );
  const [mounted, setMounted] = useState(false);

  const resultRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoadDemo = () => {
    try {
      const rawHistory = localStorage.getItem("noteflow-history");
      const parsedHistory = rawHistory ? JSON.parse(rawHistory) : [];
      const safeHistory = Array.isArray(parsedHistory) ? parsedHistory : [];

      const exists = safeHistory.some((item) => item?.id === demoAnalysis.id);
      const nextHistory = exists
        ? safeHistory
        : [demoAnalysis, ...safeHistory].slice(0, 20);

      localStorage.setItem("noteflow-history", JSON.stringify(nextHistory));

      addAnalysis({
        id: demoAnalysis.id,
        title: demoAnalysis.title,
        createdAt: demoAnalysis.createdAt,
        summary: demoAnalysis.result.summary,
        concepts: demoAnalysis.result.concepts,
        questions: demoAnalysis.result.questions,
        flashcards: demoAnalysis.result.flashcards,
        quiz: demoAnalysis.result.quiz,
        studyPlan: demoAnalysis.result.studyPlan,
        tags: demoAnalysis.tags,
        folder: demoAnalysis.folder,
        notes: demoAnalysis.notes.freeform,
        favorite: demoAnalysis.favorite,
        pinned: demoAnalysis.pinned,
      });

      addFlashcardsToSpacedSystem(
        demoAnalysis.id,
        demoAnalysis.result.flashcards
      );

      window.location.reload();
    } catch (error) {
      console.error("Nie udało się załadować demo:", error);
    }
  };

  const safeHistory = Array.isArray(dashboard.history) ? dashboard.history : [];
  const safeDueCards = Array.isArray(dashboard.dueCards) ? dashboard.dueCards : [];
  const safeFolders = Array.isArray(dashboard.folders) ? dashboard.folders : [];
  const safeAvailableTags = Array.isArray(dashboard.availableTags)
    ? dashboard.availableTags
    : [];
  const safeFilteredHistory = Array.isArray(dashboard.filteredHistory)
    ? dashboard.filteredHistory
    : [];

  const currentSpacedCard = dashboard.currentSpacedCard ?? null;

  const currentNotes = dashboard.currentAnalysis?.notes ?? {
    freeform: "",
    personalSummary: "",
    examFocus: "",
  };

  if (!mounted) {
    return (
      <main className="space-y-6">
        <div className="h-40 animate-pulse rounded-[30px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-36 animate-pulse rounded-[26px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
          <div className="h-36 animate-pulse rounded-[26px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
          <div className="h-36 animate-pulse rounded-[26px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
          <div className="h-36 animate-pulse rounded-[26px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="h-80 animate-pulse rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
          <div className="h-80 animate-pulse rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
        </div>
      </main>
    );
  }

  return (
    <>
      <OnboardingModal
        isOpen={!dashboard.preferences.onboardingCompleted}
        draft={dashboard.onboardingDraft}
        onChange={dashboard.updateOnboardingDraft}
        onSubmit={dashboard.completeOnboarding}
      />

      <main className="space-y-6">
        <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-6 py-6 dark:border-slate-800 md:px-8 md:py-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                    Dashboard
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    premium workspace
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100 md:text-4xl">
                  Zamień materiały w uporządkowany system nauki
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Najpierw dodajesz materiał. Potem dostajesz analizę, fiszki,
                  pytania i plan pracy. Na końcu wracasz do historii i powtórek
                  bez chaosu.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={dashboard.analyzeText}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
                >
                  Analizuj materiał
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Załaduj demo
                </button>

                <button
                  type="button"
                  onClick={() =>
                    resultRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Przejdź do wyniku
                </button>

                <Link
                  href="/dashboard/library"
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Otwórz library
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-3 md:px-8">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Flow 01
              </p>
              <p className="mt-2 text-base font-bold text-slate-950 dark:text-slate-100">
                Dodaj notatki, PDF albo materiał do nauki
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Flow 02
              </p>
              <p className="mt-2 text-base font-bold text-slate-950 dark:text-slate-100">
                Odbierz wynik, fiszki, quiz i plan nauki
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Flow 03
              </p>
              <p className="mt-2 text-base font-bold text-slate-950 dark:text-slate-100">
                Wróć do historii i przerabiaj tylko to, co ważne
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Dzisiejsza nauka"
            value={`${dashboard.stats.todayMinutes} min`}
            helper={`Cel: ${dashboard.preferences.dailyGoalMinutes} min`}
            icon={<Clock3 className="h-5 w-5" />}
          />

          <StatCard
            label="Analizy"
            value={safeHistory.length}
            helper="zapisanych materiałów"
            icon={<FileText className="h-5 w-5" />}
          />

          <StatCard
            label="Powtórki"
            value={safeDueCards.length}
            helper="fiszki czekają dziś"
            icon={<Target className="h-5 w-5" />}
          />

          <StatCard
            label="Ready score"
            value={`${dashboard.readyScore}%`}
            helper="gotowości do nauki"
            icon={<Sparkles className="h-5 w-5" />}
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <MaterialInputPanel
                titleInput={dashboard.titleInput}
                tagsInput={dashboard.tagsInput}
                inputText={dashboard.inputText}
                loading={dashboard.loading}
                message={dashboard.message}
                folders={safeFolders}
                activeFolder={dashboard.activeFolder}
                newFolderName={dashboard.newFolderName}
                todayMinutes={dashboard.stats.todayMinutes}
                dailyGoalMinutes={dashboard.preferences.dailyGoalMinutes}
                onTitleChange={dashboard.setTitleInput}
                onTagsChange={dashboard.setTagsInput}
                onInputTextChange={dashboard.setInputText}
                onFolderSelect={dashboard.setActiveFolder}
                onNewFolderNameChange={dashboard.setNewFolderName}
                onCreateFolder={dashboard.createFolder}
                onFileSelected={dashboard.handleFileUpload}
                onAnalyze={dashboard.analyzeText}
                onClear={dashboard.clearAll}
                onExportTxt={dashboard.exportAnalysisToTXT}
                onExportCsv={dashboard.exportFlashcardsToCSV}
              />
            </section>

            <section
              ref={resultRef}
              className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Analysis result
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                    Wynik analizy
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    historyRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  <Library className="h-4 w-4" />
                  Historia
                </button>
              </div>

              {dashboard.result ? (
                <ResultTabsPanel
                  result={dashboard.result}
                  activeTab={dashboard.activeTab}
                  flashcardIndex={dashboard.flashcardIndex}
                  selectedAnswers={dashboard.selectedAnswers}
                  showAnswers={dashboard.showAnswers}
                  quizSubmitted={dashboard.quizSubmitted}
                  quizScore={dashboard.quizScore}
                  answeredCount={dashboard.answeredCount}
                  currentNotes={currentNotes.freeform}
                  onTabChange={dashboard.setActiveTab}
                  onNotesChange={(value: string) =>
                    dashboard.updateAnalysisNotes({
                      freeform: value,
                      personalSummary: currentNotes.personalSummary,
                      examFocus: currentNotes.examFocus,
                    })
                  }
                  onPrevFlashcard={() => dashboard.changeFlashcard("prev")}
                  onNextFlashcard={() => dashboard.changeFlashcard("next")}
                  onSetSelectedAnswer={(questionIndex: number, value: string) =>
                    dashboard.setSelectedAnswers((prev: Record<number, string>) => ({
                      ...prev,
                      [questionIndex]: value,
                    }))
                  }
                  onToggleShowAnswers={() =>
                    dashboard.setShowAnswers((prev: boolean) => !prev)
                  }
                  onSubmitQuiz={dashboard.submitQuiz}
                  onResetQuiz={dashboard.resetQuiz}
                />
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-950">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Tu pojawi się wynik analizy
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Dodaj tekst albo plik i kliknij analizę.
                  </p>
                </div>
              )}
            </section>

            <div ref={historyRef}>
              <HistoryPanel
                historySearch={dashboard.historySearch}
                onlyFavorites={dashboard.onlyFavorites}
                activeTag={dashboard.activeTag}
                availableTags={safeAvailableTags}
                filteredHistory={safeFilteredHistory}
                onHistorySearchChange={dashboard.setHistorySearch}
                onToggleOnlyFavorites={() =>
                  dashboard.setOnlyFavorites((prev: boolean) => !prev)
                }
                onSetActiveTag={dashboard.setActiveTag}
                onTogglePin={dashboard.togglePin}
                onToggleFavorite={dashboard.toggleFavorite}
                onOpen={dashboard.loadFromHistory}
                onRemove={dashboard.removeHistoryItem}
              />
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Workspace status
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                Ucz się w jednym miejscu
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Ten panel ma trzymać rytm pracy: wynik analizy, cele, powtórki i
                historia bez przełączania się między chaotycznymi ekranami.
              </p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Analizy zapisane
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {safeHistory.length} materiałów w historii.
                  </p>
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Powtórki na dziś
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {safeDueCards.length} kart gotowych do przerobienia.
                  </p>
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Gotowość
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Ready score: {dashboard.readyScore}%.
                  </p>
                </div>
              </div>
            </section>

            <StudyGoalsCard
              preferences={dashboard.preferences}
              todayMinutes={dashboard.stats.todayMinutes}
              currentStreak={dashboard.stats.streak}
              onUpdate={dashboard.updatePreferences}
            />

            <SpacedRepetitionPanel
              dueCards={safeDueCards}
              dueCardsCount={safeDueCards.length}
              spacedIndex={dashboard.spacedIndex}
              currentCard={currentSpacedCard}
              showSpacedBack={dashboard.showSpacedBack}
              showBack={dashboard.showSpacedBack}
              onPrev={() =>
                dashboard.setSpacedIndex((prev: number) =>
                  prev <= 0 ? Math.max(safeDueCards.length - 1, 0) : prev - 1
                )
              }
              onNext={() =>
                dashboard.setSpacedIndex((prev: number) =>
                  safeDueCards.length <= 1
                    ? 0
                    : prev >= safeDueCards.length - 1
                    ? 0
                    : prev + 1
                )
              }
              onToggleBack={() =>
                dashboard.setShowSpacedBack((prev: boolean) => !prev)
              }
              onReview={dashboard.reviewCurrentSpacedCard}
            />
          </div>
        </div>
      </main>
    </>
  );
}