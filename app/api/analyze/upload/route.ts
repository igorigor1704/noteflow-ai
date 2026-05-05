import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
    .trim();
}

async function readPdf(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const parser = new PDFParse({
    data: Buffer.from(arrayBuffer),
  });

  try {
    const result = await parser.getText();
    return normalizeText(result.text ?? "");
  } finally {
    await parser.destroy();
  }
}

async function readDocx(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({
    buffer: Buffer.from(arrayBuffer),
  });

  return normalizeText(result.value ?? "");
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Brak pliku." }, { status: 400 });
    }

    if (!isSupportedFile(file)) {
      return NextResponse.json(
        {
          error: "Nieobsługiwany format. Wgraj TXT, PDF albo DOCX.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "Plik jest za duży. Maksymalny rozmiar to 5 MB.",
        },
        { status: 400 }
      );
    }

    const lowerName = file.name.toLowerCase();
    let text = "";

    if (file.type === "text/plain" || lowerName.endsWith(".txt")) {
      text = normalizeText(await file.text());
    } else if (file.type === "application/pdf" || lowerName.endsWith(".pdf")) {
      text = await readPdf(file);
    } else if (file.type === DOCX_MIME || lowerName.endsWith(".docx")) {
      text = await readDocx(file);
    }

    if (!text) {
      return NextResponse.json(
        {
          error:
            "Nie udało się odczytać treści z pliku. Spróbuj innego pliku albo wklej tekst ręcznie.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Upload route error:", error);

    return NextResponse.json(
      {
        error: "Nie udało się przetworzyć pliku.",
      },
      { status: 500 }
    );
  }
}