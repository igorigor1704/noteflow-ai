"use client";

type RemedialTopic = {
  title?: string;
  name?: string;
  topic?: string;
  label?: string;
  reason?: string;
  description?: string;
  score?: number;
  priority?: "high" | "medium" | "low";
};

type RemedialStep = {
  title?: string;
  name?: string;
  step?: string;
  description?: string;
  details?: string;
  estimatedMinutes?: number;
};

type RemedialPackPanelProps = {
  topics?: RemedialTopic[];
  steps?: RemedialStep[];
  dueCardsCount?: number;
  hasResult?: boolean;
};

export default function RemedialPackPanel({
  topics = [],
  steps = [],
  dueCardsCount = 0,
  hasResult = false,
}: RemedialPackPanelProps) {
  const safeTopics = Array.isArray(topics) ? topics : [];
  const safeSteps = Array.isArray(steps) ? steps : [];

  const nextStep = safeSteps[0];
  const nextStepTitle =
    nextStep?.title || nextStep?.name || nextStep?.step || "Rozwiąż quiz";
  const nextStepDescription =
    nextStep?.description || nextStep?.details || "";

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">
            AI remedial learning
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Pakiet naprawczy
          </h2>
          <p className="mt-3 text-base leading-8 text-slate-600">
            Ten moduł zamienia Twoje błędy, słabe tematy i zaległe powtórki w
            konkretny plan działania na najbliższą sesję.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <StatBox label="Tematy" value={safeTopics.length} />
          <StatBox label="Krok" value={safeSteps.length} />
          <StatBox label="SRS dziś" value={dueCardsCount} />
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6">
        {!hasResult ? (
          <EmptyState />
        ) : safeTopics.length === 0 && safeSteps.length === 0 ? (
          <ReadyState dueCardsCount={dueCardsCount} />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Następny krok
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                  {nextStepTitle}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {nextStepDescription ||
                    "System przygotował dla Ciebie kolejny krok naprawczy na podstawie wyników quizów i powtórek."}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Rozpocznij plan
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Przejdź do powtórek
                  </button>
                </div>
              </div>

              {safeSteps.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {safeSteps.slice(0, 4).map((item, index) => {
                    const title =
                      item?.title ||
                      item?.name ||
                      item?.step ||
                      `Krok ${index + 1}`;
                    const description =
                      item?.description || item?.details || "";

                    return (
                      <div
                        key={`${title}-${index}`}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {description || "Brak dodatkowego opisu kroku."}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Priorytetowe tematy
                </p>

                {safeTopics.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {safeTopics.slice(0, 5).map((item, index) => {
                      const title =
                        item?.title ||
                        item?.name ||
                        item?.topic ||
                        item?.label ||
                        `Temat ${index + 1}`;

                      const reason =
                        item?.reason ||
                        item?.description ||
                        "Ten obszar wymaga dodatkowego utrwalenia.";

                      const badge =
                        item?.priority === "high"
                          ? "Wysoki"
                          : item?.priority === "low"
                          ? "Niski"
                          : "Średni";

                      const badgeClass =
                        item?.priority === "high"
                          ? "bg-rose-100 text-rose-700"
                          : item?.priority === "low"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700";

                      return (
                        <div
                          key={`${title}-${index}`}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {title}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-slate-600">
                                {reason}
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}
                            >
                              {badge}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    Na ten moment system nie wykrył tematów wymagających
                    dodatkowej pracy.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex h-28 w-24 flex-col items-center justify-center rounded-[22px] border border-slate-200 bg-slate-50">
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </span>
      <span className="mt-2 text-3xl font-bold text-slate-900">{value}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div>
      <p className="text-3xl font-semibold leading-tight text-slate-900">
        Pakiet naprawczy pojawi się po pierwszej pracy
      </p>
      <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
        Gdy wygenerujesz analizę i zaczniesz rozwiązywać quizy albo robić
        powtórki, aplikacja zbuduje dla Ciebie priorytety i plan naprawczy na
        bazie realnych danych.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Wygeneruj analizę
        </button>
        <button
          type="button"
          className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Zobacz jak to działa
        </button>
      </div>
    </div>
  );
}

function ReadyState({ dueCardsCount }: { dueCardsCount: number }) {
  return (
    <div>
      <p className="text-3xl font-semibold leading-tight text-slate-900">
        Dobrze Ci idzie — brak aktywnego pakietu naprawczego
      </p>
      <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
        System nie wykrył obecnie słabych tematów wymagających osobnego planu.
        Skup się na regularnych powtórkach i utrzymaniu rytmu nauki.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-900">
          Powtórki na dziś: {dueCardsCount}
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Wróć do fiszek spaced repetition, żeby utrzymać tempo i nie dopuścić
          do zaległości.
        </p>
      </div>
    </div>
  );
}