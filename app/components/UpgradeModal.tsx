"use client";

import Link from "next/link";
import { Crown, Sparkles, X } from "lucide-react";

type UpgradeModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  featureName?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function UpgradeModal({
  open,
  onClose,
  title = "Odblokuj pełny dostęp",
  description = "Ta funkcja jest dostępna w NoteFlow Pro. Przejdź na plan premium, aby korzystać z bardziej zaawansowanego workflow nauki i funkcji AI.",
  featureName = "Funkcja premium",
  ctaHref = "/pricing",
  ctaLabel = "Przejdź na Pro",
}: UpgradeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
              <Crown className="h-3.5 w-3.5" />
              NoteFlow Pro
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-950 dark:text-slate-100">
              {title}
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij modal"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-slate-950 p-2 text-white dark:bg-white dark:text-slate-950">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Odblokowujesz:
              </p>

              <div className="mt-3 space-y-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
                <div>✅ {featureName}</div>
                <div>✅ bardziej rozbudowany workflow nauki</div>
                <div>✅ mocniejsze funkcje AI i premium tools</div>
                <div>✅ lepsze doświadczenie przy regularnej nauce</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
          >
            {ctaLabel}
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Zostań przy darmowej wersji
          </button>
        </div>
      </div>
    </div>
  );
}