import { NextResponse } from "next/server";

type AnalyzePayload = {
  text?: string;
  title?: string;
};

type Flashcard = {
  id: string;
  term: string;
  definition: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correct: string;
};

type AnalyzeResponse = {
  summary: string;
  keyTakeaways: string[];
  concepts: string[];
  questions: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  studyPlan: string[];
};

const MAX_TEXT_LENGTH = 200000;
const MIN_TEXT_LENGTH = 120;

const STOPWORDS = new Set([
  "oraz",
  "które",
  "który",
  "która",
  "których",
  "którym",
  "której",
  "przez",
  "także",
  "takich",
  "takiego",
  "takiej",
  "takim",
  "będzie",
  "mogą",
  "może",
  "można",
  "został",
  "została",
  "zostały",
  "jako",
  "jego",
  "jej",
  "ich",
  "tego",
  "tej",
  "tym",
  "więc",
  "jednak",
  "albo",
  "czyli",
  "czy",
  "jest",
  "są",
  "być",
  "był",
  "była",
  "było",
  "były",
  "dla",
  "nad",
  "pod",
  "przy",
  "też",
  "nie",
  "tak",
  "się",
  "ten",
  "ta",
  "to",
  "tych",
  "te",
  "jak",
  "lub",
  "aby",
  "gdy",
  "gdzie",
  "wraz",
  "m.in",
  "np",
  "itd",
  "bardzo",
  "bardziej",
  "mniej",
  "wiele",
  "kilka",
  "jeden",
  "jedna",
  "jedno",
]);

function makeId() {
  return crypto.randomUUID();
}

function sanitizeText(value: string) {
  return value.replace(/\u0000/g, "").replace(/\s+/g, " ").trim();
}

function splitIntoSentences(rawText: string) {
  return rawText
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 20);
}

function normalizeWord(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .trim();
}

function titleCase(value: string) {
  return value
    .split(" ")
    .map((part) =>
      part ? part.charAt(0).toUpperCase() + part.slice(1) : part
    )
    .join(" ");
}

function tokenize(rawText: string) {
  return rawText
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .map(normalizeWord)
    .filter(Boolean);
}

function isMeaningfulWord(word: string) {
  return word.length >= 4 && !STOPWORDS.has(word) && !/^\d+$/.test(word);
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
}

function safeStringArray(value: unknown, limit: number) {
  if (!Array.isArray(value)) return [];

  return uniqueStrings(
    value.filter((item): item is string => typeof item === "string")
  ).slice(0, limit);
}

function extractConcepts(rawText: string, limit = 8) {
  const tokens = tokenize(rawText);

  const singleCounts = new Map<string, number>();
  const phraseCounts = new Map<string, number>();

  for (let i = 0; i < tokens.length; i += 1) {
    const w1 = tokens[i];
    const w2 = tokens[i + 1];
    const w3 = tokens[i + 2];

    if (isMeaningfulWord(w1)) {
      singleCounts.set(w1, (singleCounts.get(w1) ?? 0) + 1);
    }

    if (w1 && w2 && isMeaningfulWord(w1) && isMeaningfulWord(w2)) {
      const bigram = `${w1} ${w2}`;
      phraseCounts.set(bigram, (phraseCounts.get(bigram) ?? 0) + 1);
    }

    if (
      w1 &&
      w2 &&
      w3 &&
      isMeaningfulWord(w1) &&
      isMeaningfulWord(w2) &&
      isMeaningfulWord(w3)
    ) {
      const trigram = `${w1} ${w2} ${w3}`;
      phraseCounts.set(trigram, (phraseCounts.get(trigram) ?? 0) + 1);
    }
  }

  const topPhrases = Array.from(phraseCounts.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return b[0].length - a[0].length;
    })
    .map(([phrase]) => phrase)
    .filter((phrase) => phrase.split(" ").length >= 2)
    .slice(0, limit);

  const topSingles = Array.from(singleCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, limit * 2);

  const merged = [...topPhrases];

  for (const word of topSingles) {
    if (merged.length >= limit) break;

    if (!merged.some((phrase) => phrase.includes(word))) {
      merged.push(word);
    }
  }

  return merged.slice(0, limit);
}

function toFlashcard(term: string, definition: string): Flashcard {
  return {
    id: makeId(),
    term: term.trim(),
    definition: definition.trim(),
  };
}

function findSentenceForConcept(sentences: string[], concept: string) {
  const normalizedConcept = concept
    .toLowerCase()
    .split(" ")
    .map(normalizeWord)
    .filter(Boolean);

  const match = sentences.find((sentence) => {
    const lower = sentence.toLowerCase();
    return normalizedConcept.every((part) => lower.includes(part));
  });

  return match || "";
}

function buildDefinitionFromSentence(sentence: string, concept: string) {
  if (!sentence) {
    return `Pojęcie „${titleCase(
      concept
    )}” jest jednym z ważnych elementów materiału. Wyjaśnij jego znaczenie i zastosowanie.`;
  }

  const cleaned = sentence.replace(/\s+/g, " ").trim();

  if (cleaned.length <= 220) {
    return cleaned;
  }

  return `${cleaned.slice(0, 217).trim()}...`;
}

function shuffle<T>(items: T[]) {
  const arr = [...items];

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function buildFallbackQuestions(
  summary: string,
  concepts: string[],
  sentences: string[]
) {
  const generated: string[] = [];

  if (summary) {
    generated.push(
      "Jak własnymi słowami streścić najważniejszą myśl materiału?"
    );
  }

  for (const concept of concepts.slice(0, 4)) {
    generated.push(`Wyjaśnij własnymi słowami pojęcie: ${titleCase(concept)}.`);
  }

  if (sentences.length > 0) {
    const first = sentences[0].replace(/[.!?]+$/g, "").trim();
    generated.push(`Co oznacza w praktyce stwierdzenie: „${first}”?`);
  }

  return uniqueStrings(generated).slice(0, 6);
}

function buildWrongOptionPool(flashcards: Flashcard[]) {
  const genericWrongOptions = [
    "Element niezwiązany z głównym tematem materiału",
    "Pojęcie odnoszące się wyłącznie do historii zagadnienia",
    "Termin dotyczący tylko sprzętu komputerowego",
    "Zagadnienie czysto administracyjne",
    "Nazwa procesu niezwiązanego z analizowaną treścią",
    "Definicja z innej dziedziny",
    "Pojęcie pomocnicze, ale nie kluczowe",
    "Ogólne hasło bez związku z materiałem",
  ];

  return uniqueStrings([
    ...flashcards.map((card) => titleCase(card.term)),
    ...genericWrongOptions,
  ]);
}

function buildFallbackQuiz(flashcards: Flashcard[]): QuizQuestion[] {
  if (flashcards.length < 4) {
    return [
      {
        question: "Które stwierdzenie najlepiej opisuje sens materiału?",
        options: [
          "Materiał dotyczy kluczowych pojęć i ich praktycznego znaczenia.",
          "Materiał nie zawiera żadnych informacji merytorycznych.",
          "Materiał składa się wyłącznie z losowych definicji.",
          "Materiał nie wymaga interpretacji ani nauki.",
        ],
        correct:
          "Materiał dotyczy kluczowych pojęć i ich praktycznego znaczenia.",
      },
    ];
  }

  const wrongPool = buildWrongOptionPool(flashcards);

  return flashcards.slice(0, 5).map((card) => {
    const correct = titleCase(card.term);

    const distractors = shuffle(
      wrongPool.filter((item) => item !== correct)
    ).slice(0, 3);

    const options = shuffle([correct, ...distractors]);

    return {
      question: `Które pojęcie najlepiej pasuje do opisu?\n${card.definition}`,
      options,
      correct,
    };
  });
}

function buildFallbackAnalysis(rawText: string): AnalyzeResponse {
  const sentences = splitIntoSentences(rawText);

  const summary =
    sentences.slice(0, 3).join(" ").trim() || rawText.slice(0, 500).trim();

  const concepts = extractConcepts(rawText, 8);

  const keyTakeaways =
    sentences.slice(0, 4).length > 0
      ? sentences.slice(0, 4)
      : [
          "Nie udało się automatycznie wyodrębnić najważniejszych wniosków.",
          "Spróbuj wkleić dłuższy i bardziej uporządkowany materiał.",
        ];

  const questions = buildFallbackQuestions(summary, concepts, sentences);

  const flashcards = concepts.slice(0, 8).map((concept) => {
    const sentence = findSentenceForConcept(sentences, concept);

    return toFlashcard(
      titleCase(concept),
      buildDefinitionFromSentence(sentence, concept)
    );
  });

  const quiz = buildFallbackQuiz(flashcards);

  return {
    summary,
    keyTakeaways:
      keyTakeaways.length > 0
        ? keyTakeaways
        : ["Brak kluczowych wniosków."],
    concepts:
      concepts.length > 0
        ? concepts.map(titleCase)
        : ["Brak wykrytych pojęć kluczowych"],
    questions:
      questions.length > 0
        ? questions
        : ["Jakie są najważniejsze informacje wynikające z tego materiału?"],
    flashcards:
      flashcards.length > 0
        ? flashcards
        : [toFlashcard("Temat", "Uzupełnij własne wyjaśnienie materiału.")],
    quiz,
    studyPlan: [
      "Przeczytaj streszczenie i zaznacz fragmenty, których jeszcze nie rozumiesz.",
      "Powtórz kluczowe pojęcia i dopisz własne przykłady.",
      "Odpowiedz ustnie na 3 pytania kontrolne bez patrzenia w notatki.",
      "Przejdź fiszki i oznacz najtrudniejsze zagadnienia.",
      "Po 24 godzinach wróć do materiału i powtórz quiz.",
    ],
  };
}

function normalizeFlashcards(value: unknown): Flashcard[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const obj = item as {
        term?: unknown;
        definition?: unknown;
        front?: unknown;
        back?: unknown;
      };

      const term =
        typeof obj.term === "string"
          ? obj.term.trim()
          : typeof obj.front === "string"
            ? obj.front.trim()
            : "";

      const definition =
        typeof obj.definition === "string"
          ? obj.definition.trim()
          : typeof obj.back === "string"
            ? obj.back.trim()
            : "";

      if (!term || !definition) return null;

      return toFlashcard(term, definition);
    })
    .filter((item): item is Flashcard => item !== null)
    .slice(0, 8);
}

function normalizeQuiz(value: unknown): QuizQuestion[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const obj = item as {
        question?: unknown;
        options?: unknown;
        correct?: unknown;
      };

      if (
        typeof obj.question !== "string" ||
        !Array.isArray(obj.options) ||
        typeof obj.correct !== "string"
      ) {
        return null;
      }

      const options = uniqueStrings(
        obj.options
          .filter((option): option is string => typeof option === "string")
          .map((option) => option.trim())
      ).slice(0, 4);

      if (options.length !== 4) return null;

      const correct = obj.correct.trim();

      if (!options.includes(correct)) return null;

      return {
        question: obj.question.trim(),
        options,
        correct,
      };
    })
    .filter((item): item is QuizQuestion => item !== null)
    .slice(0, 5);
}

async function generateWithOpenAI(
  text: string,
  title: string
): Promise<AnalyzeResponse> {
  const prompt = `
Jesteś ekspertem od tworzenia materiałów do nauki dla studentów.

Na podstawie podanego materiału przygotuj analizę po polsku.
Zwróć WYŁĄCZNIE poprawny JSON w tym formacie:

{
  "summary": "2-5 zdań streszczenia",
  "keyTakeaways": ["wniosek 1", "wniosek 2", "wniosek 3", "wniosek 4"],
  "concepts": ["pojęcie 1", "pojęcie 2", "pojęcie 3", "pojęcie 4", "pojęcie 5", "pojęcie 6"],
  "questions": ["pytanie 1", "pytanie 2", "pytanie 3", "pytanie 4", "pytanie 5"],
  "flashcards": [
    { "term": "pojęcie", "definition": "krótkie wyjaśnienie" }
  ],
  "quiz": [
    {
      "question": "treść pytania",
      "options": ["opcja A", "opcja B", "opcja C", "opcja D"],
      "correct": "jedna z opcji dokładnie taka sama jak w options"
    }
  ],
  "studyPlan": ["krok 1", "krok 2", "krok 3", "krok 4", "krok 5"]
}

Zasady:
- wszystko po polsku
- summary ma być konkretne i zrozumiałe
- keyTakeaways: 4-6 pozycji
- concepts: 5-8 pozycji
- questions: 4-6 pozycji
- flashcards: 5-8 pozycji
- quiz: dokładnie 5 pytań
- każde pytanie quizowe ma mieć 4 sensowne odpowiedzi
- poprawna odpowiedź nie może być zawsze pierwsza
- 3 błędne odpowiedzi mają być logiczne i wiarygodne, ale niepoprawne
- NIE twórz placeholderów typu "odpowiedź 1", "najlepsza odpowiedź", "częściowo poprawna"
- odpowiedzi quizowe mają być realne, merytoryczne i odnosić się do materiału
- pytania mają być konkretne, nie ogólnikowe
- pojęcia i fiszki mają być użyteczne do nauki, nie mogą być losowymi słowami
- studyPlan ma być praktyczny i krótki
- nie dodawaj żadnego tekstu poza JSON-em

TYTUŁ:
${title}

MATERIAŁ:
${text}
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
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("Brak treści odpowiedzi z OpenAI.");
  }

  const parsed = JSON.parse(content) as Record<string, unknown>;

  const fallback = buildFallbackAnalysis(text);

  const summary =
    typeof parsed.summary === "string" && parsed.summary.trim()
      ? parsed.summary.trim()
      : fallback.summary;

  const keyTakeaways = safeStringArray(parsed.keyTakeaways, 6);
  const concepts = safeStringArray(parsed.concepts, 8);
  const questions = safeStringArray(parsed.questions, 6);
  const flashcards = normalizeFlashcards(parsed.flashcards);
  const quiz = normalizeQuiz(parsed.quiz);
  const studyPlan = safeStringArray(parsed.studyPlan, 6);

  return {
    summary,
    keyTakeaways:
      keyTakeaways.length > 0 ? keyTakeaways : fallback.keyTakeaways,
    concepts: concepts.length > 0 ? concepts.map(titleCase) : fallback.concepts,
    questions: questions.length > 0 ? questions : fallback.questions,
    flashcards: flashcards.length > 0 ? flashcards : fallback.flashcards,
    quiz:
      quiz.length > 0
        ? quiz
        : buildFallbackQuiz(
            flashcards.length > 0 ? flashcards : fallback.flashcards
          ),
    studyPlan: studyPlan.length > 0 ? studyPlan : fallback.studyPlan,
  };
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/analyze",
    message: "Analyze endpoint is working.",
    openAiKeyExists: Boolean(process.env.OPENAI_API_KEY),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzePayload;

    const rawText =
      typeof body.text === "string" ? sanitizeText(body.text) : "";

    const title =
      typeof body.title === "string" && body.title.trim().length > 0
        ? body.title.trim().slice(0, 120)
        : "Nowa analiza";

    if (!rawText) {
      return NextResponse.json(
        { ok: false, error: "Brak tekstu do analizy." },
        { status: 400 }
      );
    }

    if (rawText.length < MIN_TEXT_LENGTH) {
      return NextResponse.json(
        {
          ok: false,
          error: `Tekst jest za krótki. Wklej co najmniej ${MIN_TEXT_LENGTH} znaków.`,
        },
        { status: 400 }
      );
    }

    if (rawText.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        {
          ok: false,
          error: `Tekst jest za długi. Maksymalnie ${MAX_TEXT_LENGTH} znaków.`,
        },
        { status: 400 }
      );
    }

    let analysis: AnalyzeResponse;

    if (process.env.OPENAI_API_KEY) {
      try {
        analysis = await generateWithOpenAI(rawText, title);
      } catch (error) {
        console.error("OpenAI analyze fallback:", error);
        analysis = buildFallbackAnalysis(rawText);
      }
    } else {
      analysis = buildFallbackAnalysis(rawText);
    }

    return NextResponse.json({
      ok: true,
      id: makeId(),
      title,
      createdAt: new Date().toISOString(),
      sourceText: rawText,
      weakTopics: [],
      ...analysis,
    });
  } catch (error) {
    console.error("Analyze route error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Nie udało się przetworzyć analizy.",
      },
      { status: 500 }
    );
  }
}