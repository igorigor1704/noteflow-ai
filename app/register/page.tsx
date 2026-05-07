"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Sparkles } from "lucide-react";
import { createClient } from "../lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function ensureUserRows(userId: string, userEmail: string) {
    await supabase.from("profiles").upsert(
      {
        id: userId,
        email: userEmail,
        full_name: "",
        avatar_url: "",
        bio: "",
        learning_style: "mixed",
        daily_goal_minutes: 30,
        plan: "free",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    await supabase.from("user_stats").upsert(
      {
        user_id: userId,
        streak: 0,
        total_study_minutes: 0,
        total_analyses: 0,
        total_flashcards_reviewed: 0,
        total_quiz_attempts: 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.user) {
        await ensureUserRows(data.user.id, data.user.email || email);
      }

      alert("Konto utworzone. Teraz możesz się zalogować.");
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

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
                Utwórz konto
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Konto jest potrzebne, żeby NoteFlow AI mogło działać jak
                prawdziwy SaaS: zapis analiz, statystyki, historia materiałów i
                później plan PRO przypisany do użytkownika.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Profil
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-950 dark:text-slate-100">
                    Startuje jako plan free
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Statystyki
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-950 dark:text-slate-100">
                    Tworzą się automatycznie w Supabase
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Następny etap
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-950 dark:text-slate-100">
                    Zapisywanie analiz do konta użytkownika
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <form
                onSubmit={handleRegister}
                className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Register
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                  Załóż konto
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Po rejestracji utworzymy profil i statystyki w Supabase.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="twoj@email.pl"
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Hasło
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 znaków"
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950"
                >
                  <UserPlus className="h-4 w-4" />
                  {loading ? "Tworzenie konta..." : "Utwórz konto"}
                </button>

                <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
                  Masz już konto?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-slate-950 underline-offset-4 hover:underline dark:text-white"
                  >
                    Zaloguj się
                  </Link>
                </p>

                <Link
                  href="/pricing"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Zobacz pricing
                </Link>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}