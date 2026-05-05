"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  Sparkles,
  Target,
} from "lucide-react";
import { usePro } from "./lib/pro/usePro";

const features = [
  {
    icon: Brain,
    title: "AI study workflow",
    description:
      "Wklejasz materiał, a aplikacja buduje streszczenie, pojęcia, pytania, fiszki i quiz w jednym flow.",
  },
  {
    icon: FileText,
    title: "Analizy gotowe do nauki",
    description:
      "Każdy materiał zamienia się w uporządkowaną analizę, do której możesz wracać z biblioteki.",
  },
  {
    icon: Target,
    title: "Powtórki i focus",
    description:
      "Smart queue, przypomnienia i fiszki pomagają ogarnąć priorytety bez chaosu.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard jak w SaaS",
    description:
      "Jeden panel do nauki, historii materiałów, postępu, quizów i codziennej pracy.",
  },
];

const bullets = [
  "Streszczenia materiałów w kilka sekund",
  "Pojęcia, pytania i fiszki do powtórek",
  "Quizy do szybkiego sprawdzenia wiedzy",
  "Biblioteka analiz i porządek w materiałach",
  "Lepszy workflow do nauki przed kolokwiami i egzaminami",
];

export default function HomePage() {
  const { isPro, hydrated } = usePro();

  return (
    <main className="min-h-screen bg-transparent text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <header className="mb-8 flex items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-950">
                NoteFlow AI
              </p>
              <p className="text-xs text-slate-500">Smart study workspace</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {hydrated && isPro ? "Manage plan" : "Pricing"}
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {hydrated && isPro ? "Open Pro workspace" : "Open app"}
            </Link>
          </nav>
        </header>

        <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="overflow-hidden rounded-[34px] border border-slate-200 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <div className="bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.10),transparent_25%),linear-gradient(180deg,#ffffff,#f8fbff)] px-7 py-8 md:px-10 md:py-12">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-700">
                  AI for studying
                </span>
                <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-500">
                  Workflow zamiast chaosu
                </span>
                {hydrated && isPro ? (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                    Pro active
                  </span>
                ) : null}
              </div>

              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl md:text-6xl md:leading-[1.02]">
                Zamień notatki w uporządkowany system nauki
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                NoteFlow AI pomaga szybciej przerabiać materiały, tworzyć
                fiszki, quizy i plan nauki oraz pracować w jednym, spójnym
                dashboardzie jak w prawdziwym produkcie SaaS.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-500"
                >
                  {hydrated && isPro ? "Wejdź do workspace Pro" : "Wejdź do aplikacji"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {hydrated && isPro ? "Zobacz plan" : "Zobacz plan Pro"}
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {bullets.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <p className="text-sm leading-7 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="grid gap-4">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Dlaczego to działa
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                Jeden materiał, kilka gotowych wyników
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Zamiast ręcznie przerabiać notatki, budujesz od razu gotową
                przestrzeń do nauki i powtórek.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "Wklej tekst albo załaduj materiał",
                  "Wygeneruj analizę z AI",
                  "Pracuj na streszczeniu, pytaniach i fiszkach",
                  "Wracaj do wszystkiego z biblioteki",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-indigo-200 bg-[linear-gradient(180deg,#eef2ff,#ffffff)] p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Pro angle
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                Gotowe pod wersję premium
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Ten interfejs już wygląda jak produkt, do którego łatwo dołożyć
                trial, upgrade, usage limits i pełny billing.
              </p>

              <Link
                href="/pricing"
                className="mt-5 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {hydrated && isPro ? "Zobacz plan" : "Sprawdź pricing"}
              </Link>
            </div>
          </aside>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-[34px] border border-slate-200 bg-white p-8 text-center shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Ready to launch
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Dashboard, biblioteka i workflow już wyglądają jak SaaS
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-600 md:text-base">
            Teraz najwięcej wartości da dopinanie sygnałów premium, triali,
            usage limits i onboarding flow, bo fundament interfejsu masz już
            mocny.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-500"
            >
              Otwórz aplikację
            </Link>
            <Link
              href="/pricing"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {hydrated && isPro ? "Zobacz plan" : "Zobacz pricing"}
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}