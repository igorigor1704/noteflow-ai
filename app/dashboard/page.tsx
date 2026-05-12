"use client";

import Link from "next/link";
import type { ReactNode } from "react";
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
  icon: ReactNode;
}) {
  return (
    <div className="nf-stat-card group">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {label}
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-violet-300 shadow-lg shadow-violet-950/20">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-3xl font-black tracking-tight text-white">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-400">{helper}</p>
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
  const safeDueCards = Array.isArray(dashboard.dueCards)
    ? dashboard.dueCards
    : [];
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
        <div className="h-44 animate-pulse rounded-[32px] border border-white/10 bg-white/5" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
          <div className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
          <div className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
          <div className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
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

      <main className="space-y-6 pb-10">
        <section className="premium-border relative overflow-hidden rounded-[34px] border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="absolute left-1/3 top-0 h-60 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
          </div>

          <div className="relative px-6 py-7 md:px-8 md:py-9">
            <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-200">
                    Dashboard
                  </span>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100">
                    AI study workspace
                  </span>
                </div>

                <h1 className="nf-gradient-text text-3xl font-black tracking-tight md:text-5xl">
                  Zamień materiały w system nauki, który wygląda i działa jak
                  premium SaaS.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  Dodaj PDF, DOCX albo notatki. NoteFlow wygeneruje
                  streszczenie, fiszki, quiz, pytania i plan nauki — bez chaosu.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={dashboard.analyzeText}
                  className="nf-button-primary"
                >
                  Analizuj materiał
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="nf-button-secondary"
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
                  className="nf-button-secondary"
                >
                  Przejdź do wyniku
                </button>

                <Link href="/dashboard/library" className="nf-button-secondary">
                  Library
                </Link>
              </div>
            </div>
          </div>

          <div className="relative grid gap-4 border-t border-white/10 px-6 py-6 md:grid-cols-3 md:px-8">
            {[
              ["Flow 01", "Dodaj PDF, DOCX albo tekst do analizy"],
              ["Flow 02", "Odbierz wynik, fiszki, quiz i plan nauki"],
              ["Flow 03", "Wracaj do historii i powtórek bez chaosu"],
            ].map(([label, text]) => (
              <div
                key={label}
                className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                  {label}
                </p>
                <p className="mt-3 text-base font-bold leading-6 text-white">
                  {text}
                </p>
              </div>
            ))}
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
            <section className="nf-panel rounded-[32px] p-4">
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

            <section ref={resultRef} className="nf-panel rounded-[32px] p-5">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                    Analysis result
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
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
                  className="nf-button-secondary"
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
                    dashboard.setSelectedAnswers(
                      (prev: Record<number, string>) => ({
                        ...prev,
                        [questionIndex]: value,
                      })
                    )
                  }
                  onToggleShowAnswers={() =>
                    dashboard.setShowAnswers((prev: boolean) => !prev)
                  }
                  onSubmitQuiz={dashboard.submitQuiz}
                  onResetQuiz={dashboard.resetQuiz}
                />
              ) : (
                <div className="rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] p-10 text-center">
                  <h4 className="text-lg font-semibold text-white">
                    Tu pojawi się wynik analizy
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Dodaj tekst albo plik i kliknij analizę.
                  </p>
                </div>
              )}
            </section>

            <div ref={historyRef} className="nf-panel rounded-[32px] p-4">
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
            <section className="nf-panel rounded-[32px] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                Workspace status
              </p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-white">
                Ucz się w jednym miejscu
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Ten panel trzyma rytm pracy: wynik analizy, cele, powtórki i
                historia bez przełączania się między chaotycznymi ekranami.
              </p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-semibold text-white">
                    Analizy zapisane
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {safeHistory.length} materiałów w historii.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-semibold text-white">
                    Powtórki na dziś
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {safeDueCards.length} kart gotowych do przerobienia.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-semibold text-white">Gotowość</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Ready score: {dashboard.readyScore}%.
                  </p>
                </div>
              </div>
            </section>

            <div className="nf-panel rounded-[32px] p-4">
              <StudyGoalsCard
                preferences={dashboard.preferences}
                todayMinutes={dashboard.stats.todayMinutes}
                currentStreak={dashboard.stats.streak}
                onUpdate={dashboard.updatePreferences}
              />
            </div>

            <div className="nf-panel rounded-[32px] p-4">
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
        </div>
      </main>
    </>
  );
}