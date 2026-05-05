"use client";

import { useMemo, useState } from "react";
import type { SavedAnalysis } from "../_lib/types";
import UpgradeModal from "../../components/UpgradeModal";
import { usePro } from "../../lib/pro/usePro";

type CoachMode = "simplify" | "hard-questions" | "oral-exam" | "quick-revision";

type AnalysisCoachPanelProps = {
  analysis: SavedAnalysis;
};

const modes: Array<{
  id: CoachMode;
  label: string;
  proOnly?: boolean;
}> = [
  { id: "simplify", label: "Wyjaśnij prościej" },
  { id: "hard-questions", label: "Trudniejsze pytania", proOnly: true },
  { id: "oral-exam", label: "Egzamin ustny", proOnly: true },
  { id: "quick-revision", label: "Szybka powtórka", proOnly: true },
];

function buildPrompt(mode: CoachMode, analysis: SavedAnalysis) {
  const result = analysis.result;

  if (mode === "simplify") {
    return `
Na podstawie poniższego materiału wyjaśnij temat prostszym językiem po polsku.

Zwróć odpowiedź w takiej strukturze:
1. O co chodzi w tym temacie
2. 3-5 najważniejszych punktów
3. Prosty przykład
4. Czego nie pomylić na egzaminie

TYTUŁ:
${analysis.title}

STRESZCZENIE:
${result.summary}

KLUCZOWE WNIOSKI:
${result.keyTakeaways.join(" | ")}

POJĘCIA:
${result.concepts.join(" | ")}
    `.trim();
  }

  if (mode === "hard-questions") {
    return `
Na podstawie tego materiału przygotuj po polsku:
1. 5 trudniejszych pytań sprawdzających zrozumienie
2. do każdego pytania krótki komentarz: czego ono sprawdza

Zachowaj czytelny układ.

TYTUŁ:
${analysis.title}

STRESZCZENIE:
${result.summary}

KLUCZOWE WNIOSKI:
${result.keyTakeaways.join(" | ")}

POJĘCIA:
${result.concepts.join(" | ")}
    `.trim();
  }

  if (mode === "oral-exam") {
    return `
Na podstawie tego materiału przygotuj po polsku mini symulację egzaminu ustnego.

Zwróć:
1. 4 pytania egzaminacyjne
2. do każdego pytania: co trzeba powiedzieć, żeby odpowiedź była mocna
3. najczęstsze błędy

Zachowaj czytelny układ.

TYTUŁ:
${analysis.title}

STRESZCZENIE:
${result.summary}

KLUCZOWE WNIOSKI:
${result.keyTakeaways.join(" | ")}

POJĘCIA:
${result.concepts.join(" | ")}
    `.trim();
  }

  return `
Na podstawie tego materiału przygotuj po polsku szybką powtórkę na 10-15 minut.

Zwróć:
1. plan krok po kroku
2. co powtórzyć najpierw
3. jakie pytania zadać sobie na koniec
4. co jest najważniejsze do zapamiętania

TYTUŁ:
${analysis.title}

STRESZCZENIE:
${result.summary}

KLUCZOWE WNIOSKI:
${result.keyTakeaways.join(" | ")}

POJĘCIA:
${result.concepts.join(" | ")}
  `.trim();
}

function fallbackOutput(mode: CoachMode, analysis: SavedAnalysis) {
  const result = analysis.result;

  if (mode === "simplify") {
    return [
      "1. O co chodzi w tym temacie",
      result.summary || "Najpierw trzeba zrozumieć główną ideę materiału.",
      "",
      "2. Najważniejsze punkty",
      ...result.keyTakeaways.slice(0, 5).map((item, index) => `${index + 1}. ${item}`),
      "",
      "3. Prosty przykład",
      "Spróbuj wyjaśnić ten temat własnymi słowami tak, jakbyś tłumaczyła go komuś z roku.",
      "",
      "4. Czego nie pomylić na egzaminie",
      `Zwróć uwagę na pojęcia: ${result.concepts.slice(0, 4).join(", ") || "brak danych"}.`,
    ].join("\n");
  }

  if (mode === "hard-questions") {
    return result.concepts
      .slice(0, 5)
      .map(
        (concept, index) =>
          `${index + 1}. Jak wyjaśnisz pojęcie „${concept}” i pokażesz jego znaczenie w całym materiale?`
      )
      .join("\n");
  }

  if (mode === "oral-exam") {
    return [
      ...result.questions
        .slice(0, 4)
        .map((question, index) => `${index + 1}. Pytanie ustne: ${question}`),
      "",
      "Na egzaminie odpowiadaj w schemacie: definicja → rozwinięcie → przykład → wniosek.",
    ].join("\n");
  }

  return [
    "1. Przeczytaj streszczenie.",
    "2. Powtórz 3-5 najważniejszych pojęć.",
    "3. Odpowiedz na 2 pytania z materiału.",
    "4. Przejrzyj fiszki.",
    "5. Powiedz cały temat własnymi słowami w 3-4 zdaniach.",
  ].join("\n");
}

export default function AnalysisCoachPanel({
  analysis,
}: AnalysisCoachPanelProps) {
  const [mode, setMode] = useState<CoachMode>("simplify");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usedFallback, setUsedFallback] = useState(false);
  const { isPro, hydrated } = usePro();

  const currentMode = useMemo(
    () => modes.find((item) => item.id === mode),
    [mode]
  );

  const generateOutput = async (nextMode: CoachMode) => {
    setLoading(true);
    setError("");
    setUsedFallback(false);

    const prompt = buildPrompt(nextMode, analysis);

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: prompt,
        }),
      });

      const data = (await res.json()) as {
        answer?: string;
        error?: string;
        fallback?: boolean;
      };

      if (!res.ok) {
        throw new Error(data.error || "Nie udało się wygenerować odpowiedzi AI Coach.");
      }

      const nextOutput =
        typeof data.answer === "string" && data.answer.trim()
          ? data.answer.trim()
          : fallbackOutput(nextMode, analysis);

      setOutput(nextOutput);
      setUsedFallback(Boolean(data.fallback));
    } catch (err) {
      setOutput(fallbackOutput(nextMode, analysis));
      setUsedFallback(true);
      setError(
        err instanceof Error
          ? err.message
          : "Nie udało się wygenerować odpowiedzi AI Coach."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (nextMode: CoachMode, proOnly?: boolean) => {
    if (proOnly && hydrated && !isPro) {
      setShowUpgrade(true);
      return;
    }

    setMode(nextMode);
    void generateOutput(nextMode);
  };

  return (
    <>
      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        title="AI Coach w pełnej wersji jest w planie Pro"
        description="Tryby Trudniejsze pytania, Egzamin ustny i Szybka powtórka są dostępne w NoteFlow Pro."
        featureName="Zaawansowane tryby AI Coach"
      />

      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              AI tutor workspace
            </p>
            <h2 className="text-2xl font-semibold">Panel trenera nauki</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Ten moduł ma realnie pomagać wrócić do materiału, a nie tylko
              przepisywać to samo w innej formie.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Active mode
            </p>
            <p className="mt-2 text-lg font-semibold">
              {currentMode?.label ?? "AI Coach"}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {modes.map((item) => {
            const locked = item.proOnly && hydrated && !isPro;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleModeChange(item.id, item.proOnly)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  mode === item.id
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
                {locked ? " · Pro" : ""}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => void generateOutput(mode)}
            disabled={loading}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            {loading ? "Generowanie..." : "Odśwież"}
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            {error}
          </div>
        ) : null}

        {usedFallback ? (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            Pokazuję wersję awaryjną, żeby panel nie był pusty.
          </div>
        ) : null}

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-xl font-semibold">
            {currentMode?.label ?? "Wynik AI Coach"}
          </h3>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            {loading ? (
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                Generuję odpowiedź AI Coach...
              </p>
            ) : output ? (
              <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">
                {output}
              </pre>
            ) : (
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                Wybierz tryb, a AI Coach przygotuje sensowną pomoc do tego materiału.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}