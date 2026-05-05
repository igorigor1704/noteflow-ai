"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

type SpacedCardLike =
  | string
  | {
      id?: string;
      front?: string;
      back?: string;
      question?: string;
      answer?: string;
      term?: string;
      definition?: string;
    };

type Props = {
  dueCards: SpacedCardLike[];
  dueCardsCount: number;
  spacedIndex: number;
  currentCard: SpacedCardLike | null;
  showSpacedBack: boolean;
  showBack?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleBack: () => void;
  onReview: (grade: 0 | 3 | 4 | 5) => void;
};

function getFront(card: SpacedCardLike | null) {
  if (!card) return "";
  if (typeof card === "string") return card;
  return (
    card.front ??
    card.question ??
    card.term ??
    "Brak treści"
  );
}

function getBack(card: SpacedCardLike | null) {
  if (!card) return "";
  if (typeof card === "string") return card;
  return (
    card.back ??
    card.answer ??
    card.definition ??
    "Brak odpowiedzi"
  );
}

export default function SpacedRepetitionPanel({
  dueCards,
  dueCardsCount,
  spacedIndex,
  currentCard,
  showSpacedBack,
  onPrev,
  onNext,
  onToggleBack,
  onReview,
}: Props) {
  const front = getFront(currentCard);
  const back = getBack(currentCard);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Spaced repetition
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
            Powtórki na dziś
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Prosty widok fiszki i szybka ocena powtórki bez przeładowania interfejsu.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
          {dueCardsCount} kart do zrobienia
        </div>
      </div>

      {dueCardsCount > 0 && currentCard ? (
        <>
          <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Karta {Math.min(spacedIndex + 1, dueCards.length)} / {dueCards.length}
              </p>

              <button
                type="button"
                onClick={onToggleBack}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
                {showSpacedBack ? "Pokaż przód" : "Pokaż odpowiedź"}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Przód
                </p>
                <p className="mt-3 text-sm leading-8 text-slate-700 dark:text-slate-300">
                  {front}
                </p>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Odpowiedź
                </p>
                <p className="mt-3 text-sm leading-8 text-slate-700 dark:text-slate-300">
                  {showSpacedBack ? back : "Kliknij „Pokaż odpowiedź”, aby odsłonić tył fiszki."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Poprzednia
            </button>

            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Następna
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Oceń tę kartę
            </p>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <button
                type="button"
                onClick={() => onReview(0)}
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50"
              >
                0 · Źle
              </button>

              <button
                type="button"
                onClick={() => onReview(3)}
                className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-950/50"
              >
                3 · Trudne
              </button>

              <button
                type="button"
                onClick={() => onReview(4)}
                className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-300 dark:hover:bg-sky-950/50"
              >
                4 · Dobrze
              </button>

              <button
                type="button"
                onClick={() => onReview(5)}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
              >
                5 · Bardzo dobrze
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-950">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Dziś nie masz jeszcze powtórek
          </h4>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Wygeneruj analizę i fiszki, a tutaj pojawią się karty do spaced repetition.
          </p>
        </div>
      )}
    </section>
  );
}