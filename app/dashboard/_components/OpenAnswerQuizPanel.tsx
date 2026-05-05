"use client";

import { useMemo, useState } from "react";

type RawQuestion = {
  question?: string;
  prompt?: string;
  title?: string;
  bestAnswer?: string;
  partialAnswer?: string;
  generalAnswer?: string;
  wrongAnswer?: string;
  answer?: string;
  sampleAnswer?: string;
};

type Evaluation = {
  score: number;
  label: string;
  feedback: string;
};

type OpenAnswerQuizPanelProps = {
  questions: RawQuestion[] | undefined;
  showAnswers: boolean;
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitWords(value: string) {
  return normalizeText(value)
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => item.length > 2);
}

function uniqueWords(value: string) {
  return Array.from(new Set(splitWords(value)));
}

function similarityByWords(userAnswer: string, reference: string) {
  const userWords = uniqueWords(userAnswer);
  const refWords = uniqueWords(reference);

  if (!userWords.length || !refWords.length) {
    return 0;
  }

  const refSet = new Set(refWords);
  const matched = userWords.filter((word) => refSet.has(word)).length;

  return matched / refWords.length;
}

function evaluateAnswer(question: RawQuestion, userAnswer: string): Evaluation {
  const trimmed = userAnswer.trim();

  if (!trimmed) {
    return {
      score: 0,
      label: "Brak odpowiedzi",
      feedback: "Nie wpisano odpowiedzi.",
    };
  }

  const bestReference =
    question.bestAnswer || question.answer || question.sampleAnswer || "";
  const partialReference = question.partialAnswer || "";
  const generalReference = question.generalAnswer || "";
  const wrongReference = question.wrongAnswer || "";

  const bestScore = bestReference
    ? similarityByWords(trimmed, bestReference)
    : 0;
  const partialScore = partialReference
    ? similarityByWords(trimmed, partialReference)
    : 0;
  const generalScore = generalReference
    ? similarityByWords(trimmed, generalReference)
    : 0;
  const wrongScore = wrongReference
    ? similarityByWords(trimmed, wrongReference)
    : 0;

  const userWordCount = splitWords(trimmed).length;

  if (wrongScore > 0.6 && wrongScore > bestScore) {
    return {
      score: 0,
      label: "Niepoprawna",
      feedback:
        "Odpowiedź jest nietrafiona albo zawiera błędne informacje względem materiału.",
    };
  }

  if (bestScore >= 0.7) {
    return {
      score: 100,
      label: "Bardzo dobra",
      feedback:
        "Odpowiedź jest trafna i zawiera najważniejsze elementy merytoryczne.",
    };
  }

  if (bestScore >= 0.45 || partialScore >= 0.55) {
    return {
      score: 60,
      label: "Częściowo poprawna",
      feedback:
        "Odpowiedź jest częściowo poprawna, ale brakuje części kluczowych informacji albo precyzji.",
    };
  }

  if (generalScore >= 0.35 || userWordCount < 8) {
    return {
      score: 30,
      label: "Zbyt ogólna",
      feedback:
        "Odpowiedź jest zbyt krótka lub zbyt ogólna. Warto dodać więcej konkretów z materiału.",
    };
  }

  return {
    score: 15,
    label: "Słaba",
    feedback:
      "Odpowiedź tylko w niewielkim stopniu pokrywa się z zakresem pytania.",
  };
}

export default function OpenAnswerQuizPanel({
  questions,
  showAnswers,
}: OpenAnswerQuizPanelProps) {
  const safeQuestions = useMemo(
    () => (Array.isArray(questions) ? questions : []),
    [questions]
  );

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const evaluations = useMemo(() => {
    return safeQuestions.map((question, index) => {
      const answer = answers[index] ?? "";
      return evaluateAnswer(question, answer);
    });
  }, [answers, safeQuestions]);

  const checkedCount = Object.values(checked).filter(Boolean).length;

  const totalScore = useMemo(() => {
    if (!safeQuestions.length) {
      return 0;
    }

    return safeQuestions.reduce((sum, _, index) => {
      if (!checked[index]) {
        return sum;
      }
      return sum + evaluations[index].score;
    }, 0);
  }, [checked, evaluations, safeQuestions]);

  const averageScore =
    checkedCount > 0 ? Math.round(totalScore / checkedCount) : 0;

  if (!safeQuestions.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
        Brak pytań do quizu.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
          Sprawdzone: {checkedCount}/{safeQuestions.length}
        </div>

        <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          Średni wynik: {averageScore}%
        </div>
      </div>

      {safeQuestions.map((question, index) => {
        const questionText =
          question.question || question.prompt || question.title || `Pytanie ${index + 1}`;

        const evaluation = evaluations[index];
        const isChecked = Boolean(checked[index]);
        const bestAnswer =
          question.bestAnswer || question.answer || question.sampleAnswer || "";

        return (
          <article
            key={`${questionText}-${index}`}
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-slate-500">
                Pytanie {index + 1}
              </p>
              <h3 className="text-xl font-semibold leading-8 text-slate-900">
                {questionText}
              </h3>
            </div>

            <textarea
              value={answers[index] ?? ""}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [index]: e.target.value,
                }))
              }
              rows={5}
              placeholder="Wpisz swoją odpowiedź własnymi słowami..."
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-slate-500"
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setChecked((prev) => ({
                    ...prev,
                    [index]: true,
                  }))
                }
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Sprawdź odpowiedź
              </button>

              <button
                type="button"
                onClick={() => {
                  setAnswers((prev) => ({
                    ...prev,
                    [index]: "",
                  }));
                  setChecked((prev) => ({
                    ...prev,
                    [index]: false,
                  }));
                }}
                className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Wyczyść
              </button>
            </div>

            {isChecked ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                    Wynik: {evaluation.score}%
                  </span>
                  <span className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                    Ocena: {evaluation.label}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {evaluation.feedback}
                </p>
              </div>
            ) : null}

            {showAnswers && bestAnswer ? (
              <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="text-sm font-semibold text-indigo-900">
                  Wzorcowa odpowiedź
                </p>
                <p className="mt-2 text-sm leading-6 text-indigo-950">
                  {bestAnswer}
                </p>
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}