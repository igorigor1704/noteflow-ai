"use client";

import { useCallback, useState } from "react";
import type { AnalysisNotes, SavedAnalysis, TabName } from "../_lib/types";
import AnalysisCoachPanel from "./AnalysisCoachPanel";
import AnalysisNotesEditor from "./AnalysisNotesEditor";

type AnalysisDetailViewProps = {
  analysis: SavedAnalysis;
  onNotesSave?: (notes: AnalysisNotes) => void;
};

const tabs: TabName[] = [
  "Streszczenie",
  "Pojęcia",
  "Pytania",
  "Fiszki",
  "Quiz",
  "Plan nauki",
];

export default function AnalysisDetailView({
  analysis,
  onNotesSave,
}: AnalysisDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabName>("Streszczenie");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {}
  );
  const [showAnswers, setShowAnswers] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);

  const { result } = analysis;

  const quizScore = result.quiz.reduce((acc, item, index) => {
    return selectedAnswers[index] === item.correct ? acc + 1 : acc;
  }, 0);

  const currentFlashcard =
    result.flashcards.length > 0 ? result.flashcards[flashcardIndex] : null;

  const handleNotesSave = useCallback(
    (notes: AnalysisNotes) => {
      onNotesSave?.(notes);
    },
    [onNotesSave]
  );

  return (
    <>
      <section className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Analysis detail
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              {analysis.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Utworzono: {analysis.createdAt}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-300 px-3 py-1 text-xs dark:border-slate-700">
                📁 {analysis.folder}
              </span>

              {analysis.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs dark:border-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Quick stats
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pojęcia
                </p>
                <p className="mt-1 text-2xl font-bold">{result.concepts.length}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Fiszki
                </p>
                <p className="mt-1 text-2xl font-bold">{result.flashcards.length}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pytania
                </p>
                <p className="mt-1 text-2xl font-bold">{result.questions.length}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Quiz
                </p>
                <p className="mt-1 text-2xl font-bold">{result.quiz.length}</p>
              </div>
            </div>

            {analysis.difficultTopics.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                  Trudne tematy
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.difficultTopics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <AnalysisCoachPanel analysis={analysis} />

      <AnalysisNotesEditor notes={analysis.notes} onSave={handleNotesSave} />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Streszczenie" && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
              <h2 className="mb-3 text-2xl font-semibold">Streszczenie</h2>
              <p className="leading-8 text-slate-700 dark:text-slate-300">
                {result.summary}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
              <h2 className="mb-3 text-2xl font-semibold">
                Najważniejsze wnioski
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
                {result.keyTakeaways.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "Pojęcia" && (
          <div className="flex flex-wrap gap-3">
            {result.concepts.map((item, index) => (
              <span
                key={index}
                className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-950"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {activeTab === "Pytania" && (
          <ol className="list-decimal space-y-3 pl-6 text-slate-700 dark:text-slate-300">
            {result.questions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        )}

        {activeTab === "Fiszki" && (
          <div className="space-y-6">
            {currentFlashcard && (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Fiszka {flashcardIndex + 1} z {result.flashcards.length}
                </p>
                <h3 className="mb-4 text-2xl font-bold">
                  {currentFlashcard.front}
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {currentFlashcard.back}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFlashcardIndex((prev) => Math.max(0, prev - 1))
                    }
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
                  >
                    Poprzednia
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFlashcardIndex((prev) =>
                        Math.min(result.flashcards.length - 1, prev + 1)
                      )
                    }
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
                  >
                    Następna
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {result.flashcards.map((card, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Przód
                  </p>
                  <p className="mb-4 text-lg font-semibold">{card.front}</p>

                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Tył
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    {card.back}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Quiz" && (
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAnswers((prev) => !prev)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                {showAnswers ? "Ukryj odpowiedzi" : "Pokaż odpowiedzi"}
              </button>

              <div className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-950">
                Wynik: {quizScore}/{result.quiz.length}
              </div>
            </div>

            <div className="space-y-6">
              {result.quiz.map((q, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <p className="mb-4 font-semibold">
                    {index + 1}. {q.question}
                  </p>

                  <div className="grid gap-2">
                    {q.options.map((opt, i) => {
                      const selected = selectedAnswers[index] === opt;
                      const correct = q.correct === opt;

                      return (
                        <button
                          type="button"
                          key={i}
                          onClick={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [index]: opt,
                            }))
                          }
                          className={`rounded-xl border px-4 py-3 text-left transition ${
                            selected
                              ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950"
                              : "border-slate-300 bg-white hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                          }`}
                        >
                          {opt}
                          {showAnswers && correct && (
                            <span className="ml-2 text-xs font-semibold text-emerald-300 dark:text-emerald-500">
                              ✓ poprawna
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showAnswers && (
                    <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                      Poprawna odpowiedź: {q.correct}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Plan nauki" && (
          <div className="grid gap-4 md:grid-cols-2">
            {result.studyPlan.map((step, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Krok {index + 1}
                </p>
                <p className="text-slate-700 dark:text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}