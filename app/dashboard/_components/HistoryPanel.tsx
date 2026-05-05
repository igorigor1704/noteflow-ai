"use client";

import { Heart, Pin, Search, Trash2 } from "lucide-react";
import type { SavedAnalysis } from "../_lib/types";

type Props = {
  historySearch: string;
  onlyFavorites: boolean;
  activeTag: string;
  availableTags: string[];
  filteredHistory: SavedAnalysis[];
  onHistorySearchChange: (value: string) => void;
  onToggleOnlyFavorites: () => void;
  onSetActiveTag: (value: string) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpen: (item: SavedAnalysis) => void;
  onRemove: (id: string) => void;
};

function formatDate(value?: string) {
  if (!value) return "Brak daty";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getSummary(item: SavedAnalysis) {
  if (typeof item.result?.summary === "string" && item.result.summary.trim()) {
    return item.result.summary;
  }

  if (typeof item.preview === "string" && item.preview.trim()) {
    return item.preview;
  }

  return "Brak podsumowania dla tej analizy.";
}

export default function HistoryPanel({
  historySearch,
  onlyFavorites,
  activeTag,
  availableTags,
  filteredHistory,
  onHistorySearchChange,
  onToggleOnlyFavorites,
  onSetActiveTag,
  onTogglePin,
  onToggleFavorite,
  onOpen,
  onRemove,
}: Props) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            History
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
            Ostatnie analizy
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Czytelna lista ostatnich materiałów.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleOnlyFavorites}
          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            onlyFavorites
              ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          {onlyFavorites ? "Pokaż wszystkie" : "Tylko ulubione"}
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={historySearch}
          onChange={(e) => onHistorySearchChange(e.target.value)}
          placeholder="Szukaj po tytule lub treści..."
          className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      {availableTags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSetActiveTag("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              activeTag === "all"
                ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Wszystkie tagi
          </button>

          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSetActiveTag(tag)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                activeTag === tag
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-950">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Brak analiz do pokazania
            </h4>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Dodaj pierwszy materiał albo zmień filtry.
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const itemId = item.id;

            return (
              <article
                key={itemId}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                        {formatDate(item.createdAt)}
                      </span>

                      {item.pinned ? (
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                          Przypięte
                        </span>
                      ) : null}

                      {item.favorite ? (
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                          Ulubione
                        </span>
                      ) : null}
                    </div>

                    <h4 className="truncate text-lg font-bold text-slate-950 dark:text-slate-100">
                      {item.title || "Bez tytułu"}
                    </h4>

                    <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {getSummary(item)}
                    </p>

                    {Array.isArray(item.tags) && item.tags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.tags.slice(0, 6).map((tag) => (
                          <span
                            key={`${itemId}-${tag}`}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => onOpen(item)}
                      className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
                    >
                      Otwórz
                    </button>

                    <button
                      type="button"
                      onClick={() => onTogglePin(itemId)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      <Pin className="h-4 w-4" />
                      Pin
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleFavorite(itemId)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      <Heart className="h-4 w-4" />
                      Like
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemove(itemId)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Usuń
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}