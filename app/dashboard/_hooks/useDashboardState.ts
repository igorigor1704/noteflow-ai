"use client";

import { useEffect, useMemo, useState } from "react";
import { useStudyStore } from "../../store/useStudyStore";
import {
  defaultStats,
  emptyAnalysisNotes,
  type AnalysisNotes,
  type AnalysisResult,
  type SavedAnalysis,
  type TabName,
  type ThemeMode,
  type UserStats,
} from "../_lib/types";
import {
  defaultPreferences,
  type StudyPreferences,
} from "../_lib/preferences";
import { getLastDays, parseTags, todayKey, yesterdayKey } from "../_lib/utils";

type RemedialTopic = {
  topic: string;
  wrongCount: number;
  priority: "high" | "medium" | "low";
  recommendation: string;
};

type RemedialStep = {
  title: string;
  description: string;
  duration: string;
};

type SmartQueueItem = {
  id: string;
  title: string;
  description: string;
  badge: string;
  cta: string;
  priority: "high" | "medium" | "low";
};

function normalizeAnalysisResult(data: unknown): AnalysisResult {
  const source =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};

  return {
    summary: typeof source.summary === "string" ? source.summary.trim() : "",
    keyTakeaways: Array.isArray(source.keyTakeaways)
      ? source.keyTakeaways.filter((item): item is string => typeof item === "string")
      : [],
    concepts: Array.isArray(source.concepts)
      ? source.concepts.filter((item): item is string => typeof item === "string")
      : [],
    questions: Array.isArray(source.questions)
      ? source.questions.filter((item): item is string => typeof item === "string")
      : [],
    flashcards: Array.isArray(source.flashcards)
      ? source.flashcards
          .map((item) => {
            if (!item || typeof item !== "object") return null;

            if (
              "front" in item &&
              "back" in item &&
              typeof item.front === "string" &&
              typeof item.back === "string"
            ) {
              return {
                front: item.front,
                back: item.back,
              };
            }

            if (
              "term" in item &&
              "definition" in item &&
              typeof item.term === "string" &&
              typeof item.definition === "string"
            ) {
              return {
                front: item.term,
                back: item.definition,
              };
            }

            return null;
          })
          .filter(
            (
              item
            ): item is AnalysisResult["flashcards"][number] => item !== null
          )
      : [],
    quiz: Array.isArray(source.quiz)
      ? source.quiz.filter(
          (
            item
          ): item is AnalysisResult["quiz"][number] =>
            Boolean(
              item &&
                typeof item === "object" &&
                "question" in item &&
                "options" in item &&
                "correct" in item &&
                typeof item.question === "string" &&
                Array.isArray(item.options) &&
                typeof item.correct === "string"
            )
        )
      : [],
    studyPlan: Array.isArray(source.studyPlan)
      ? source.studyPlan.filter((item): item is string => typeof item === "string")
      : [],
  };
}

export function useDashboardState() {
  const addAnalysisToStore = useStudyStore((state) => state.addAnalysis);
  const addFlashcardsToSpacedSystem = useStudyStore(
    (state) => state.addFlashcardsToSpacedSystem
  );
  const wrongAnswers = useStudyStore((state) => state.wrongAnswers);
  const recordWrongAnswer = useStudyStore((state) => state.recordWrongAnswer);
  const spacedCards = useStudyStore((state) => state.spacedCards);
  const getDueCards = useStudyStore((state) => state.getDueCards);
  const reviewCard = useStudyStore((state) => state.reviewCard);
  const toggleFavoriteInStore = useStudyStore((state) => state.toggleFavorite);
  const togglePinInStore = useStudyStore((state) => state.togglePin);
  const removeAnalysisFromStore = useStudyStore((state) => state.removeAnalysis);

  const dueCards = useMemo(() => getDueCards(), [getDueCards, spacedCards]);

  const [titleInput, setTitleInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [activeTab, setActiveTab] = useState<TabName>("Streszczenie");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [historySearch, setHistorySearch] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [activeTag, setActiveTag] = useState<string>("Wszystkie");
  const [folders, setFolders] = useState<string[]>([
    "Wszystkie",
    "Egzamin",
    "Studia",
  ]);
  const [activeFolder, setActiveFolder] = useState("Wszystkie");
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {}
  );
  const [showAnswers, setShowAnswers] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [focusRunning, setFocusRunning] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState("15");
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [preferences, setPreferences] =
    useState<StudyPreferences>(defaultPreferences);
  const [onboardingDraft, setOnboardingDraft] =
    useState<StudyPreferences>(defaultPreferences);
  const [lastWeakTopics, setLastWeakTopics] = useState<string[]>([]);
  const [spacedIndex, setSpacedIndex] = useState(0);
  const [showSpacedBack, setShowSpacedBack] = useState(false);
  const [regeneratingQuiz, setRegeneratingQuiz] = useState(false);

  useEffect(() => {
    const rawHistory = localStorage.getItem("noteflow-history");
    const rawTheme = localStorage.getItem("noteflow-theme");
    const rawStats = localStorage.getItem("noteflow-stats");
    const rawFolders = localStorage.getItem("noteflow-folders");
    const rawPreferences = localStorage.getItem("noteflow-preferences");

    if (rawHistory) {
      try {
        setHistory(JSON.parse(rawHistory) as SavedAnalysis[]);
      } catch {
        localStorage.removeItem("noteflow-history");
      }
    }

    if (rawTheme === "dark" || rawTheme === "light") {
      setTheme(rawTheme);
    }

    if (rawStats) {
      try {
        setStats(JSON.parse(rawStats) as UserStats);
      } catch {
        localStorage.removeItem("noteflow-stats");
      }
    }

    if (rawFolders) {
      try {
        const parsed = JSON.parse(rawFolders) as string[];
        if (parsed.length > 0) {
          setFolders(
            parsed.includes("Wszystkie") ? parsed : ["Wszystkie", ...parsed]
          );
        }
      } catch {
        localStorage.removeItem("noteflow-folders");
      }
    }

    if (rawPreferences) {
      try {
        const parsed = JSON.parse(rawPreferences) as StudyPreferences;
        setPreferences(parsed);
        setOnboardingDraft(parsed);
        setFocusSeconds(parsed.preferredSessionLength * 60);
      } catch {
        localStorage.removeItem("noteflow-preferences");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("noteflow-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("noteflow-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("noteflow-stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("noteflow-folders", JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem("noteflow-preferences", JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    if (!focusRunning) return;

    const timer = window.setInterval(() => {
      setFocusSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setFocusRunning(false);
          setMessage("Sesja focus zakończona.");
          updateStatsAfterMinutes(1);
          return preferences.preferredSessionLength * 60;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [focusRunning, preferences.preferredSessionLength]);

  const currentAnalysis = useMemo(
    () => history.find((item) => item.id === activeAnalysisId) ?? null,
    [history, activeAnalysisId]
  );

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    history.forEach((item) => {
      item.tags.forEach((tag) => tags.add(tag));
    });
    return ["Wszystkie", ...Array.from(tags)];
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        !historySearch.trim() ||
        item.title.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.preview.toLowerCase().includes(historySearch.toLowerCase());

      const matchesFavorite = !onlyFavorites || item.favorite;
      const matchesTag = activeTag === "Wszystkie" || item.tags.includes(activeTag);

      return matchesSearch && matchesFavorite && matchesTag;
    });
  }, [history, historySearch, onlyFavorites, activeTag]);

  const hasResult = Boolean(result);
  const hasHistory = history.length > 0;
  const hasDueCards = dueCards.length > 0;

  const quizScore = useMemo(() => {
    if (!result) return 0;

    return result.quiz.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.correct ? 1 : 0);
    }, 0);
  }, [result, selectedAnswers]);

  const answeredCount = useMemo(
    () => Object.keys(selectedAnswers).length,
    [selectedAnswers]
  );

  const progressToNextLevel = Math.min((stats.xp % 100) / 100, 1);

  const achievementBadges = useMemo(() => {
    const badges: string[] = [];

    if (stats.totalAnalyses >= 1) badges.push("Pierwsza analiza");
    if (stats.totalAnalyses >= 10) badges.push("Seria analiz");
    if (stats.perfectQuizzes >= 1) badges.push("Perfekcyjny quiz");
    if (stats.streak >= 3) badges.push("3 dni z rzędu");
    if (stats.totalFlashcardsReviewed >= 20) badges.push("Fiszki w ruchu");

    return badges;
  }, [stats]);

  const activityDays = useMemo(() => getLastDays(14), []);

  const remedialTopics = useMemo<RemedialTopic[]>(() => {
    return Object.entries(wrongAnswers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, wrongCount]) => ({
        topic,
        wrongCount,
        priority:
          wrongCount >= 5 ? "high" : wrongCount >= 3 ? "medium" : "low",
        recommendation:
          wrongCount >= 5
            ? "To wymaga natychmiastowej powtórki."
            : wrongCount >= 3
            ? "Warto wrócić do tego tematu dziś."
            : "Dobrze zrobić krótką powtórkę.",
      }));
  }, [wrongAnswers]);

  const remedialSteps = useMemo<RemedialStep[]>(() => {
    if (remedialTopics.length === 0) {
      return [
        {
          title: "Brak zaległości",
          description:
            "Na razie nie ma tematów wymagających pilnej powtórki.",
          duration: "5 min",
        },
      ];
    }

    return [
      {
        title: "Powtórz streszczenie",
        description: "Przeczytaj ponownie najważniejsze wnioski z materiału.",
        duration: "5 min",
      },
      {
        title: "Wróć do pojęć",
        description: "Skup się na najsłabszych zagadnieniach i definicjach.",
        duration: "10 min",
      },
      {
        title: "Zrób quiz ponownie",
        description: "Sprawdź, czy po poprawce wynik się poprawił.",
        duration: "8 min",
      },
    ];
  }, [remedialTopics]);

  const readyScore = useMemo(() => {
    let score = 0;

    if (result) score += 35;
    if (dueCards.length === 0) score += 20;
    if (stats.todayMinutes >= preferences.dailyGoalMinutes) score += 25;
    if (stats.streak >= 1) score += 10;
    if (answeredCount > 0) score += 10;

    return Math.min(score, 100);
  }, [
    result,
    dueCards.length,
    stats.todayMinutes,
    preferences.dailyGoalMinutes,
    stats.streak,
    answeredCount,
  ]);

  const smartQueue = useMemo<SmartQueueItem[]>(() => {
    const items: SmartQueueItem[] = [];

    if (!result) {
      items.push({
        id: "analyze",
        title: "Wygeneruj analizę",
        description: "Dodaj materiał i uruchom AI, aby zbudować bazę nauki.",
        badge: "Start",
        cta: "Analizuj",
        priority: "high",
      });
    }

    if (dueCards.length > 0) {
      items.push({
        id: "review",
        title: "Masz fiszki do powtórki",
        description: `Do przerobienia: ${dueCards.length} kart spaced repetition.`,
        badge: "Powtórka",
        cta: "Przejdź do fiszek",
        priority: "high",
      });
    }

    if (remedialTopics.length > 0) {
      items.push({
        id: "remedial",
        title: "Masz słabsze obszary",
        description: "Wróć do tematów, w których pojawiały się błędne odpowiedzi.",
        badge: "Focus",
        cta: "Napraw luki",
        priority: "medium",
      });
    }

    items.push({
      id: "result",
      title: "Pracuj na aktualnym materiale",
      description: "Uzupełnij notatki, pytania i quiz.",
      badge: "Workflow",
      cta: "Otwórz wynik",
      priority: "medium",
    });

    return items;
  }, [result, dueCards.length, remedialTopics.length]);

  function updateStatsAfterMinutes(minutes: number) {
    const today = todayKey();
    const lastStudyDate = stats.lastStudyDate;
    const isNewDay = lastStudyDate !== today;
    const streak =
      lastStudyDate === yesterdayKey()
        ? stats.streak + 1
        : isNewDay
        ? 1
        : stats.streak;

    setStats((prev) => ({
      ...prev,
      streak,
      todayMinutes: prev.todayMinutes + minutes,
      activity: {
        ...prev.activity,
        [today]: (prev.activity[today] ?? 0) + minutes,
      },
      lastStudyDate: today,
    }));
  }

  function updateStatsAfterAnalysis() {
    setStats((prev) => ({
      ...prev,
      totalAnalyses: prev.totalAnalyses + 1,
      xp: prev.xp + 20,
      level: Math.floor((prev.xp + 20) / 100) + 1,
    }));
  }

  function createFolder() {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    if (folders.includes(trimmed)) return;

    setFolders((prev) => [...prev, trimmed]);
    setActiveFolder(trimmed);
    setNewFolderName("");
  }

  function togglePin(id: string) {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      )
    );
    togglePinInStore(id);
  }

  function toggleFavorite(id: string) {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
    toggleFavoriteInStore(id);
  }

  function updateAnalysisNotes(notes: AnalysisNotes) {
    if (!activeAnalysisId) return;

    setHistory((prev) =>
      prev.map((item) =>
        item.id === activeAnalysisId ? { ...item, notes } : item
      )
    );
  }

  function updateOnboardingDraft<K extends keyof StudyPreferences>(
    key: K,
    value: StudyPreferences[K]
  ) {
    setOnboardingDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updatePreferences(next: StudyPreferences) {
    setPreferences(next);
    setFocusSeconds(next.preferredSessionLength * 60);
  }

  function completeOnboarding() {
    const completed = {
      ...onboardingDraft,
      onboardingCompleted: true,
    };

    setPreferences(completed);
    setOnboardingDraft(completed);
    setStats((prev) => ({
      ...prev,
      dailyGoalMinutes: completed.dailyGoalMinutes,
    }));
    setFocusSeconds(completed.preferredSessionLength * 60);
    setMessage("Profil nauki został zapisany.");
  }

  function updateAnalysisNotesById(id: string, notes: AnalysisNotes) {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  }

  async function handleFileUpload(file: File) {
    setMessage("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analyze/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as {
        ok?: boolean;
        text?: string;
        fileName?: string;
        characters?: number;
        error?: string;
      };

      if (!res.ok || !data.text) {
        setMessage(data.error || "Nie udało się wczytać pliku.");
        return;
      }

      setInputText(data.text);

      if (!titleInput.trim()) {
        setTitleInput(file.name.replace(/\.[^/.]+$/, ""));
      }

      setMessage(
        `Plik został wczytany. Odczytano ${
          data.characters ?? data.text.length
        } znaków.`
      );
    } catch {
      setMessage("Nie udało się wczytać pliku.");
    }
  }

  async function analyzeText() {
    if (!inputText.trim()) {
      setMessage("Wklej tekst albo wczytaj plik.");
      return;
    }

    setLoading(true);
    setMessage("");
    setResult(null);
    setSelectedAnswers({});
    setShowAnswers(false);
    setQuizSubmitted(false);
    setFlashcardIndex(0);
    setLastWeakTopics([]);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          title: titleInput.trim() || "Nowa analiza",
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setMessage(data.error || "Nie udało się wykonać analizy.");
        return;
      }

      const normalizedResult = normalizeAnalysisResult(data);

      const entry: SavedAnalysis = {
        id: typeof data.id === "string" ? data.id : crypto.randomUUID(),
        title: titleInput.trim() || "Nowa analiza",
        createdAt:
          typeof data.createdAt === "string"
            ? data.createdAt
            : new Date().toISOString(),
        preview: inputText.slice(0, 110),
        pinned: false,
        favorite: false,
        folder: activeFolder === "Wszystkie" ? "Studia" : activeFolder,
        tags: parseTags(tagsInput),
        notes: emptyAnalysisNotes,
        difficultTopics: [],
        result: normalizedResult,
      };

      setResult(normalizedResult);
      setActiveTab("Streszczenie");
      setHistory((prev) => [entry, ...prev].slice(0, 20));
      setActiveAnalysisId(entry.id);

      addAnalysisToStore({
        id: entry.id,
        title: entry.title,
        createdAt: entry.createdAt,
        summary: normalizedResult.summary,
        concepts: normalizedResult.concepts,
        questions: normalizedResult.questions,
        flashcards: normalizedResult.flashcards,
        quiz: normalizedResult.quiz,
        studyPlan: normalizedResult.studyPlan,
        tags: entry.tags,
        folder: entry.folder,
        notes: entry.notes.freeform,
        favorite: entry.favorite,
        pinned: entry.pinned,
      });

      addFlashcardsToSpacedSystem(entry.id, normalizedResult.flashcards);
      updateStatsAfterAnalysis();
      setMessage("Analiza gotowa.");
    } catch {
      setMessage("Wystąpił błąd podczas analizy.");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setTitleInput("");
    setTagsInput("");
    setInputText("");
    setResult(null);
    setMessage("");
    setSelectedAnswers({});
    setShowAnswers(false);
    setQuizSubmitted(false);
    setFlashcardIndex(0);
    setActiveAnalysisId(null);
    setLastWeakTopics([]);
  }

  function loadFromHistory(item: SavedAnalysis) {
    setResult(item.result);
    setActiveTab("Streszczenie");
    setMessage(`Załadowano analizę z ${item.createdAt}.`);
    setSelectedAnswers({});
    setShowAnswers(false);
    setQuizSubmitted(false);
    setFlashcardIndex(0);
    setActiveAnalysisId(item.id);
    setTitleInput(item.title);
    setTagsInput(item.tags.join(", "));
    setLastWeakTopics(item.difficultTopics);
  }

  function removeHistoryItem(id: string) {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    removeAnalysisFromStore(id);

    if (activeAnalysisId === id) {
      setActiveAnalysisId(null);
      setResult(null);
    }
  }

  function changeFlashcard(direction: "prev" | "next") {
    if (!result?.flashcards.length) return;

    setFlashcardIndex((prev) => {
      if (direction === "prev") {
        return prev === 0 ? result.flashcards.length - 1 : prev - 1;
      }

      return prev === result.flashcards.length - 1 ? 0 : prev + 1;
    });
  }

  function submitQuiz() {
    if (!result) return;

    setQuizSubmitted(true);

    result.quiz.forEach((question, index) => {
      const selected = selectedAnswers[index];
      if (selected && selected !== question.correct) {
        const topic =
          result.concepts[index % Math.max(result.concepts.length, 1)] ??
          `Pytanie ${index + 1}`;
        recordWrongAnswer(topic);
      }
    });

    setStats((prev) => ({
      ...prev,
      totalQuizAttempts: prev.totalQuizAttempts + 1,
      totalCorrectAnswers: prev.totalCorrectAnswers + quizScore,
      perfectQuizzes:
        quizScore === result.quiz.length
          ? prev.perfectQuizzes + 1
          : prev.perfectQuizzes,
    }));
  }

  async function resetQuiz() {
    setSelectedAnswers({});
    setShowAnswers(false);
    setQuizSubmitted(false);

    if (!result || regeneratingQuiz) {
      return;
    }

    setRegeneratingQuiz(true);
    setMessage("Generuję nowy zestaw pytań do quizu...");

    try {
      const res = await fetch("/api/quiz/regenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentAnalysis?.title || titleInput || "Nowa analiza",
          summary: result.summary,
          concepts: result.concepts,
          questions: result.questions,
          flashcards: result.flashcards,
          previousQuiz: result.quiz,
        }),
      });

      const data = (await res.json()) as {
        quiz?: AnalysisResult["quiz"];
        fallback?: boolean;
        error?: string;
      };

      if (!res.ok || !Array.isArray(data.quiz) || data.quiz.length === 0) {
        throw new Error(data.error || "Nie udało się wygenerować nowego quizu.");
      }

      const nextQuiz = data.quiz.filter(
        (item): item is AnalysisResult["quiz"][number] =>
          Boolean(
            item &&
              typeof item === "object" &&
              typeof item.question === "string" &&
              Array.isArray(item.options) &&
              item.options.length === 4 &&
              item.options.every((option) => typeof option === "string") &&
              typeof item.correct === "string"
          )
      );

      if (nextQuiz.length === 0) {
        throw new Error("Nowy quiz jest pusty.");
      }

      const nextResult: AnalysisResult = {
        ...result,
        quiz: nextQuiz,
      };

      setResult(nextResult);

      if (activeAnalysisId) {
        setHistory((prev) =>
          prev.map((item) =>
            item.id === activeAnalysisId
              ? {
                  ...item,
                  result: nextResult,
                }
              : item
          )
        );

        const historyItem = history.find((item) => item.id === activeAnalysisId);

        if (historyItem) {
          addAnalysisToStore({
            id: historyItem.id,
            title: historyItem.title,
            createdAt: historyItem.createdAt,
            summary: nextResult.summary,
            concepts: nextResult.concepts,
            questions: nextResult.questions,
            flashcards: nextResult.flashcards,
            quiz: nextResult.quiz,
            studyPlan: nextResult.studyPlan,
            tags: historyItem.tags,
            folder: historyItem.folder,
            notes: historyItem.notes.freeform,
            favorite: historyItem.favorite,
            pinned: historyItem.pinned,
          });
        }
      }

      setMessage(
        data.fallback
          ? "Quiz odświeżony w trybie awaryjnym."
          : "Quiz odświeżony. Masz nowy zestaw pytań."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Nie udało się odświeżyć quizu."
      );
    } finally {
      setRegeneratingQuiz(false);
    }
  }

  function exportAnalysisToTXT() {
    if (!result) {
      setMessage("Najpierw wygeneruj analizę.");
      return;
    }

    const content = [
      `Tytuł: ${titleInput || "Nowa analiza"}`,
      "",
      "STRESZCZENIE",
      result.summary,
      "",
      "KLUCZOWE WNIOSKI",
      ...result.keyTakeaways.map((item) => `- ${item}`),
      "",
      "POJĘCIA",
      ...result.concepts.map((item) => `- ${item}`),
      "",
      "PYTANIA",
      ...result.questions.map((item) => `- ${item}`),
      "",
      "PLAN NAUKI",
      ...result.studyPlan.map((item) => `- ${item}`),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "analiza.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function exportFlashcardsToCSV() {
    if (!result?.flashcards.length) {
      setMessage("Brak fiszek do eksportu.");
      return;
    }

    const rows = [
      ["front", "back"],
      ...result.flashcards.map((card) => [card.front, card.back]),
    ];

    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "flashcards.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function reviewCurrentSpacedCard(grade: 0 | 3 | 4 | 5) {
    const currentCard = dueCards[spacedIndex];
    if (!currentCard) return;

    reviewCard(currentCard.id, grade);
    setShowSpacedBack(false);
    setSpacedIndex((prev) => {
      if (dueCards.length <= 1) return 0;
      return prev >= dueCards.length - 1 ? 0 : prev + 1;
    });

    setStats((prev) => ({
      ...prev,
      totalFlashcardsReviewed: prev.totalFlashcardsReviewed + 1,
    }));
  }

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setMessage("Przeglądarka nie obsługuje powiadomień.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      setMessage("Powiadomienia zostały włączone.");
      return;
    }

    setMessage("Nie przyznano zgody na powiadomienia.");
  }

  function scheduleReminder() {
    const minutes = Number(reminderMinutes);

    if (!Number.isFinite(minutes) || minutes <= 0) {
      setMessage("Podaj poprawną liczbę minut.");
      return;
    }

    window.setTimeout(() => {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("NoteFlow", {
          body: "Czas wrócić do nauki 🚀",
        });
      }
    }, minutes * 60 * 1000);

    setMessage(`Przypomnienie ustawione za ${minutes} min.`);
  }

  const currentSpacedCard = dueCards[spacedIndex] ?? null;

  return {
    titleInput,
    setTitleInput,
    tagsInput,
    setTagsInput,
    inputText,
    setInputText,
    loading,
    message,
    theme,
    setTheme,
    activeTab,
    setActiveTab,
    result,
    setResult,
    history,
    activeAnalysisId,
    currentAnalysis,
    historySearch,
    setHistorySearch,
    onlyFavorites,
    setOnlyFavorites,
    activeTag,
    setActiveTag,
    availableTags,
    filteredHistory,
    folders,
    activeFolder,
    setActiveFolder,
    newFolderName,
    setNewFolderName,
    selectedAnswers,
    setSelectedAnswers,
    showAnswers,
    setShowAnswers,
    quizSubmitted,
    flashcardIndex,
    setFlashcardIndex,
    focusSeconds,
    setFocusSeconds,
    focusRunning,
    setFocusRunning,
    reminderMinutes,
    setReminderMinutes,
    stats,
    preferences,
    onboardingDraft,
    hasResult,
    hasHistory,
    hasDueCards,
    quizScore,
    answeredCount,
    progressToNextLevel,
    achievementBadges,
    activityDays,
    remedialTopics,
    remedialSteps,
    readyScore,
    smartQueue,
    spacedIndex,
    setSpacedIndex,
    showSpacedBack,
    setShowSpacedBack,
    currentSpacedCard,
    dueCards,
    lastWeakTopics,
    regeneratingQuiz,
    createFolder,
    togglePin,
    toggleFavorite,
    updateAnalysisNotes,
    updateOnboardingDraft,
    updatePreferences,
    completeOnboarding,
    updateAnalysisNotesById,
    handleFileUpload,
    analyzeText,
    clearAll,
    loadFromHistory,
    removeHistoryItem,
    changeFlashcard,
    submitQuiz,
    resetQuiz,
    exportAnalysisToTXT,
    exportFlashcardsToCSV,
    reviewCurrentSpacedCard,
    enableNotifications,
    scheduleReminder,
  };
}