"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  History,
  RotateCcw,
  Sparkles,
} from "lucide-react";

type Props = {
  hasResult: boolean;
  hasHistory: boolean;
  hasDueCards: boolean;
  onAnalyze: () => void;
  onExportTxt: () => void;
  onExportCsv: () => void;
  onScrollToHistory: () => void;
  onScrollToReview: () => void;
};

type ActionButtonProps = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

function SecondaryActionButton({
  label,
  icon,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800"
    >
      {icon}
      {label}
    </button>
  );
}

export default function QuickActionsBar({
  hasResult,
  hasHistory,
  hasDueCards,
  onAnalyze,
  onExportTxt,
  onExportCsv,
  onScrollToHistory,
  onScrollToReview,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-6 py-6 dark:border-slate-800">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                Workflow
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                szybkie wejście do pracy
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">
              Najważniejsze akcje bez szukania po całej aplikacji
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Tutaj masz realny flow nauki: najpierw analiza materiału, potem wynik,
              historia i dzisiejsze powtórki. Bez chaosu, bez zbędnych kliknięć.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onAnalyze}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:opacity-95 dark:bg-white dark:text-slate-950"
            >
              Generuj analizę
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/dashboard/today"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <BookOpen className="h-4 w-4" />
              Otwórz Today
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-6 py-6 md:grid-cols-2 2xl:grid-cols-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <Download className="h-4 w-4" />
            Eksport wyników
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Zapisz wynik analizy i fiszki, kiedy chcesz wykorzystać materiał poza aplikacją.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <SecondaryActionButton
              label="Eksport TXT"
              icon={<FileText className="h-4 w-4" />}
              onClick={onExportTxt}
              disabled={!hasResult}
            />

            <SecondaryActionButton
              label="Eksport CSV"
              icon={<Download className="h-4 w-4" />}
              onClick={onExportCsv}
              disabled={!hasResult}
            />
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <History className="h-4 w-4" />
            Historia analiz
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Wróć do poprzednich materiałów i kontynuuj naukę dokładnie tam, gdzie ją skończyłaś.
          </p>

          <div className="mt-4">
            <SecondaryActionButton
              label="Przejdź do historii"
              icon={<History className="h-4 w-4" />}
              onClick={onScrollToHistory}
              disabled={!hasHistory}
            />
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <RotateCcw className="h-4 w-4" />
            Dzisiejsze powtórki
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Przejdź prosto do fiszek i spaced repetition, bez grzebania po ekranach.
          </p>

          <div className="mt-4">
            <SecondaryActionButton
              label="Przejdź do powtórek"
              icon={<RotateCcw className="h-4 w-4" />}
              onClick={onScrollToReview}
              disabled={!hasDueCards}
            />
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-900 bg-slate-950 p-5 text-white dark:border-slate-700 dark:bg-white dark:text-slate-950">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/70 dark:text-slate-500">
            <Sparkles className="h-4 w-4" />
            Flow
          </div>

          <h3 className="mt-3 text-xl font-black tracking-tight">
            Materiał → analiza → biblioteka → powtórka
          </h3>

          <p className="mt-3 text-sm leading-7 text-white/80 dark:text-slate-600">
            Dashboard ma prowadzić Cię przez kolejne etapy nauki, a nie tylko pokazywać funkcje.
          </p>
        </div>
      </div>
    </section>
  );
}