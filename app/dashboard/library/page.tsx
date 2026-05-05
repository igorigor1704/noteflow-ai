"use client";

import Link from "next/link";
import { FolderOpen, Library, Pin, Sparkles, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useStudyStore } from "../../store/useStudyStore";
import LibraryAnalysisCard from "../_components/LibraryAnalysisCard";
import LibraryToolbar from "../_components/LibraryToolbar";
import {
  DEFAULT_FOLDERS,
  extractAllTags,
  matchesFolder,
  matchesSearch,
  matchesTag,
  sortAnalyses,
  type LibraryAnalysis,
  type LibrarySortOption,
} from "../_lib/library";

function toSafeText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function toSafeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "number") return String(item);

      if (item && typeof item === "object") {
        const candidate = item as {
          term?: unknown;
          front?: unknown;
          label?: unknown;
          name?: unknown;
          title?: unknown;
        };

        if (typeof candidate.term === "string") return candidate.term;
        if (typeof candidate.front === "string") return candidate.front;
        if (typeof candidate.label === "string") return candidate.label;
        if (typeof candidate.name === "string") return candidate.name;
        if (typeof candidate.title === "string") return candidate.title;
      }

      return "";
    })
    .filter((item) => item.trim().length > 0);
}

function getAnalysisSummary(item: unknown): string {
  if (!item || typeof item !== "object") return "";

  const candidate = item as {
    preview?: unknown;
    summary?: unknown;
  };

  if (typeof candidate.preview === "string" && candidate.preview.trim()) {
    return candidate.preview;
  }

  if (typeof candidate.summary === "string" && candidate.summary.trim()) {
    return candidate.summary;
  }

  return "";
}

function getAnalysisConcepts(item: unknown): string[] {
  if (!item || typeof item !== "object") return [];

  const candidate = item as {
    concepts?: unknown;
    result?: {
      concepts?: unknown;
    };
  };

  if (candidate.result && typeof candidate.result === "object") {
    const nested = candidate.result as { concepts?: unknown };
    const nestedConcepts = toSafeStringArray(nested.concepts);

    if (nestedConcepts.length > 0) return nestedConcepts;
  }

  return toSafeStringArray(candidate.concepts);
}

function getAnalysisFolder(item: unknown): string | null {
  if (!item || typeof item !== "object") return null;

  const candidate = item as {
    folder?: unknown;
  };

  if (typeof candidate.folder === "string" && candidate.folder.trim()) {
    return candidate.folder.trim().toLowerCase();
  }

  return null;
}

function getAnalysisPinned(item: unknown): boolean {
  if (!item || typeof item !== "object") return false;

  const candidate = item as {
    pinned?: unknown;
  };

  return Boolean(candidate.pinned);
}

function getAnalysisFavorite(item: unknown): boolean {
  if (!item || typeof item !== "object") return false;

  const candidate = item as {
    favorite?: unknown;
  };

  return Boolean(candidate.favorite);
}

function StatCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-100">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{helper}</p>
    </div>
  );
}

export default function LibraryPage() {
  const analyses = useStudyStore((state) => state.analyses);
  const togglePin = useStudyStore((state) => state.togglePin);
  const toggleFavorite = useStudyStore((state) => state.toggleFavorite);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<LibrarySortOption>("newest");
  const [activeFolderId, setActiveFolderId] = useState("all");
  const [activeTag, setActiveTag] = useState("all");

  const normalizedAnalyses = useMemo<LibraryAnalysis[]>(
    () =>
      (Array.isArray(analyses) ? analyses : []).map((item) => ({
        id: toSafeText((item as { id?: unknown })?.id),
        title: toSafeText((item as { title?: unknown })?.title) || "Bez tytułu",
        createdAt: toSafeText((item as { createdAt?: unknown })?.createdAt),
        summary: getAnalysisSummary(item),
        keywords: getAnalysisConcepts(item),
        tags: toSafeStringArray((item as { tags?: unknown })?.tags),
        folderId: getAnalysisFolder(item),
        isPinned: getAnalysisPinned(item),
        isFavorite: getAnalysisFavorite(item),
      })),
    [analyses]
  );

  const folderOptions = useMemo(() => {
    const dynamicFolders = new Set<string>();

    normalizedAnalyses.forEach((item) => {
      if (item.folderId && item.folderId.trim()) {
        dynamicFolders.add(item.folderId);
      }
    });

    const baseFolders = DEFAULT_FOLDERS.map((folder) => ({
      id: folder.id,
      name: folder.name,
    }));

    const extraFolders = Array.from(dynamicFolders)
      .filter((folderId) => !baseFolders.some((folder) => folder.id === folderId))
      .map((folderId) => ({
        id: folderId,
        name: folderId.charAt(0).toUpperCase() + folderId.slice(1),
      }));

    return [...baseFolders, ...extraFolders];
  }, [normalizedAnalyses]);

  const allTags = useMemo(() => extractAllTags(normalizedAnalyses), [normalizedAnalyses]);

  const visibleAnalyses = useMemo(() => {
    const filtered = normalizedAnalyses.filter((item) => {
      const matchesQuery = matchesSearch(item, search);
      const matchesFolderValue = matchesFolder(item, activeFolderId);
      const matchesTagValue = matchesTag(item, activeTag);

      if (sortBy === "favorites" && !item.isFavorite) return false;
      if (sortBy === "pinned" && !item.isPinned) return false;

      return matchesQuery && matchesFolderValue && matchesTagValue;
    });

    return sortAnalyses(filtered, sortBy);
  }, [normalizedAnalyses, search, activeFolderId, activeTag, sortBy]);

  const stats = useMemo(
    () => ({
      total: normalizedAnalyses.length,
      visible: visibleAnalyses.length,
      pinned: normalizedAnalyses.filter((item) => item.isPinned).length,
      favorites: normalizedAnalyses.filter((item) => item.isFavorite).length,
    }),
    [normalizedAnalyses, visibleAnalyses]
  );

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-6 py-6 dark:border-slate-800 md:px-8 md:py-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                  Library
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  uporządkowana biblioteka analiz
                </span>
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                NoteFlow AI
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-slate-100 md:text-5xl md:leading-[1.02]">
                Wszystkie materiały w jednym, czystym miejscu
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                To ma działać jak prawdziwa biblioteka produktu SaaS: szybkie wyszukiwanie,
                logiczne filtrowanie, przypinanie ważnych analiz i błyskawiczny powrót do nauki.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Wróć do dashboardu
              </Link>

              <Link
                href="/pricing"
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
              >
                Zobacz pricing
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-4 md:px-8">
          <StatCard
            label="Wszystkie"
            value={stats.total}
            helper="zapisanych analiz"
            icon={<Library className="h-5 w-5" />}
          />
          <StatCard
            label="Widoczne"
            value={stats.visible}
            helper="po aktywnych filtrach"
            icon={<Sparkles className="h-5 w-5" />}
          />
          <StatCard
            label="Przypięte"
            value={stats.pinned}
            helper="ważnych materiałów"
            icon={<Pin className="h-5 w-5" />}
          />
          <StatCard
            label="Ulubione"
            value={stats.favorites}
            helper="oznaczonych analiz"
            icon={<Star className="h-5 w-5" />}
          />
        </div>
      </section>

      <LibraryToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        folders={folderOptions}
        activeFolderId={activeFolderId}
        onFolderChange={setActiveFolderId}
        tags={allTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
      />

      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
        {visibleAnalyses.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-950">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Nic tu jeszcze nie ma
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Dodaj pierwszą analizę albo wyczyść filtry, żeby zobaczyć materiały.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
              >
                Dodaj analizę
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSortBy("newest");
                  setActiveFolderId("all");
                  setActiveTag("all");
                }}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Wyczyść filtry
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950">
              <span className="text-slate-600 dark:text-slate-300">
                Pokazuję <strong>{visibleAnalyses.length}</strong>{" "}
                {visibleAnalyses.length === 1 ? "analizę" : "analiz"}
              </span>

              <span className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <FolderOpen className="h-4 w-4" />
                {folderOptions.find((folder) => folder.id === activeFolderId)?.name ??
                  "Wszystkie"}
              </span>
            </div>

            <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
              {visibleAnalyses.map((analysis) => (
                <LibraryAnalysisCard
                  key={analysis.id}
                  analysis={analysis}
                  onTogglePinned={() => togglePin(analysis.id)}
                  onToggleFavorite={() => toggleFavorite(analysis.id)}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}