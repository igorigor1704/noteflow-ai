"use client";

import { useEffect, useState } from "react";
import type { AnalysisNotes } from "../_lib/types";

type AnalysisNotesEditorProps = {
  notes: AnalysisNotes;
  onSave: (notes: AnalysisNotes) => void;
};

export default function AnalysisNotesEditor({
  notes,
  onSave,
}: AnalysisNotesEditorProps) {
  const [draft, setDraft] = useState<AnalysisNotes>(notes);
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");

  useEffect(() => {
    setDraft(notes);
  }, [notes]);

  useEffect(() => {
    setSaveState("saving");

    const timeout = window.setTimeout(() => {
      onSave(draft);
      setSaveState("saved");
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [draft, onSave]);

  return (
    <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Notes 2.0
          </p>
          <h2 className="text-2xl font-semibold">Moje notatki do analizy</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Tu zapisujesz własne wnioski, skrócone podsumowanie i rzeczy pod egzamin.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium dark:border-slate-800 dark:bg-slate-950">
          {saveState === "saving" ? "Zapisywanie..." : "Zapisano automatycznie"}
        </div>
      </div>

      <div className="grid gap-6">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Moje notatki
          </label>
          <textarea
            value={draft.freeform}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, freeform: e.target.value }))
            }
            placeholder="Wpisz swoje własne notatki, skojarzenia, przykłady i rzeczy które chcesz dopamiętać..."
            className="min-h-[180px] w-full rounded-2xl border border-slate-300 bg-slate-50 p-4 outline-none dark:border-slate-700 dark:bg-slate-950"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Moje podsumowanie
            </label>
            <textarea
              value={draft.personalSummary}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  personalSummary: e.target.value,
                }))
              }
              placeholder="Streść materiał swoimi słowami w kilku zdaniach..."
              className="min-h-[140px] w-full rounded-2xl border border-slate-300 bg-slate-50 p-4 outline-none dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Na egzamin / do zapamiętania
            </label>
            <textarea
              value={draft.examFocus}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, examFocus: e.target.value }))
              }
              placeholder="Wpisz definicje, wzory, fakty i rzeczy które mogą paść na egzaminie..."
              className="min-h-[140px] w-full rounded-2xl border border-slate-300 bg-slate-50 p-4 outline-none dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
        </div>
      </div>
    </section>
  );
}