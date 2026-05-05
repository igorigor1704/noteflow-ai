"use client";

import { FolderOpen, Search, SlidersHorizontal, Tag } from "lucide-react";
import type { LibraryFolder, LibrarySortOption } from "../_lib/library";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: LibrarySortOption;
  onSortChange: (value: LibrarySortOption) => void;
  folders: LibraryFolder[];
  activeFolderId: string;
  onFolderChange: (value: string) => void;
  tags: string[];
  activeTag: string;
  onTagChange: (value: string) => void;
};

const sortOptions: Array<{ value: LibrarySortOption; label: string }> = [
  { value: "newest", label: "Najnowsze" },
  { value: "oldest", label: "Najstarsze" },
  { value: "title-asc", label: "A → Z" },
  { value: "title-desc", label: "Z → A" },
  { value: "favorites", label: "Ulubione" },
  { value: "pinned", label: "Przypięte" },
];

export default function LibraryToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  folders,
  activeFolderId,
  onFolderChange,
  tags,
  activeTag,
  onTagChange,
}: Props) {
  const safeFolders = Array.isArray(folders) ? folders : [];
  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Library controls
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-slate-100">
              Szukaj, filtruj i porządkuj materiały
            </h2>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-3 xl:max-w-[460px]">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Szukaj po tytule, summary albo tagach..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
            </div>

            <div className="flex min-w-[170px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-950">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as LibrarySortOption)}
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none dark:text-slate-100"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-slate-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Foldery
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {safeFolders.map((folder) => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => onFolderChange(folder.id)}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                    activeFolderId === folder.id
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {folder.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4 text-slate-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Tagi
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onTagChange("all")}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  activeTag === "all"
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Wszystkie
              </button>

              {safeTags.map((tag, index) => (
                <button
                  key={`${tag}-${index}`}
                  type="button"
                  onClick={() => onTagChange(tag)}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                    activeTag === tag
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}