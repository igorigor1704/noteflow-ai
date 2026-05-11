import { NextResponse } from "next/server";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function isSupportedFile(file: File) {
  const lowerName = file.name.toLowerCase();

  return (
    file.type === "text/plain" ||
    file.type === "application/pdf" ||
    file.type === DOCX_MIME ||
    lowerName.endsWith(".txt") ||
    lowerName.endsWith(".pdf") ||
    lowerName.endsWith(".docx")
  );
}

function normalizeText(text: string) {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

async function readPdf(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await pdfParse(buffer);

  return normalizeText(result.text ?? "");
}

async function readDocx(file: File) {
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.extractRawText({
    buffer: Buffer.from(arrayBuffer),
  });

  return normalizeText(result.value ?? "");
}

async function readTxt(file: File) {
  return normalizeText(await file.text());
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Brak pliku.",
        },
        { status: 400 }
      );
    }

    if (!isSupportedFile(file)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nieobsługiwany format. Wgraj TXT, PDF albo DOCX.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          ok: false,
          error: "Plik jest za duży. Maksymalny rozmiar to 15 MB.",
        },
        { status: 400 }
      );
    }

    const lowerName = file.name.toLowerCase();
    let text = "";

    if (file.type === "text/plain" || lowerName.endsWith(".txt")) {
      text = await readTxt(file);
    } else if (file.type === "application/pdf" || lowerName.endsWith(".pdf")) {
      text = await readPdf(file);
    } else if (file.type === DOCX_MIME || lowerName.endsWith(".docx")) {
      text = await readDocx(file);
    }

    if (!text || text.length < 30) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Nie udało się odczytać tekstu z pliku. Jeśli to PDF ze skanem lub zdjęciem, użyj PDF z prawdziwym tekstem albo wklej tekst ręcznie.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      fileName: file.name,
      text,
      characters: text.length,
    });
  } catch (error) {
    console.error("Upload route error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Nie udało się przetworzyć pliku.",
      },
      { status: 500 }
    );
  }
}