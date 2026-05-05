"use client";

import { useMemo, useState } from "react";

type OralExamAnalysisInput = {
  title?: string;
  summary?: string;
  keyTakeaways?: string[];
  concepts?: string[];
  studyPlan?: string[];
};

type OralExamPanelProps = {
  analysis: OralExamAnalysisInput;
};

type EvaluationResult = {
  score: number;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  improvedAnswer: string;
  tips: string[];
};

function clampScore(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getScoreMeta(score: number) {
  if (score < 40) {
    return {
      label: "Słaba odpowiedź",
      badgeClass:
        "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
      panelClass:
        "border-rose-200 bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10",
    };
  }

  if (score < 70) {
    return {
      label: "Średnia odpowiedź",
      badgeClass:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
      panelClass:
        "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
    };
  }

  if (score < 90) {
    return {
      label: "Dobra odpowiedź",
      badgeClass:
        "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
      panelClass:
        "border-sky-200 bg-sky-50 dark:border-sky-500/20 dark:bg-sky-500/10",
    };
  }

  return {
    label: "Bardzo dobra odpowiedź",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    panelClass:
      "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
  };
}

export default function OralExamPanel({ analysis }: OralExamPanelProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const score = clampScore(result?.score);
  const scoreMeta = useMemo(() => getScoreMeta(score), [score]);

  const canGenerate =
    Boolean(analysis.summary?.trim()) ||
    (Array.isArray(analysis.keyTakeaways) && analysis.keyTakeaways.length > 0) ||
    (Array.isArray(analysis.concepts) && analysis.concepts.length > 0);

  const handleGenerateQuestion = async () => {
    if (!canGenerate) {
      setError("Brakuje danych analizy, żeby wygenerować pytanie ustne.");
      return;
    }

    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/oral-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "generate-question",
          title: analysis.title ?? "",
          summary: analysis.summary ?? "",
          keyTakeaways: analysis.keyTakeaways ?? [],
          concepts: analysis.concepts ?? [],
        }),
      });

      const data = (await res.json()) as {
        question?: string;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error || "Nie udało się wygenerować pytania.");
      }

      setQuestion(
        typeof data.question === "string" && data.question.trim()
          ? data.question.trim()
          : "Wyjaśnij najważniejsze zagadnienia wynikające z tego materiału."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nie udało się wygenerować pytania."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!question.trim()) {
      setError("Najpierw wygeneruj pytanie.");
      return;
    }

    if (!answer.trim()) {
      setError("Najpierw wpisz odpowiedź.");
      return;
    }

    setEvaluating(true);
    setError("");

    try {
      const res = await fetch("/api/oral-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "evaluate-answer",
          title: analysis.title ?? "",
          summary: analysis.summary ?? "",
          keyTakeaways: analysis.keyTakeaways ?? [],
          concepts: analysis.concepts ?? [],
          question,
          answer,
        }),
      });

      const data = (await res.json()) as {
        score?: number;
        verdict?: string;
        strengths?: string[];
        weaknesses?: string[];
        improvedAnswer?: string;
        tips?: string[];
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error || "Nie udało się ocenić odpowiedzi.");
      }

      setResult({
        score: clampScore(data.score),
        verdict:
          typeof data.verdict === "string" && data.verdict.trim()
            ? data.verdict.trim()
            : "Odpowiedź wymaga dopracowania.",
        strengths: Array.isArray(data.strengths)
          ? data.strengths.filter((item): item is string => typeof item === "string")
          : [],
        weaknesses: Array.isArray(data.weaknesses)
          ? data.weaknesses.filter((item): item is string => typeof item === "string")
          : [],
        improvedAnswer:
          typeof data.improvedAnswer === "string"
            ? data.improvedAnswer
            : "",
        tips: Array.isArray(data.tips)
          ? data.tips.filter((item): item is string => typeof item === "string")
          : [],
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nie udało się ocenić odpowiedzi."
      );
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <section className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                Oral Exam
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                prawdziwy tryb odpowiedzi ustnej
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100 md:text-3xl">
              Wygeneruj pytanie i oceń swoją odpowiedź
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Ten moduł ma działać jak realny trening: najpierw pytanie, potem
              Twoja odpowiedź, a na końcu ocena, mocne strony i gotowa lepsza
              wersja odpowiedzi.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerateQuestion}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? "Generowanie..." : "Wygeneruj pytanie"}
            </button>

            <button
              type="button"
              onClick={handleEvaluateAnswer}
              disabled={evaluating || !question.trim() || !answer.trim()}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950"
            >
              {evaluating ? "Ocenianie..." : "Oceń odpowiedź"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Pytanie
          </p>
          <h4 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
            Pytanie egzaminacyjne
          </h4>

          <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-base leading-8 text-slate-800 dark:text-slate-200">
              {question.trim()
                ? question
                : "Kliknij „Wygeneruj pytanie”, a tu pojawi się sensowne pytanie ustne na podstawie materiału."}
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="oral-answer"
              className="mb-3 block text-base font-semibold text-slate-950 dark:text-slate-100"
            >
              Twoja odpowiedź
            </label>

            <textarea
              id="oral-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={9}
              placeholder="Wpisz odpowiedź tak, jak odpowiadałabyś na egzaminie ustnym."
              className="w-full rounded-[24px] border border-slate-300 bg-white px-5 py-4 text-base leading-7 text-slate-950 outline-none transition focus:border-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Im pełniejsza i bardziej uporządkowana odpowiedź, tym lepsza ocena.
            </p>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Wynik
            </p>
            <h4 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
              Ocena odpowiedzi
            </h4>

            <div
              className={`mt-5 rounded-[24px] border p-5 ${scoreMeta.panelClass}`}
            >
              <div className="flex flex-wrap items-end gap-4">
                <div className="text-5xl font-black tracking-tight text-slate-950 dark:text-slate-100">
                  {result ? score : "--"}
                  <span className="text-2xl text-slate-500 dark:text-slate-400">
                    /100
                  </span>
                </div>

                {result ? (
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${scoreMeta.badgeClass}`}
                  >
                    {scoreMeta.label}
                  </span>
                ) : null}
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
                {result?.verdict ||
                  "Po ocenie odpowiedzi tutaj pojawi się krótki werdykt egzaminacyjny."}
              </p>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h5 className="text-lg font-bold text-slate-950 dark:text-slate-100">
                Mocne strony
              </h5>

              {result?.strengths?.length ? (
                <ul className="mt-4 space-y-3">
                  {result.strengths.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        +
                      </span>
                      <span className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Tu pojawią się najmocniejsze elementy Twojej odpowiedzi.
                </p>
              )}
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h5 className="text-lg font-bold text-slate-950 dark:text-slate-100">
                Co poprawić
              </h5>

              {result?.weaknesses?.length ? (
                <ul className="mt-4 space-y-3">
                  {result.weaknesses.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                        !
                      </span>
                      <span className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Tu pojawią się braki i rzeczy do poprawy.
                </p>
              )}
            </section>
          </div>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h5 className="text-lg font-bold text-slate-950 dark:text-slate-100">
              Lepsza przykładowa odpowiedź
            </h5>

            <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm leading-8 text-slate-700 dark:text-slate-300">
                {result?.improvedAnswer ||
                  "Po ocenie odpowiedzi tutaj pojawi się lepsza, bardziej egzaminacyjna wersja odpowiedzi."}
              </p>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h5 className="text-lg font-bold text-slate-950 dark:text-slate-100">
              Konkretne wskazówki
            </h5>

            {result?.tips?.length ? (
              <ul className="mt-4 space-y-3">
                {result.tips.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Tu pojawią się praktyczne wskazówki, jak odpowiadać lepiej.
              </p>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}