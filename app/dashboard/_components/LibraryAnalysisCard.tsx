"use client";

import Link from "next/link";
import { ArrowUpRight, Heart, Pin, Sparkles } from "lucide-react";
import type { LibraryAnalysis } from "../_lib/library";

type Props = {
  analysis: LibraryAnalysis;
  onTogglePinned: () => void;
  onToggleFavorite: () => void;
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

function getSummary(value?: string[] | string) {
  if (Array.isArray(value)) return value.join(" ");
  if (typeof value === "string") return value;
  return "";
}

export default function LibraryAnalysisCard({
  analysis,
  onTogglePinned,
  onToggleFavorite,
}: Props) {
  const tags = Array.isArray(analysis.tags) ? analysis.tags : [];
  const keywords = Array.isArray(analysis.keywords) ? analysis.keywords : [];
  const summary = getSummary(analysis.summary);

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.10),transparent_50%)] opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex h-full flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
            {formatDate(analysis.createdAt)}
          </span>

          {analysis.isPinned ? (
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              Przypięte
            </span>
          ) : null}

          {analysis.isFavorite ? (
            <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              Ulubione
            </span>
          ) : null}
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
            {analysis.title || "Bez tytułu"}
          </h3>

          <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {summary || "Brak podsumowania dla tej analizy."}
          </p>
        </div>

        {(tags.length > 0 || keywords.length > 0) && (
          <div className="space-y-3">
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 5).map((tag) => (
                  <span
                    key={`${analysis.id}-${tag}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            {keywords.length > 0 ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{keywords.slice(0, 4).join(" • ")}</span>
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-2">
          <Link
            href={`/dashboard/analysis/${analysis.id}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
          >
            Otwórz
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={onTogglePinned}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <Pin className="h-4 w-4" />
            {analysis.isPinned ? "Odepnij" : "Pin"}
          </button>

          <button
            type="button"
            onClick={onToggleFavorite}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <Heart className="h-4 w-4" />
            {analysis.isFavorite ? "Usuń z ulubionych" : "Favorite"}
          </button>
        </div>
      </div>
    </article>
  );
}