import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  createSpacedCard,
  isDueToday,
  reviewSpacedCard,
  type ReviewGrade,
  type SpacedCard,
} from "../lib/spacedRepetition";
import type { Flashcard, QuizQuestion } from "../dashboard/_lib/types";

export type StudyAnalysis = {
  id: string;
  title: string;
  createdAt: string;
  summary: string;
  concepts: string[];
  questions: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  studyPlan: string[];
  tags: string[];
  folder: string;
  notes: string;
  favorite: boolean;
  pinned: boolean;
};

type StudyStateData = {
  analyses: StudyAnalysis[];
  spacedCards: SpacedCard[];
  xp: number;
  level: number;
  streak: number;
  wrongAnswers: Record<string, number>;
};

type StudyState = StudyStateData & {
  addAnalysis: (analysis: StudyAnalysis) => void;
  addFlashcardsToSpacedSystem: (
    analysisId: string,
    flashcards: Flashcard[]
  ) => void;
  reviewCard: (cardId: string, grade: ReviewGrade) => void;
  toggleFavorite: (id: string) => void;
  togglePin: (id: string) => void;
  addXP: (value: number) => void;
  getDueCards: () => SpacedCard[];
  recordWrongAnswer: (topic: string) => void;
  removeAnalysis: (id: string) => void;
  clearAll: () => void;
};

const initialState: StudyStateData = {
  analyses: [],
  spacedCards: [],
  xp: 0,
  level: 1,
  streak: 0,
  wrongAnswers: {},
};

function normalizeAnalysis(input: StudyAnalysis): StudyAnalysis {
  return {
    id: input.id,
    title: input.title?.trim() || "Bez tytułu",
    createdAt: input.createdAt,
    summary: input.summary?.trim() || "",
    concepts: Array.isArray(input.concepts) ? input.concepts : [],
    questions: Array.isArray(input.questions) ? input.questions : [],
    flashcards: Array.isArray(input.flashcards) ? input.flashcards : [],
    quiz: Array.isArray(input.quiz) ? input.quiz : [],
    studyPlan: Array.isArray(input.studyPlan) ? input.studyPlan : [],
    tags: Array.isArray(input.tags) ? input.tags : [],
    folder: input.folder?.trim() || "Bez folderu",
    notes: input.notes ?? "",
    favorite: Boolean(input.favorite),
    pinned: Boolean(input.pinned),
  };
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addAnalysis: (analysis) =>
        set((state) => {
          const normalized = normalizeAnalysis(analysis);
          const withoutDuplicate = state.analyses.filter(
            (item) => item.id !== normalized.id
          );

          return {
            analyses: [normalized, ...withoutDuplicate],
          };
        }),

      addFlashcardsToSpacedSystem: (analysisId, flashcards) =>
        set((state) => {
          const existingIds = new Set(state.spacedCards.map((card) => card.id));

          const newCards = flashcards
            .filter((card) => card.front?.trim() && card.back?.trim())
            .map((card, index) =>
              createSpacedCard(
                `${analysisId}-${index}-${card.front}`,
                card.front,
                card.back
              )
            )
            .filter((card) => !existingIds.has(card.id));

          return {
            spacedCards: [...state.spacedCards, ...newCards],
          };
        }),

      reviewCard: (cardId, grade) =>
        set((state) => {
          const updatedCards = state.spacedCards.map((card) =>
            card.id === cardId ? reviewSpacedCard(card, grade) : card
          );

          const xpGain = grade >= 4 ? 12 : grade === 3 ? 8 : 4;
          const nextXp = state.xp + xpGain;
          const nextLevel = Math.floor(nextXp / 100) + 1;

          return {
            spacedCards: updatedCards,
            xp: nextXp,
            level: nextLevel,
          };
        }),

      toggleFavorite: (id) =>
        set((state) => ({
          analyses: state.analyses.map((analysis) =>
            analysis.id === id
              ? { ...analysis, favorite: !analysis.favorite }
              : analysis
          ),
        })),

      togglePin: (id) =>
        set((state) => ({
          analyses: state.analyses.map((analysis) =>
            analysis.id === id
              ? { ...analysis, pinned: !analysis.pinned }
              : analysis
          ),
        })),

      addXP: (value) =>
        set((state) => {
          const xp = state.xp + value;
          const level = Math.floor(xp / 100) + 1;

          return {
            xp,
            level,
          };
        }),

      getDueCards: () => get().spacedCards.filter(isDueToday),

      recordWrongAnswer: (topic) =>
        set((state) => {
          const key = topic?.trim() || "Nieznany temat";
          const current = state.wrongAnswers[key] ?? 0;

          return {
            wrongAnswers: {
              ...state.wrongAnswers,
              [key]: current + 1,
            },
          };
        }),

      removeAnalysis: (id) =>
        set((state) => ({
          analyses: state.analyses.filter((analysis) => analysis.id !== id),
          spacedCards: state.spacedCards.filter(
            (card) => !card.id.startsWith(`${id}-`)
          ),
        })),

      clearAll: () => ({
        ...initialState,
      }),
    }),
    {
      name: "study-app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        analyses: state.analyses,
        spacedCards: state.spacedCards,
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        wrongAnswers: state.wrongAnswers,
      }),
    }
  )
);