import { NextResponse } from "next/server";

type OralExamMode = "generate-question" | "evaluate-answer";

type OralExamRequestBody = {
  mode?: OralExamMode;
  title?: string;
  summary?: string;
  keyTakeaways?: string[];
  concepts?: string[];
  question?: string;
  answer?: string;
};

const MAX_TEXT_LENGTH = 3000;

function sanitize(value: string) {
  return value.replace(/\u0000/g, "").replace(/\s+/g, " ").trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as OralExamRequestBody;

    const mode = body.mode;
    const title =
      typeof body.title === "string" ? sanitize(body.title).slice(0, 120) : "";
    const summary =
      typeof body.summary === "string"
        ? sanitize(body.summary).slice(0, MAX_TEXT_LENGTH)
        : "";

    const keyTakeaways = Array.isArray(body.keyTakeaways)
      ? body.keyTakeaways
          .filter((item): item is string => typeof item === "string")
          .map((item) => sanitize(item))
          .filter(Boolean)
          .slice(0, 8)
      : [];

    const concepts = Array.isArray(body.concepts)
      ? body.concepts
          .filter((item): item is string => typeof item === "string")
          .map((item) => sanitize(item))
          .filter(Boolean)
          .slice(0, 10)
      : [];

    const question =
      typeof body.question === "string"
        ? sanitize(body.question).slice(0, MAX_TEXT_LENGTH)
        : "";

    const answer =
      typeof body.answer === "string"
        ? sanitize(body.answer).slice(0, MAX_TEXT_LENGTH)
        : "";

    if (!mode || !["generate-question", "evaluate-answer"].includes(mode)) {
      return NextResponse.json(
        { error: "Nieprawidłowy tryb oral exam." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Brak OPENAI_API_KEY w .env.local" },
        { status: 500 }
      );
    }

    if (mode === "generate-question") {
      if (!summary && keyTakeaways.length === 0 && concepts.length === 0) {
        return NextResponse.json(
          { error: "Brak danych do wygenerowania pytania." },
          { status: 400 }
        );
      }

      const prompt = `
Jesteś egzaminatorem akademickim.

Na podstawie materiału wygeneruj 1 sensowne pytanie ustne po polsku.
Pytanie ma:
- brzmieć naturalnie
- sprawdzać zrozumienie materiału
- nadawać się na egzamin ustny
- nie być zbyt ogólne ani zbyt banalne

Zwróć WYŁĄCZNIE JSON:
{
  "question": "..."
}

TYTUŁ:
${title || "Brak tytułu"}

STRESZCZENIE:
${summary || "Brak"}

KLUCZOWE WNIOSKI:
${keyTakeaways.length ? keyTakeaways.join(" | ") : "Brak"}

POJĘCIA:
${concepts.length ? concepts.join(" | ") : "Brak"}
`.trim();

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          temperature: 0.6,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: `Błąd generowania pytania: ${response.status} ${errorText}` },
          { status: 500 }
        );
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        return NextResponse.json(
          { error: "AI nie zwróciło pytania." },
          { status: 500 }
        );
      }

      const parsed = JSON.parse(content);
      const generatedQuestion =
        typeof parsed.question === "string" ? sanitize(parsed.question) : "";

      return NextResponse.json({
        question:
          generatedQuestion ||
          "Wyjaśnij najważniejsze zagadnienia wynikające z tego materiału.",
      });
    }

    if (!question) {
      return NextResponse.json(
        { error: "Brak pytania do oceny odpowiedzi." },
        { status: 400 }
      );
    }

    if (!answer) {
      return NextResponse.json(
        { error: "Brak odpowiedzi użytkownika." },
        { status: 400 }
      );
    }

    const prompt = `
Jesteś egzaminatorem akademickim.

Oceń odpowiedź studenta po polsku.
Bądź wymagający, ale pomocny.
Zwróć WYŁĄCZNIE poprawny JSON:

{
  "score": 0,
  "verdict": "krótka ocena ogólna",
  "strengths": ["mocna strona 1", "mocna strona 2"],
  "weaknesses": ["słabość 1", "słabość 2"],
  "improvedAnswer": "krótka, lepsza wersja odpowiedzi",
  "tips": ["wskazówka 1", "wskazówka 2", "wskazówka 3"]
}

Zasady:
- score ma być od 0 do 100
- verdict krótki i konkretny
- improvedAnswer ma być lepszą przykładową odpowiedzią
- tips mają być praktyczne
- wszystko po polsku

PYTANIE:
${question}

ODPOWIEDŹ STUDENTA:
${answer}

KONTEKST MATERIAŁU:
Tytuł: ${title || "Brak"}
Streszczenie: ${summary || "Brak"}
Kluczowe wnioski: ${keyTakeaways.length ? keyTakeaways.join(" | ") : "Brak"}
Pojęcia: ${concepts.length ? concepts.join(" | ") : "Brak"}
`.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        temperature: 0.4,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Błąd oceny odpowiedzi: ${response.status} ${errorText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI nie zwróciło oceny." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);

    return NextResponse.json({
      score:
        typeof parsed.score === "number"
          ? Math.max(0, Math.min(100, parsed.score))
          : 50,
      verdict:
        typeof parsed.verdict === "string"
          ? parsed.verdict
          : "Odpowiedź wymaga dopracowania.",
      strengths: Array.isArray(parsed.strengths)
        ? parsed.strengths.filter((x: unknown) => typeof x === "string").slice(0, 4)
        : [],
      weaknesses: Array.isArray(parsed.weaknesses)
        ? parsed.weaknesses.filter((x: unknown) => typeof x === "string").slice(0, 4)
        : [],
      improvedAnswer:
        typeof parsed.improvedAnswer === "string"
          ? parsed.improvedAnswer
          : "Spróbuj odpowiedzieć bardziej precyzyjnie i uporządkowanie.",
      tips: Array.isArray(parsed.tips)
        ? parsed.tips.filter((x: unknown) => typeof x === "string").slice(0, 5)
        : [],
    });
  } catch (error) {
    console.error("Oral exam route error:", error);

    return NextResponse.json(
      { error: "Nie udało się obsłużyć oral exam." },
      { status: 500 }
    );
  }
}