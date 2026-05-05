"use client";

type SmartQueueItem = {
  id: string;
  title: string;
  description: string;
  badge: string;
  cta: string;
  priority: "high" | "medium" | "low";
};

type TodaySmartQueueProps = {
  items: SmartQueueItem[];
  readyScore: number;
  onScrollToReview: () => void;
  onScrollToResult: () => void;
  onScrollToRemedial: () => void;
  onStartFocus: () => void;
};

function getPriorityStyles(priority: SmartQueueItem["priority"]) {
  switch (priority) {
    case "high":
      return {
        pill: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
        border: "border-rose-200/80 dark:border-rose-500/20",
        dot: "bg-rose-500",
        label: "Wysoki priorytet",
      };
    case "medium":
      return {
        pill: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
        border: "border-amber-200/80 dark:border-amber-500/20",
        dot: "bg-amber-500",
        label: "Średni priorytet",
      };
    default:
      return {
        pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
        border: "border-emerald-200/80 dark:border-emerald-500/20",
        dot: "bg-emerald-500",
        label: "Niższy priorytet",
      };
  }
}

function getActionHandler(
  item: SmartQueueItem,
  actions: Pick<
    TodaySmartQueueProps,
    "onScrollToReview" | "onScrollToResult" | "onScrollToRemedial" | "onStartFocus"
  >
) {
  const key = `${item.title} ${item.description} ${item.badge} ${item.cta}`.toLowerCase();

  if (
    key.includes("powt") ||
    key.includes("review") ||
    key.includes("fiszk") ||
    key.includes("spaced")
  ) {
    return actions.onScrollToReview;
  }

  if (
    key.includes("focus") ||
    key.includes("sesj") ||
    key.includes("timer") ||
    key.includes("pomodoro")
  ) {
    return actions.onStartFocus;
  }

  if (
    key.includes("remed") ||
    key.includes("napraw") ||
    key.includes("weak") ||
    key.includes("słab")
  ) {
    return actions.onScrollToRemedial;
  }

  return actions.onScrollToResult;
}

function FallbackQueue({
  onScrollToReview,
  onScrollToResult,
  onScrollToRemedial,
  onStartFocus,
}: Pick<
  TodaySmartQueueProps,
  "onScrollToReview" | "onScrollToResult" | "onScrollToRemedial" | "onStartFocus"
>) {
  const fallbackItems = [
    {
      id: "review",
      step: "01",
      title: "Powtórz materiał",
      description: "Zamknij dzisiejszą kolejkę spaced repetition.",
      cta: "Start review",
      onClick: onScrollToReview,
    },
    {
      id: "quiz",
      step: "02",
      title: "Wróć do quizu",
      description: "Sprawdź wiedzę i domknij aktywny materiał.",
      cta: "Start quiz",
      onClick: onScrollToResult,
    },
    {
      id: "focus",
      step: "03",
      title: "Uruchom focus",
      description: "Zrób jedną krótką, konkretną sesję nauki.",
      cta: "Start focus",
      onClick: onStartFocus,
    },
    {
      id: "remedial",
      step: "04",
      title: "Popraw słabe tematy",
      description: "Przejdź do pakietu naprawczego i zamknij luki.",
      cta: "Start remedial",
      onClick: onScrollToRemedial,
    },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {fallbackItems.map((item) => (
        <article
          key={item.id}
          className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Krok {item.step}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>

            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
              Dziś
            </span>
          </div>

          <button
            type="button"
            onClick={item.onClick}
            className="mt-5 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
          >
            {item.cta}
          </button>
        </article>
      ))}
    </div>
  );
}

export default function TodaySmartQueue({
  items,
  readyScore,
  onScrollToReview,
  onScrollToResult,
  onScrollToRemedial,
  onStartFocus,
}: TodaySmartQueueProps) {
  const normalizedReadyScore = Math.max(0, Math.min(100, Math.round(readyScore || 0)));
  const hasItems = items.length > 0;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Smart queue
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100 md:text-3xl">
            Co robić teraz
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Ten ekran ma prowadzić, a nie tylko wyglądać. Najpierw robisz to, co daje
            największy efekt: powtórki, focus i domknięcie najsłabszych tematów.
          </p>
        </div>

        <div className="min-w-[240px] rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Ready score
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-slate-100">
                {normalizedReadyScore}%
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
              GO
            </div>
          </div>

          <div className="mt-4 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-2.5 rounded-full bg-slate-950 transition-all dark:bg-white"
              style={{ width: `${normalizedReadyScore}%` }}
            />
          </div>
        </div>
      </div>

      {hasItems ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((item, index) => {
            const styles = getPriorityStyles(item.priority);
            const action = getActionHandler(item, {
              onScrollToReview,
              onScrollToResult,
              onScrollToRemedial,
              onStartFocus,
            });

            return (
              <article
                key={item.id}
                className={`rounded-3xl border bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-950 ${styles.border}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-300">
                        Krok {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${styles.pill}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                        {styles.label}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-slate-100">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                  </div>

                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    {item.badge}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    Smart action
                  </p>

                  <button
                    type="button"
                    onClick={action}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-950"
                  >
                    {item.cta}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <FallbackQueue
          onScrollToReview={onScrollToReview}
          onScrollToResult={onScrollToResult}
          onScrollToRemedial={onScrollToRemedial}
          onStartFocus={onStartFocus}
        />
      )}
    </section>
  );
}