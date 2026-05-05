"use client";

type Props = {
  totalItems: number;
  favoriteItems: number;
  pinnedItems: number;
  totalTags: number;
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p>
    </div>
  );
}

export default function LibraryStatsBar({
  totalItems,
  favoriteItems,
  pinnedItems,
  totalTags,
}: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Wszystkie analizy"
        value={totalItems}
        hint="Łączna liczba materiałów zapisanych w bibliotece."
      />
      <StatCard
        label="Ulubione"
        value={favoriteItems}
        hint="Analizy oznaczone jako najważniejsze."
      />
      <StatCard
        label="Przypięte"
        value={pinnedItems}
        hint="Materiały, do których chcesz wracać szybciej."
      />
      <StatCard
        label="Tagi"
        value={totalTags}
        hint="Liczba unikalnych tagów użytych w bibliotece."
      />
    </section>
  );
}