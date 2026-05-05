"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import AnalysisDetailView from "../../_components/AnalysisDetailView";
import OralExamPanel from "../../_components/OralExamPanel";
import PremiumEmptyState from "../../_components/PremiumEmptyState";
import UpgradeModal from "../../../components/UpgradeModal";
import { useDashboardState } from "../../_hooks/useDashboardState";
import { useStudyStore } from "../../../store/useStudyStore";
import { usePro } from "../../../lib/pro/usePro";
import type { AnalysisNotes, SavedAnalysis } from "../../_lib/types";

export default function AnalysisPage() {
  const dashboard = useDashboardState();
  const params = useParams<{ id: string }>();
  const storeAnalyses = useStudyStore((state) => state.analyses);
  const { isPro, hydrated, syncing } = usePro();
  const [showOralUpgrade, setShowOralUpgrade] = useState(false);

  const safeHistory = Array.isArray(dashboard.history) ? dashboard.history : [];
  const analysisId = typeof params?.id === "string" ? params.id : "";

  const analysis: SavedAnalysis | null = useMemo(() => {
    const fromHistory = safeHistory.find((item) => item.id === analysisId);

    if (fromHistory) {
      return fromHistory;
    }

    const fromStore = storeAnalyses.find((item) => item.id === analysisId);

    if (!fromStore) {
      return null;
    }

    return {
      id: fromStore.id,
      title: fromStore.title,
      createdAt: fromStore.createdAt,
      preview: fromStore.summary?.slice(0, 110) ?? "",
      pinned: fromStore.pinned,
      favorite: fromStore.favorite,
      folder: fromStore.folder,
      tags: fromStore.tags ?? [],
      notes: {
        freeform: fromStore.notes ?? "",
        personalSummary: "",
        examFocus: "",
      },
      difficultTopics: [],
      result: {
        summary: fromStore.summary ?? "",
        keyTakeaways: [],
        concepts: fromStore.concepts ?? [],
        questions: fromStore.questions ?? [],
        flashcards: fromStore.flashcards ?? [],
        quiz: fromStore.quiz ?? [],
        studyPlan: fromStore.studyPlan ?? [],
      },
    };
  }, [analysisId, safeHistory, storeAnalyses]);

  const handleSaveNotes = useCallback(
    (notes: AnalysisNotes) => {
      if (!analysis) return;
      dashboard.updateAnalysisNotesById(analysis.id, notes);
    },
    [analysis, dashboard]
  );

  return (
    <>
      <UpgradeModal
        open={showOralUpgrade}
        onClose={() => setShowOralUpgrade(false)}
        title="Oral Exam Mode jest w planie Pro"
        description="Symulacja egzaminu ustnego i ocena odpowiedzi są dostępne w NoteFlow Pro."
        featureName="Oral Exam Mode"
      />

      <main className="space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                  Analysis
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  szczegóły materiału
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100 md:text-4xl">
                {analysis?.title ?? "Szczegóły analizy"}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Tu masz pełny wynik analizy, notatki i dodatkową pracę z
                materiałem w jednym miejscu.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/library"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Wróć do library
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <LayoutGrid className="h-4 w-4" />
                Dashboard
              </Link>

              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
              >
                <Sparkles className="h-4 w-4" />
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </section>

        {!analysis ? (
          <PremiumEmptyState
            badge="Analysis"
            title="Nie znaleziono tej analizy"
            description="Ta analiza nie istnieje w aktualnej bibliotece lokalnej albo została usunięta. Wróć do biblioteki i wybierz inny materiał."
          />
        ) : (
          <div className="space-y-8">
            <AnalysisDetailView
              analysis={analysis}
              onNotesSave={handleSaveNotes}
            />

            {hydrated && isPro ? (
              <OralExamPanel
                analysis={{
                  title: analysis.title,
                  summary: analysis.result?.summary ?? "",
                  keyTakeaways: analysis.result?.keyTakeaways ?? [],
                  concepts: analysis.result?.concepts ?? [],
                  studyPlan: analysis.result?.studyPlan ?? [],
                }}
              />
            ) : (
              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Pro feature
                    </p>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                      Odblokuj prawdziwy Oral Exam Mode
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      Ten moduł generuje pytanie ustne na podstawie materiału,
                      ocenia Twoją odpowiedź i pokazuje lepszą wersję odpowiedzi.
                    </p>
                    {syncing ? (
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        Trwa sprawdzanie statusu Pro...
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setShowOralUpgrade(true)}
                      className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
                    >
                      Zobacz plan Pro
                    </button>

                    <Link
                      href="/pricing"
                      className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      Pricing
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
}