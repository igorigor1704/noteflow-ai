import { NextResponse } from "next/server";

type Flashcard = {
  front: string;
  back: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correct: string;
};

type Payload = {
  title?: string;
  summary?: string;
  concepts?: string[];
  questions?: string[];
  flashcards?: Flashcard[];
  previousQuiz?: QuizQuestion[];
};

function sanitize(value: string) {
  return value.replace(/\u0000/g, "").replace(/\s+/g, " ").trim();
}

function safeStringArray(value: unknown, limit: number) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => sanitize(item))
        .filter(Boolean)
        .slice(0, limit)
    : [];
}

function safeFlashcards(value: unknown, limit: number): Flashcard[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const record = item as Record<string, unknown>;
      const front =
        typeof record.front === "string"
          ? sanitize(record.front)
          : typeof record.term === "string"
          ? sanitize(record.term)
          : "";
      const back =
        typeof record.back === "string"
          ? sanitize(record.back)
          : typeof record.definition === "string"
          ? sanitize(record.definition)
          : "";

      if (!front || !back) return null;

      return { front, back };
    })
    .filter((item): item is Flashcard => item !== null)
    .slice(0, limit);
}

function safePreviousQuiz(value: unknown): QuizQuestion[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;

      const question =
        typeof record.question === "string" ? sanitize(record.question) : "";
      const options = Array.isArray(record.options)
        ? record.options
            .filter((x): x is string => typeof x === "string")
            .map((x) => sanitize(x))
            .filter(Boolean)
            .slice(0, 4)
        : [];
      const correct =
        typeof record.correct === "string" ? sanitize(record.correct) : "";

      if (!question || options.length !== 4 || !correct) return null;

      return {
        question,
        options,
        correct,
      };
    })
    .filter((item): item is QuizQuestion => item !== null);
}

function shuffle<T>(items: T[]) {
  const arr = [...items];

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((v) => sanitize(v)).filter(Boolean)));
}

function rotate<T>(items: T[], offset: number) {
  if (items.length === 0) return [];
  const normalized = ((offset % items.length) + items.length) % items.length;
  return items.slice(normalized).concat(items.slice(0, normalized));
}

function previousSignatures(previousQuiz: QuizQuestion[]) {
  return new Set(
    previousQuiz.map(
      (item) =>
        `${item.question.toLowerCase()}::${item.correct.toLowerCase()}`
    )
  );
}

function buildWrongOptionPool(
  flashcards: Flashcard[],
  concepts: string[],
  summary: string
) {
  const summaryBits = summary
    .split(/[.!?]/)
    .map((item) => sanitize(item))
    .filter((item) => item.length >= 18)
    .slice(0, 6);

  return uniqueStrings([
    ...flashcards.map((card) => card.front),
    ...concepts,
    ...summaryBits,
    "Ogólne hasło niezwiązane z sednem materiału",
    "Definicja z innej dziedziny",
    "Pojęcie poboczne, ale nie kluczowe",
    "Opis, który nie wynika z analizowanego materiału",
    "Stwierdzenie zbyt ogólne, by było poprawne",
  ]);
}

function buildQuestionVariants(
  flashcards: Flashcard[],
  concepts: string[],
  questions: string[],
  summary: string
): QuizQuestion[] {
  const wrongPool = buildWrongOptionPool(flashcards, concepts, summary);
  const pool: QuizQuestion[] = [];

  for (const card of flashcards) {
    const correct = card.front;
    const distractors = shuffle(
      wrongPool.filter((item) => item.toLowerCase() !== correct.toLowerCase())
    ).slice(0, 3);

    if (distractors.length === 3) {
      pool.push({
        question: `Które pojęcie najlepiej pasuje do opisu?\n${card.back}`,
        options: shuffle([correct, ...distractors]),
        correct,
      });

      pool.push({
        question: `Jak nazywa się pojęcie opisane w materiale w ten sposób?\n${card.back}`,
        options: shuffle([correct, ...distractors]),
        correct,
      });
    }
  }

  for (const concept of concepts) {
    const correct = concept;
    const distractors = shuffle(
      wrongPool.filter((item) => item.toLowerCase() !== correct.toLowerCase())
    ).slice(0, 3);

    if (distractors.length === 3) {
      pool.push({
        question: `Które pojęcie jest jednym z kluczowych elementów tego materiału?`,
        options: shuffle([correct, ...distractors]),
        correct,
      });
    }
  }

  const summarySentences = summary
    .split(/[.!?]/)
    .map((item) => sanitize(item))
    .filter((item) => item.length >= 20);

  for (const sentence of summarySentences.slice(0, 4)) {
    const correct = sentence;
    const distractors = shuffle(
      wrongPool.filter((item) => item.toLowerCase() !== correct.toLowerCase())
    ).slice(0, 3);

    if (distractors.length === 3) {
      pool.push({
        question: "Które stwierdzenie najlepiej oddaje sens materiału?",
        options: shuffle([correct, ...distractors]),
        correct,
      });
    }
  }

  for (const openQuestion of questions.slice(0, 5)) {
    const distractorPool = uniqueStrings([
      ...concepts,
      ...flashcards.map((card) => card.front),
      "Odpowiedź z innego obszaru tematycznego",
      "Zbyt ogólne stwierdzenie bez związku z materiałem",
      "Pojęcie poboczne, ale nie będące sednem odpowiedzi",
    ]);

    const firstConcept = concepts[0] || flashcards[0]?.front || "Główna idea materiału";
    const secondConcept = concepts[1] || flashcards[1]?.front || "Wątek poboczny";
    const thirdConcept = concepts[2] || flashcards[2]?.front || "Błędna interpretacja";

    const options = shuffle(
      uniqueStrings([
        firstConcept,
        secondConcept,
        thirdConcept,
        ...shuffle(distractorPool).slice(0, 6),
      ])
    ).slice(0, 4);

    if (options.length === 4) {
      const correct = options[0];
      pool.push({
        question: `Która odpowiedź najbardziej pasuje do pytania kontrolnego?\n${openQuestion}`,
        options,
        correct,
      });
    }
  }

  return pool;
}

function buildFallbackQuiz(
  title: string,
  summary: string,
  concepts: string[],
  questions: string[],
  flashcards: Flashcard[],
  previousQuiz: QuizQuestion[]
) {
  const signatures = previousSignatures(previousQuiz);
  const variants = shuffle(
    buildQuestionVariants(flashcards, concepts, questions, summary)
  );

  const fresh = variants.filter(
    (item) =>
      !signatures.has(
        `${item.question.toLowerCase()}::${item.correct.toLowerCase()}`
      )
  );

  const picked = (fresh.length >= 5 ? fresh : variants).slice(0, 5);

  if (picked.length >= 3) {
    return picked;
  }

  const conceptBase = concepts.length > 0 ? concepts : ["Główna idea materiału"];
  const rotated = rotate(conceptBase, Date.now() % Math.max(conceptBase.length, 1));

  return rotated.slice(0, 5).map((concept, index) => {
    const correct = concept;
    const wrong = shuffle(
      uniqueStrings([
        ...conceptBase.filter((item) => item !== correct),
        ...flashcards.map((item) => item.front).filter((item) => item !== correct),
        "Zbyt ogólna odpowiedź",
        "Błędna interpretacja materiału",
        "Pojęcie z innego zakresu",
      ])
    ).slice(0, 3);

    const options = shuffle([correct, ...wrong]).slice(0, 4);

    return {
      question:
        index % 2 === 0
          ? `Które pojęcie najlepiej wiąże się z tematem: ${title || "analizowany materiał"}?`
          : `Które pojęcie jest najbardziej trafne w kontekście tego materiału?`,
      options,
      correct,
    };
  });
}

async function generateWithOpenAI(
  title: string,
  summary: string,
  concepts: string[],
  questions: string[],
  flashcards: Flashcard[],
  previousQuiz: QuizQuestion[]
) {
  const prompt = `
Jesteś ekspertem od tworzenia quizów dla studentów.

Wygeneruj NOWY zestaw quizowy po polsku na podstawie materiału.
To ma być nowa wersja quizu po resecie, więc unikaj powtarzania poprzednich pytań i poprzednich poprawnych odpowiedzi, jeśli da się tego uniknąć.

Zwróć WYŁĄCZNIE poprawny JSON:
{
  "quiz": [
    {
      "question": "treść pytania",
      "options": ["A", "B", "C", "D"],
      "correct": "jedna z opcji dokładnie taka sama jak w options"
    }
  ]
}

Zasady:
- dokładnie 5 pytań
- każde pytanie ma mieć 4 odpowiedzi
- poprawna odpowiedź ma być merytoryczna
- błędne odpowiedzi mają być wiarygodne, ale niepoprawne
- pytania mają być inne niż poprzednio
- nie dawaj placeholderów
- wszystko po polsku

TYTUŁ:
${title || "Brak tytułu"}

STRESZCZENIE:
${summary || "Brak"}

POJĘCIA:
${concepts.join(" | ") || "Brak"}

PYTANIA KONTROLNE:
${questions.join(" | ") || "Brak"}

FISZKI:
${flashcards
  .map((item) => `${item.front}: ${item.back}`)
  .join(" | ") || "Brak"}

POPRZEDNI QUIZ, KTÓREGO MASZ NIE POWTARZAĆ:
${previousQuiz
  .map(
    (item, index) =>
      `${index + 1}. ${item.question} | poprawna: ${item.correct}`
  )
  .join(" || ") || "Brak"}
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
      temperature: 0.9,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Brak odpowiedzi AI.");
  }

  const parsed = JSON.parse(content) as { quiz?: QuizQuestion[] };

  const quiz = Array.isArray(parsed.quiz)
    ? parsed.quiz
        .filter(
          (item): item is QuizQuestion =>
            Boolean(
              item &&
                typeof item === "object" &&
                typeof item.question === "string" &&
                Array.isArray(item.options) &&
                item.options.length === 4 &&
                item.options.every(
                  (option) => typeof option === "string" && sanitize(option)
                ) &&
                typeof item.correct === "string"
            )
        )
        .map((item) => {
          const options = item.options.map((option) => sanitize(option));
          const question = sanitize(item.question);
          const correct = options.includes(sanitize(item.correct))
            ? sanitize(item.correct)
            : options[0];

          return {
            question,
            options,
            correct,
          };
        })
        .filter((item) => item.question && item.options.length === 4 && item.correct)
        .slice(0, 5)
    : [];

  return quiz;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    const title =
      typeof body.title === "string" ? sanitize(body.title).slice(0, 120) : "";
    const summary =
      typeof body.summary === "string" ? sanitize(body.summary).slice(0, 3000) : "";
    const concepts = safeStringArray(body.concepts, 10);
    const questions = safeStringArray(body.questions, 8);
    const flashcards = safeFlashcards(body.flashcards, 10);
    const previousQuiz = safePreviousQuiz(body.previousQuiz);

    if (!summary && concepts.length === 0 && flashcards.length === 0) {
      return NextResponse.json(
        { error: "Brak danych do wygenerowania nowego quizu." },
        { status: 400 }
      );
    }

    const fallbackQuiz = buildFallbackQuiz(
      title,
      summary,
      concepts,
      questions,
      flashcards,
      previousQuiz
    );

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        quiz: fallbackQuiz,
        fallback: true,
      });
    }

    try {
      const generated = await generateWithOpenAI(
        title,
        summary,
        concepts,
        questions,
        flashcards,
        previousQuiz
      );

      return NextResponse.json({
        quiz: generated.length === 5 ? generated : fallbackQuiz,
        fallback: generated.length !== 5,
      });
    } catch (error) {
      console.error("Quiz regenerate fallback:", error);

      return NextResponse.json({
        quiz: fallbackQuiz,
        fallback: true,
      });
    }
  } catch (error) {
    console.error("Quiz regenerate route error:", error);

    return NextResponse.json(
      { error: "Nie udało się wygenerować nowego quizu." },
      { status: 500 }
    );
  }
}