import { NextResponse } from "next/server";

const MAX_QUESTION_LENGTH = 3000;
const MIN_QUESTION_LENGTH = 5;

function sanitize(value: string) {
  return value.replace(/\u0000/g, "").replace(/\s+/g, " ").trim();
}

function fallbackTutorAnswer(question: string) {
  return [
    "1. Krótkie wyjaśnienie",
    `To pytanie dotyczy zagadnienia: ${question}. Najpierw trzeba nazwać główny temat i wyjaśnić go prostymi słowami.`,
    "",
    "2. Najważniejsze punkty",
    "- Zdefiniuj główne pojęcie lub problem.",
    "- Pokaż najważniejsze elementy i zależności.",
    "- Dodaj krótki wniosek, po co to jest ważne.",
    "",
    "3. Prosty przykład",
    "Najłatwiej myśleć o tym jak o odpowiedzi egzaminacyjnej: definicja, rozwinięcie, przykład i krótki wniosek na koniec.",
    "",
    "4. Na co uważać na egzaminie",
    "- Nie odpowiadaj zbyt ogólnie.",
    "- Nie urywaj odpowiedzi po jednym zdaniu.",
    "- Używaj pojęć z materiału i pokazuj, że rozumiesz sens tematu.",
  ].join("\n");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question =
      typeof body.question === "string" ? sanitize(body.question) : "";

    if (!question) {
      return NextResponse.json({ error: "Brak pytania." }, { status: 400 });
    }

    if (question.length < MIN_QUESTION_LENGTH) {
      return NextResponse.json(
        { error: "Pytanie jest za krótkie." },
        { status: 400 }
      );
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json(
        {
          error: `Pytanie jest za długie. Maksymalnie ${MAX_QUESTION_LENGTH} znaków.`,
        },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        answer: fallbackTutorAnswer(question),
        fallback: true,
      });
    }

    const prompt = `
Jesteś bardzo dobrym korepetytorem akademickim.

Odpowiadaj po polsku.
Wyjaśnij temat jasno, konkretnie i prostym językiem.
Struktura odpowiedzi:
1. Krótkie wyjaśnienie
2. Najważniejsze punkty
3. Prosty przykład
4. Na co uważać na egzaminie

PYTANIE:
${question}
`.trim();

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.4,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      return NextResponse.json({
        answer:
          data.choices?.[0]?.message?.content?.trim() ??
          fallbackTutorAnswer(question),
        fallback: false,
      });
    } catch (error) {
      console.error("AI tutor fallback:", error);

      return NextResponse.json({
        answer: fallbackTutorAnswer(question),
        fallback: true,
      });
    }
  } catch (error) {
    console.error("AI tutor error:", error);

    return NextResponse.json({ error: "Błąd AI." }, { status: 500 });
  }
}