"use client";

import Link from "next/link";
import { ArrowRight, Lock, Sparkles } from "lucide-react";

type PremiumEmptyStateProps = {
  title: string;
  description: string;
  badge?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function PremiumEmptyState({
  title,
  description,
  badge,
  ctaHref = "/dashboard",
  ctaLabel = "Wróć do pracy",
  secondaryHref,
  secondaryLabel,
}: PremiumEmptyStateProps) {
  return (
    <div className="rounded-[30px] border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950/60">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
          <Lock className="h-6 w-6" />
        </div>

        {badge ? (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <Sparkles className="h-3.5 w-3.5" />
            {badge}
          </div>
        ) : null}

        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
          {title}
        </h3>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          {description}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>

          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}