"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const freeFeatures = [
  "Analiza tekstu i podstawowe podsumowania",
  "Fiszki i quiz dla pojedynczych materiałów",
  "Historia ostatnich analiz",
  "Podstawowy dashboard nauki",
];

const proFeatures = [
  "Pełny workflow nauki w jednym miejscu",
  "Lepsza organizacja materiałów i biblioteka",
  "Zaawansowane fiszki i powtórki spaced repetition",
  "Tryby nauki premium i większa wygoda pracy",
  "Bardziej profesjonalny układ aplikacji",
  "Gotowość pod dalszy rozwój produktu",
];

const faqs = [
  {
    question: "Czy mogę zacząć za darmo?",
    answer:
      "Tak. Darmowy plan pozwala sprawdzić podstawowe działanie aplikacji i zobaczyć cały flow pracy z materiałami.",
  },
  {
    question: "Dla kogo jest plan Pro?",
    answer:
      "Dla osób, które chcą korzystać z NoteFlow AI regularnie i traktować go jak realne narzędzie do nauki.",
  },
  {
    question: "Czy mogę zrobić upgrade później?",
    answer:
      "Tak. Najpierw możesz wejść do wersji darmowej, a potem przejść na Pro, gdy będziesz chcieć pełniejszego workflow.",
  },
];

function InfoCard({
  label,
  title,
  description,
  icon,
}: {
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-lg font-bold text-slate-950 dark:text-slate-100">
        {title}
      </p>
      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}

export default function PricingPage() {
  async function handleCheckout() {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        alert(data.error || "Nie udało się uruchomić Stripe Checkout.");
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("[CHECKOUT CLIENT ERROR]", error);
      alert("Błąd połączenia ze Stripe.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-6 py-8 dark:border-slate-800 md:px-8 md:py-10">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                Pricing
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-slate-100">
                Prosty pricing, który wygląda jak produkt SaaS
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
                Bez miliona pakietów i bez chaosu. Tylko jasna różnica między
                planem darmowym a planem Pro.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Wróć do dashboardu
                </Link>

                <a
                  href="#plans"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
                >
                  Zobacz plany
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-3 md:px-8">
            <InfoCard
              label="Szybki start"
              title="Zacznij bez bariery wejścia"
              description="Darmowy plan pozwala wejść do produktu i zobaczyć, jak działa cały flow."
              icon={<Zap className="h-5 w-5" />}
            />
            <InfoCard
              label="Realna wartość"
              title="Pro ma dawać wygodę i porządek"
              description="Lepsza organizacja, bardziej premium workflow i większa wygoda codziennej nauki."
              icon={<Crown className="h-5 w-5" />}
            />
            <InfoCard
              label="Bezpieczny wybór"
              title="Czytelny i prosty komunikat"
              description="Zero przeładowania i zero miliona pakietów. Tylko to, co naprawdę ma sens."
              icon={<ShieldCheck className="h-5 w-5" />}
            />
          </div>
        </section>

        <section id="plans" className="mt-10 grid gap-6 xl:grid-cols-2">
          <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Free
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100">
                  0 zł
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Dobry na start i pierwsze testowanie aplikacji.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Start
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {freeFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-700 dark:text-slate-200" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard"
              className="mt-7 inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Korzystaj za darmo
            </Link>
          </div>

          <div className="rounded-[32px] border border-slate-950 bg-slate-950 p-7 text-white shadow-[0_20px_60px_rgba(15,23,42,0.24)] dark:border-white dark:bg-white dark:text-slate-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] dark:border-slate-300 dark:bg-slate-100">
                  <Crown className="h-3.5 w-3.5" />
                  Recommended
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 dark:text-slate-500">
                  Pro
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  19 zł
                  <span className="text-base font-semibold text-white/70 dark:text-slate-500">
                    {" "}
                    / mies.
                  </span>
                </h2>
                <p className="mt-2 text-sm leading-7 text-white/80 dark:text-slate-600">
                  Dla osób, które chcą z NoteFlow AI zrobić realne narzędzie do
                  nauki.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {proFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 dark:border-slate-200 dark:bg-slate-50"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-white dark:text-slate-900" />
                  <span className="text-sm text-white/90 dark:text-slate-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 dark:bg-slate-950 dark:text-white"
            >
              Wybierz Pro
            </button>

            <p className="mt-3 text-center text-xs text-white/60 dark:text-slate-500">
              Kliknięcie uruchamia checkout Stripe.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100">
              Najczęstsze pytania
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {faqs.map((item) => (
              <div
                key={item.question}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
              >
                <h3 className="text-base font-bold text-slate-950 dark:text-slate-100">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Final CTA
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100">
                Zacznij budować swój lepszy system nauki
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Wejdź do aplikacji, przetestuj workflow i dopiero potem zdecyduj,
                czy chcesz wejść w Pro.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
              >
                Otwórz aplikację
              </Link>

              <a
                href="#plans"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Porównaj plany
              </a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}