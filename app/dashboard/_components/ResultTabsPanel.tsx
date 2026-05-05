"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Layers3,
  ListTodo,
  NotebookPen,
  ScrollText,
} from "lucide-react";
import { type AnalysisResult, type TabName, tabs } from "../_lib/types";

type Props = {
  result: AnalysisResult;
  activeTab: TabName;
  flashcardIndex: number;
  selectedAnswers: Record<number, string>;
  showAnswers: boolean;
  quizSubmitted: boolean;
  quizScore: number;
  answeredCount: number;
  currentNotes: string;
  onTabChange: (tab: TabName) => void;
  onNotesChange: (value: string) => void;
  onPrevFlashcard: () => void;
  onNextFlashcard: () => void;
  onSetSelectedAnswer: (questionIndex: number, value: string) => void;
  onToggleShowAnswers: () => void;
  onSubmitQuiz: () => void;
  onResetQuiz: () => void;
};

function getTabIcon(tab: TabName) {
  switch (tab) {
    case "Streszczenie":
      return <ScrollText className="h-4 w-4" />;
    case "Pojęcia":
      return <Layers3 className="h-4 w-4" />;
    case "Pytania":
      return <HelpCircle className="h-4 w-4" />;
    case "Fiszki":
      return <NotebookPen className="h-4 w-4" />;
    case "Quiz":
      return <CheckCircle2 className="h-4 w-4" />;
    case "Plan nauki":
      return <ListTodo className="h-4 w-4" />;
    default:
      return <ScrollText className="h-4 w-4" />;
  }
}

function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
        {icon}
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">
          {title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>
    </div>
  );
}

function safeLines(value: string): string[] {
  if (!value || !value.trim()) return [];
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function PremiumEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-950">
      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h4>
      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}

export default function ResultTabsPanel({
  result,
  activeTab,
  flashcardIndex,
  selectedAnswers,
  showAnswers,
  quizSubmitted,
  quizScore,
  answeredCount,
  currentNotes,
  onTabChange,
  onNotesChange,
  onPrevFlashcard,
  onNextFlashcard,
  onSetSelectedAnswer,
  onToggleShowAnswers,
  onSubmitQuiz,
  onResetQuiz,
}: Props) {
  const summaryLines = safeLines(result.summary);
  const concepts = Array.isArray(result.concepts) ? result.concepts : [];
  const questions = Array.isArray(result.questions) ? result.questions : [];
  const flashcards = Array.isArray(result.flashcards) ? result.flashcards : [];
  const quiz = Array.isArray(result.quiz) ? result.quiz : [];
  const studyPlan = Array.isArray(result.studyPlan) ? result.studyPlan : [];

  const safeFlashcardIndex =
    flashcards.length > 0
      ? Math.min(Math.max(flashcardIndex, 0), flashcards.length - 1)
      : 0;

  const currentFlashcard =
    flashcards.length > 0 ? flashcards[safeFlashcardIndex] : null;

  const shouldShowQuizScore = quizSubmitted || showAnswers;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-[24px] border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {getTabIcon(tab)}
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "Streszczenie" && (
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7">
          <SectionHeader
            icon={<ScrollText className="h-5 w-5" />}
            eyebrow="Summary"
            title="Najważniejsze wnioski z materiału"
            description="Czysty, uporządkowany skrót najistotniejszych informacji."
          />

          {summaryLines.length > 0 ? (
            <div className="grid gap-4">
              {summaryLines.map((line, index) => (
                <div
                  key={`${line}-${index}`}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-8 text-slate-700 dark:text-slate-300">
                      {line}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PremiumEmpty
              title="Brak podsumowania"
              description="Wygeneruj analizę ponownie albo dodaj pełniejszy materiał."
            />
          )}
        </section>
      )}

      {activeTab === "Pojęcia" && (
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7">
          <SectionHeader
            icon={<Layers3 className="h-5 w-5" />}
            eyebrow="Concepts"
            title="Pojęcia, które trzeba zapamiętać"
            description="Najważniejsze terminy i idee wyciągnięte z materiału."
          />

          {concepts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {concepts.map((concept, index) => (
                <div
                  key={`${concept}-${index}`}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      <Layers3 className="h-4 w-4" />
                    </div>
                    <p className="text-base font-semibold leading-7 text-slate-950 dark:text-slate-100">
                      {concept}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PremiumEmpty
              title="Brak pojęć"
              description="Ta analiza nie zwróciła jeszcze listy pojęć do powtórki."
            />
          )}
        </section>
      )}

      {activeTab === "Pytania" && (
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7">
          <SectionHeader
            icon={<HelpCircle className="h-5 w-5" />}
            eyebrow="Questions"
            title="Pytania do aktywnej nauki"
            description="Użyj ich do odpowiedzi ustnych i sprawdzania zrozumienia."
          />

          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={`${question}-${index}`}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium leading-8 text-slate-800 dark:text-slate-200">
                      {question}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PremiumEmpty
              title="Brak pytań"
              description="Ta analiza nie zawiera jeszcze pytań do aktywnej nauki."
            />
          )}
        </section>
      )}

      {activeTab === "Fiszki" && (
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7">
          <SectionHeader
            icon={<NotebookPen className="h-5 w-5" />}
            eyebrow="Flashcards"
            title="Fiszki do szybkiej powtórki"
            description="Minimalistyczny układ fiszek do nauki."
          />

          {currentFlashcard ? (
            <>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Karta <strong>{safeFlashcardIndex + 1}</strong> z{" "}
                  <strong>{flashcards.length}</strong>
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onPrevFlashcard}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Poprzednia
                  </button>

                  <button
                    type="button"
                    onClick={onNextFlashcard}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    Następna
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Front
                  </p>
                  <p className="mt-5 text-lg font-bold leading-8 text-slate-950 dark:text-slate-100">
                    {currentFlashcard.front}
                  </p>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-700 dark:bg-white dark:text-slate-950">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 dark:text-slate-500">
                    Back
                  </p>
                  <p className="mt-5 text-lg leading-8 text-white/90 dark:text-slate-700">
                    {currentFlashcard.back}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <PremiumEmpty
              title="Brak fiszek"
              description="Dodaj pełniejszy materiał albo wygeneruj analizę ponownie."
            />
          )}
        </section>
      )}

      {activeTab === "Quiz" && (
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7">
          <SectionHeader
            icon={<CheckCircle2 className="h-5 w-5" />}
            eyebrow="Quiz"
            title="Sprawdź, co już umiesz"
            description="Najpierw zaznaczasz odpowiedzi, a wynik pojawia się dopiero po zakończeniu quizu."
          />

          <div className="mb-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Pytania
              </p>
              <p className="mt-3 text-2xl font-black text-slate-950 dark:text-slate-100">
                {quiz.length}
              </p>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Odpowiedziane
              </p>
              <p className="mt-3 text-2xl font-black text-slate-950 dark:text-slate-100">
                {answeredCount}
              </p>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Wynik
              </p>
              <p className="mt-3 text-2xl font-black text-slate-950 dark:text-slate-100">
                {shouldShowQuizScore ? `${quizScore}/${quiz.length}` : "—"}
              </p>
            </div>
          </div>

          {quiz.length > 0 ? (
            <div className="space-y-5">
              {quiz.map((question, index) => {
                const selectedValue = selectedAnswers[index] ?? "";

                return (
                  <div
                    key={`${question.question}-${index}`}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="mb-4 flex items-start gap-4">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                        {index + 1}
                      </div>

                      <div>
                        <p className="text-base font-bold leading-8 text-slate-950 dark:text-slate-100">
                          {question.question}
                        </p>

                        {showAnswers ? (
                          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
                            Poprawna odpowiedź: <strong>{question.correct}</strong>
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {question.options.map((option) => {
                        const isSelected = selectedValue === option;
                        const isCorrect = showAnswers && question.correct === option;
                        const isWrongSelected =
                          showAnswers && isSelected && question.correct !== option;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => onSetSelectedAnswer(index, option)}
                            className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                              isCorrect
                                ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                                : isWrongSelected
                                ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                                : isSelected
                                ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={onSubmitQuiz}
                  className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
                >
                  Zakończ quiz
                </button>

                <button
                  type="button"
                  onClick={onToggleShowAnswers}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  {showAnswers ? "Ukryj odpowiedzi" : "Pokaż odpowiedzi"}
                </button>

                <button
                  type="button"
                  onClick={onResetQuiz}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Reset i nowe pytania
                </button>
              </div>
            </div>
          ) : (
            <PremiumEmpty
              title="Brak quizu"
              description="Ta analiza nie wygenerowała jeszcze zestawu pytań quizowych."
            />
          )}
        </section>
      )}

      {activeTab === "Plan nauki" && (
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7">
          <SectionHeader
            icon={<ListTodo className="h-5 w-5" />}
            eyebrow="Study plan"
            title="Plan dalszej nauki"
            description="Co zrobić teraz, co później i co warto powtórzyć jutro."
          />

          {studyPlan.length > 0 ? (
            <div className="space-y-4">
              {studyPlan.map((step, index) => (
                <div
                  key={`${step}-${index}`}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-8 text-slate-700 dark:text-slate-300">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PremiumEmpty
              title="Brak planu nauki"
              description="W tej analizie nie ma jeszcze rozpisanego planu dalszej pracy."
            />
          )}
        </section>
      )}

      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7">
        <SectionHeader
          icon={<NotebookPen className="h-5 w-5" />}
          eyebrow="Notes"
          title="Twoje własne notatki"
          description="Miejsce na skróty myślowe i rzeczy do szybkiej powtórki."
        />

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <textarea
            value={currentNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Zapisz własne notatki, skojarzenia, rzeczy do powtórki..."
            className="min-h-[240px] w-full resize-none rounded-[20px] border border-slate-300 bg-white p-4 text-sm leading-7 text-slate-800 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </section>
    </div>
  );
}