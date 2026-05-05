"use client";

import Link from "next/link";
import { LogIn, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-slate-200 p-8 dark:border-slate-800 lg:border-b-0 lg:border-r">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                NoteFlow AI
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-slate-100">
                Zaloguj się do aplikacji
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                W tej wersji możesz wejść bez rozbudowanego flow logowania i
                przejść od razu do dashboardu. Najważniejsze jest teraz
                dokończenie i pokazanie produktu.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Krok 1
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-950 dark:text-slate-100">
                    Wejdź do dashboardu
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Krok 2
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-950 dark:text-slate-100">
                    Załaduj demo albo dodaj własny materiał
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Krok 3
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-950 dark:text-slate-100">
                    Korzystaj z quizów, fiszek i planu nauki
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Login
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                  Szybkie wejście
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Logowanie możesz dopracować później. Teraz najważniejsze jest,
                  żeby aplikacja działała i była gotowa do pokazania.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
                  >
                    <LogIn className="h-4 w-4" />
                    Wejdź do dashboardu
                  </Link>

                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    Zobacz pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}