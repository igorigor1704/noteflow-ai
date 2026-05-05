"use client";

type WeakTopicsProps = {
  wrongAnswers: Record<string, number>;
};

export default function WeakTopics({ wrongAnswers }: WeakTopicsProps) {
  const items = Object.entries(wrongAnswers)
    .map(([topic, count]) => ({
      topic,
      count,
      mastery: Math.max(10, 100 - count * 12),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Analiza błędów
          </p>
          <h2 className="text-2xl font-semibold">Najsłabsze obszary</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Tematy
          </p>
          <p className="mt-1 text-2xl font-bold">{items.length}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          Nie ma jeszcze danych o błędach. Gdy zaczniesz rozwiązywać quizy,
          tutaj pojawią się tematy wymagające dodatkowej pracy.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.topic}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold">{item.topic}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Błędne odpowiedzi: {item.count}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-right dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Opanowanie
                  </p>
                  <p className="mt-1 text-lg font-bold">{item.mastery}%</p>
                </div>
              </div>

              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-2 rounded-full bg-slate-900 transition-all dark:bg-white"
                  style={{ width: `${item.mastery}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}