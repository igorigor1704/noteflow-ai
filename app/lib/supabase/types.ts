export type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  learning_style: "mixed" | "quiz" | "flashcards" | "notes";
  daily_goal_minutes: number;
  plan: "free" | "pro";
  joined_at: string;
  updated_at: string;
};

export type UserStatsRow = {
  user_id: string;
  streak: number;
  total_study_minutes: number;
  total_analyses: number;
  total_flashcards_reviewed: number;
  total_quiz_attempts: number;
  updated_at: string;
};