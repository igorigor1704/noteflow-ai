"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("GLOBAL APP ERROR:", error);
  }, [error]);

  return (
    <html lang="pl">
      <body className="bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
        <main className="min-h-screen px-4 py-8 md:px-8">
          <div className="mx-auto max-w-3xl">
            <section className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-sm dark:border-rose-500/30 dark:bg-slate-900">
              
              <div className="mb-4 inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                Error
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                Coś poszło nie tak
              </h1>

              <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
                W aplikacji wystąpił nieoczekiwany błąd. Spróbuj odświeżyć widok
                albo wrócić do dashboardu.
              </p>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  Szczegóły techniczne
                </p>
                <p className="mt-2 break-words text-sm text-slate-700 dark:text-slate-200">
                  {error?.message || "Nieznany błąd aplikacji."}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Spróbuj ponownie
                </button>

                <Link
                  href="/dashboard"
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Wróć do dashboardu
                </Link>

                <Link
                  href="/"
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Strona główna
                </Link>

              </div>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}