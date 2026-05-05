export type LearningGoal =
  | "exam"
  | "regular"
  | "fast-review"
  | "deep-work";

export type LearningStyle =
  | "flashcards"
  | "quiz"
  | "reading"
  | "mixed";

export type StudyPreferences = {
  onboardingCompleted: boolean;
  displayName: string;
  primaryFocus: string;
  dailyGoalMinutes: number;
  weeklyTargetSessions: number;
  learningGoal: LearningGoal;
  learningStyle: LearningStyle;
  preferredSessionLength: 15 | 25 | 45 | 60;

  notificationsEnabled: boolean;
  autoStartFocus: boolean;
  showOnboardingTips: boolean;
};

export const defaultPreferences: StudyPreferences = {
  onboardingCompleted: false,
  displayName: "",
  primaryFocus: "",
  dailyGoalMinutes: 25,
  weeklyTargetSessions: 5,
  learningGoal: "regular",
  learningStyle: "mixed",
  preferredSessionLength: 25,

  notificationsEnabled: true,
  autoStartFocus: false,
  showOnboardingTips: true,
};

export const learningGoalOptions: Array<{
  value: LearningGoal;
  label: string;
  description: string;
}> = [
  {
    value: "exam",
    label: "Egzamin",
    description: "Priorytet: skuteczna powtórka i szybkie utrwalenie materiału.",
  },
  {
    value: "regular",
    label: "Regularna nauka",
    description: "Priorytet: stabilny postęp i codzienny rytm.",
  },
  {
    value: "fast-review",
    label: "Szybka powtórka",
    description: "Priorytet: krótkie sesje i błyskawiczne odświeżenie wiedzy.",
  },
  {
    value: "deep-work",
    label: "Deep work",
    description: "Priorytet: dłuższe sesje i głębokie zrozumienie materiału.",
  },
];

export const learningStyleOptions: Array<{
  value: LearningStyle;
  label: string;
  description: string;
}> = [
  {
    value: "flashcards",
    label: "Fiszki",
    description: "Największy nacisk na aktywne przypominanie i pamięć.",
  },
  {
    value: "quiz",
    label: "Quizy",
    description: "Największy nacisk na sprawdzanie wiedzy pytaniami.",
  },
  {
    value: "reading",
    label: "Czytanie i notatki",
    description: "Największy nacisk na streszczenia, pojęcia i własne notatki.",
  },
  {
    value: "mixed",
    label: "Mix",
    description: "Zbalansowane podejście: analiza, fiszki i quizy.",
  },
];