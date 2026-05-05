export default function Loading() {
  return (
    <main className="min-h-screen bg-transparent px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
            <div className="h-16 w-full max-w-3xl animate-pulse rounded-3xl bg-slate-200" />
            <div className="h-6 w-full max-w-2xl animate-pulse rounded-2xl bg-slate-200" />

            <div className="grid gap-4 md:grid-cols-4">
              <div className="h-28 animate-pulse rounded-[28px] bg-slate-100" />
              <div className="h-28 animate-pulse rounded-[28px] bg-slate-100" />
              <div className="h-28 animate-pulse rounded-[28px] bg-slate-100" />
              <div className="h-28 animate-pulse rounded-[28px] bg-slate-100" />
            </div>

            <div className="h-72 animate-pulse rounded-[28px] bg-slate-100" />
          </div>
        </section>
      </div>
    </main>
  );
}