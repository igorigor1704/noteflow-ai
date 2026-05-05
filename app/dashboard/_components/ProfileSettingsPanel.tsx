"use client";

import { useState } from "react";

type StudyPreferences = {
  dailyGoalMinutes: number;
  sessionLengthMinutes: number;
  breakLengthMinutes: number;
  autoOpenReview: boolean;
  showHints: boolean;
};

const DEFAULT_PREFERENCES: StudyPreferences = {
  dailyGoalMinutes: 60,
  sessionLengthMinutes: 25,
  breakLengthMinutes: 5,
  autoOpenReview: true,
  showHints: true,
};

const STORAGE_KEY = "noteflow:study-preferences";

function getInitialPreferences(): StudyPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(raw) as Partial<StudyPreferences>;

    return {
      dailyGoalMinutes:
        typeof parsed.dailyGoalMinutes === "number"
          ? parsed.dailyGoalMinutes
          : DEFAULT_PREFERENCES.dailyGoalMinutes,
      sessionLengthMinutes:
        typeof parsed.sessionLengthMinutes === "number"
          ? parsed.sessionLengthMinutes
          : DEFAULT_PREFERENCES.sessionLengthMinutes,
      breakLengthMinutes:
        typeof parsed.breakLengthMinutes === "number"
          ? parsed.breakLengthMinutes
          : DEFAULT_PREFERENCES.breakLengthMinutes,
      autoOpenReview:
        typeof parsed.autoOpenReview === "boolean"
          ? parsed.autoOpenReview
          : DEFAULT_PREFERENCES.autoOpenReview,
      showHints:
        typeof parsed.showHints === "boolean"
          ? parsed.showHints
          : DEFAULT_PREFERENCES.showHints,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export default function ProfileSettingsPanel() {
  const [preferences, setPreferences] = useState<StudyPreferences>(
    getInitialPreferences
  );
  const [saved, setSaved] = useState(false);

  const handleNumberChange =
    (
      key: keyof Pick<
        StudyPreferences,
        "dailyGoalMinutes" | "sessionLengthMinutes" | "breakLengthMinutes"
      >
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);

      setPreferences((prev) => ({
        ...prev,
        [key]: Number.isFinite(value) ? value : 0,
      }));
      setSaved(false);
    };

  const handleBooleanChange =
    (key: keyof Pick<StudyPreferences, "autoOpenReview" | "showHints">) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPreferences((prev) => ({
        ...prev,
        [key]: event.target.checked,
      }));
      setSaved(false);
    };

  const handleSave = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Ustawienia nauki
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Ustaw podstawowe preferencje sesji i codzienny cel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">
            Dzienny cel (min)
          </span>
          <input
            type="number"
            min={0}
            value={preferences.dailyGoalMinutes}
            onChange={handleNumberChange("dailyGoalMinutes")}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">
            Długość sesji (min)
          </span>
          <input
            type="number"
            min={1}
            value={preferences.sessionLengthMinutes}
            onChange={handleNumberChange("sessionLengthMinutes")}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">
            Przerwa (min)
          </span>
          <input
            type="number"
            min={0}
            value={preferences.breakLengthMinutes}
            onChange={handleNumberChange("breakLengthMinutes")}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-3">
        <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
          <span className="text-sm text-slate-700">
            Automatycznie otwieraj powtórki
          </span>
          <input
            type="checkbox"
            checked={preferences.autoOpenReview}
            onChange={handleBooleanChange("autoOpenReview")}
            className="h-4 w-4"
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
          <span className="text-sm text-slate-700">Pokazuj podpowiedzi</span>
          <input
            type="checkbox"
            checked={preferences.showHints}
            onChange={handleBooleanChange("showHints")}
            className="h-4 w-4"
          />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Zapisz ustawienia
        </button>

        {saved ? (
          <span className="text-sm text-emerald-600">Zapisano lokalnie</span>
        ) : (
          <span className="text-sm text-slate-500">Zmiany niezapisane</span>
        )}
      </div>
    </section>
  );
}