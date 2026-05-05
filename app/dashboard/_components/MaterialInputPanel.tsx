"use client";

import { FileText, FolderPlus, Sparkles, Upload, X } from "lucide-react";

type FolderInput = string | { id?: string; name?: string; label?: string };

type Props = {
  titleInput: string;
  tagsInput: string;
  inputText: string;
  loading: boolean;
  message: string;
  folders: FolderInput[];
  activeFolder: string;
  newFolderName: string;
  todayMinutes: number;
  dailyGoalMinutes: number;
  onTitleChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onInputTextChange: (value: string) => void;
  onFolderSelect: (value: string) => void;
  onNewFolderNameChange: (value: string) => void;
  onCreateFolder: () => void;
  onFileSelected: ((file: File) => void | Promise<void>) | ((event: React.ChangeEvent<HTMLInputElement>) => void | Promise<void>);
  onAnalyze: () => void;
  onClear: () => void;
  onExportTxt: () => void;
  onExportCsv: () => void;
};

function normalizeFolders(folders: FolderInput[]) {
  return (Array.isArray(folders) ? folders : []).map((folder, index) => {
    if (typeof folder === "string") {
      return {
        id: folder || `folder-${index}`,
        label: folder || "Folder",
      };
    }

    return {
      id:
        typeof folder?.id === "string" && folder.id.trim()
          ? folder.id
          : `folder-${index}`,
      label:
        typeof folder?.label === "string" && folder.label.trim()
          ? folder.label
          : typeof folder?.name === "string" && folder.name.trim()
          ? folder.name
          : "Folder",
    };
  });
}

export default function MaterialInputPanel({
  titleInput,
  tagsInput,
  inputText,
  loading,
  message,
  folders,
  activeFolder,
  newFolderName,
  todayMinutes,
  dailyGoalMinutes,
  onTitleChange,
  onTagsChange,
  onInputTextChange,
  onFolderSelect,
  onNewFolderNameChange,
  onCreateFolder,
  onFileSelected,
  onAnalyze,
  onClear,
  onExportTxt,
  onExportCsv,
}: Props) {
  const progress = Math.min(
    100,
    Math.round((todayMinutes / Math.max(dailyGoalMinutes, 1)) * 100)
  );

  const normalizedFolders = normalizeFolders(folders);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            Material input
          </div>

          <h3 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-slate-100">
            Dodaj materiał do analizy
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Wklej tekst albo wrzuć plik. To jest główny punkt wejścia do całej aplikacji.
          </p>
        </div>

        <div className="min-w-[220px] rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Dzisiejszy progres
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-slate-100">
            {todayMinutes} / {dailyGoalMinutes} min
          </p>
          <div className="mt-3 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-2.5 rounded-full bg-slate-950 transition-all dark:bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Tytuł materiału
            </label>
            <input
              value={titleInput}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Np. Biologia — układ nerwowy"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Tagi
            </label>
            <input
              value={tagsInput}
              onChange={(e) => onTagsChange(e.target.value)}
              placeholder="Np. biologia, egzamin, układ-nerwowy"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Folder
              </label>
              <select
                value={activeFolder}
                onChange={(e) => onFolderSelect(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {normalizedFolders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[180px]">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Nowy folder
              </label>
              <div className="flex gap-2">
                <input
                  value={newFolderName}
                  onChange={(e) => onNewFolderNameChange(e.target.value)}
                  placeholder="Nowy folder"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={onCreateFolder}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  aria-label="Utwórz folder"
                  title="Utwórz folder"
                >
                  <FolderPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Treść materiału
          </label>

          <textarea
            value={inputText}
            onChange={(e) => onInputTextChange(e.target.value)}
            placeholder="Wklej tutaj swoje notatki..."
            className="min-h-[260px] w-full resize-none rounded-[22px] border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
              <Upload className="h-4 w-4" />
              Dodaj plik
              <input
                type="file"
                className="hidden"
                accept=".txt,.pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    (onFileSelected as (file: File) => void | Promise<void>)(file);
                  } catch {
                    (onFileSelected as (event: React.ChangeEvent<HTMLInputElement>) => void | Promise<void>)(e);
                  }

                  e.currentTarget.value = "";
                }}
              />
            </label>

            <button
              type="button"
              onClick={onAnalyze}
              disabled={loading}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950"
            >
              {loading ? "Analizowanie..." : "Analizuj materiał"}
            </button>

            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
              Wyczyść
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onExportTxt}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Export TXT
            </button>

            <button
              type="button"
              onClick={onExportCsv}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Export CSV
            </button>
          </div>

          {message ? (
            <div className="mt-4 rounded-[20px] border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              {message}
            </div>
          ) : null}

          <div className="mt-4 rounded-[20px] border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Obsługiwane formaty
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  TXT, PDF, DOC, DOCX.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}