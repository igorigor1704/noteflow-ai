export type ThemeMode = "light" | "dark";

export type Flashcard = {
  front: string;
  back: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correct: string;
};

export type AnalysisResult = {
  summary: string;
  keyTakeaways: string[];
  concepts: string[];
  questions: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  studyPlan: string[];
};

export type TabName =
  | "Streszczenie"
  | "Pojęcia"
  | "Pytania"
  | "Fiszki"
  | "Quiz"
  | "Plan nauki";

export const tabs: TabName[] = [
  "Streszczenie",
  "Pojęcia",
  "Pytania",
  "Fiszki",
  "Quiz",
  "Plan nauki",
];

export type AnalysisNotes = {
  freeform: string;
  personalSummary: string;
  examFocus: string;
};

export type SavedAnalysis = {
  id: string;
  title: string;
  createdAt: string;
  preview: string;
  pinned: boolean;
  favorite: boolean;
  folder: string;
  tags: string[];
  notes: AnalysisNotes;
  difficultTopics: string[];
  result: AnalysisResult;
};

export type UserStats = {
  xp: number;
  level: number;
  streak: number;
  totalAnalyses: number;
  totalQuizAttempts: number;
  totalCorrectAnswers: number;
  totalFlashcardsReviewed: number;
  perfectQuizzes: number;
  todayMinutes: number;
  dailyGoalMinutes: number;
  activity: Record<string, number>;
  lastStudyDate: string | null;
};

export const defaultStats: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  totalAnalyses: 0,
  totalQuizAttempts: 0,
  totalCorrectAnswers: 0,
  totalFlashcardsReviewed: 0,
  perfectQuizzes: 0,
  todayMinutes: 0,
  dailyGoalMinutes: 25,
  activity: {},
  lastStudyDate: null,
};

export const emptyAnalysisNotes: AnalysisNotes = {
  freeform: "",
  personalSummary: "",
  examFocus: "",
};