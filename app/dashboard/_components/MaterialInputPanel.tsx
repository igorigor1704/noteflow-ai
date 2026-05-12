"use client";

import type { ChangeEvent } from "react";
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
  onFileSelected:
    | ((file: File) => void | Promise<void>)
    | ((event: ChangeEvent<HTMLInputElement>) => void | Promise<void>);
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            Material input
          </div>

          <h3 className="text-3xl font-black tracking-tight text-white">
            Analiza materiałów
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            Wklej tekst albo wrzuć plik. To jest główny punkt wejścia do całej aplikacji.
          </p>
        </div>

        <div className="min-w-[220px] rounded-[24px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Dzisiejszy progres
          </p>

          <p className="mt-2 text-2xl font-black text-white">
            {todayMinutes} / {dailyGoalMinutes} min
          </p>

          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-violet-400/20 bg-[#0b1020]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <label className="mb-3 block text-sm font-bold text-white">
          Treść materiału
        </label>

        <textarea
          value={inputText}
          onChange={(e) => onInputTextChange(e.target.value)}
          placeholder="Wklej tutaj swoje notatki, treść z PDF albo materiał do nauki..."
          className="min-h-[420px] w-full resize-none rounded-[26px] border border-white/10 bg-[#0f172a]/90 px-5 py-5 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
        />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/[0.08]">
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
                  (onFileSelected as (event: ChangeEvent<HTMLInputElement>) => void | Promise<void>)(e);
                }

                e.currentTarget.value = "";
              }}
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onAnalyze}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Analizowanie..." : "Analizuj materiał"}
            </button>

            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/[0.08]"
            >
              <X className="h-4 w-4" />
              Wyczyść
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-[#0b1020]/80 p-6 backdrop-blur-2xl">
        <div className="grid gap-4 xl:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">
              Tytuł materiału
            </label>

            <input
              value={titleInput}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Np. Biologia — układ nerwowy"
              className="w-full rounded-2xl border border-white/10 bg-[#0f172a]/90 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">
              Tagi
            </label>

            <input
              value={tagsInput}
              onChange={(e) => onTagsChange(e.target.value)}
              placeholder="Np. biologia, egzamin, układ-nerwowy"
              className="w-full rounded-2xl border border-white/10 bg-[#0f172a]/90 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[180px_1fr_auto]">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">
              Folder
            </label>

            <select
              value={activeFolder}
              onChange={(e) => onFolderSelect(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0f172a]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/50"
            >
              {normalizedFolders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">
              Nowy folder
            </label>

            <div className="flex gap-2">
              <input
                value={newFolderName}
                onChange={(e) => onNewFolderNameChange(e.target.value)}
                placeholder="Nowy folder"
                className="w-full rounded-2xl border border-white/10 bg-[#0f172a]/90 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
              />

              <button
                type="button"
                onClick={onCreateFolder}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-slate-200 transition hover:bg-white/[0.08]"
                aria-label="Utwórz folder"
                title="Utwórz folder"
              >
                <FolderPlus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={onExportTxt}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/[0.08]"
            >
              <FileText className="h-4 w-4" />
              Export TXT
            </button>

            <button
              type="button"
              onClick={onExportCsv}
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/[0.08]"
            >
              Export CSV
            </button>
          </div>
        </div>

        {message ? (
          <div className="mt-5 rounded-[22px] border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-200">
            {message}
          </div>
        ) : null}

        <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-4 w-4 text-violet-300" />

            <div>
              <p className="text-sm font-bold text-white">
                Obsługiwane formaty
              </p>

              <p className="mt-1 text-sm text-slate-400">
                TXT, PDF, DOC, DOCX.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}