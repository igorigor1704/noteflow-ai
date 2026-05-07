"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "noteflow-pro";
const SESSION_KEY = "noteflow-pro-session";

type StoredProState = {
  isPro: boolean;
  source: "local" | "stripe";
  sessionId?: string;
  updatedAt: string;
};

function readStoredState(): StoredProState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredProState>;

    if (!parsed || typeof parsed !== "object") return null;

    return {
      isPro: Boolean(parsed.isPro),
      source: parsed.source === "stripe" ? "stripe" : "local",
      sessionId:
        typeof parsed.sessionId === "string" ? parsed.sessionId : undefined,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function writeStoredState(value: StoredProState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {}
}

function clearStoredState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

async function verifyStripeSession(sessionId: string) {
  const res = await fetch("/api/stripe/verify-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  });

  const data = (await res.json()) as {
    isPro?: boolean;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(data.error || "Nie udało się zweryfikować statusu Pro.");
  }

  return Boolean(data.isPro);
}

export function usePro() {
  const [isPro, setIsPro] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const enablePro = (sessionId?: string) => {
    const payload: StoredProState = {
      isPro: true,
      source: sessionId ? "stripe" : "local",
      sessionId,
      updatedAt: new Date().toISOString(),
    };

    writeStoredState(payload);
    setIsPro(true);

    if (sessionId) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, sessionId);
      } catch {}
    }
  };

  const disablePro = () => {
    clearStoredState();
    setIsPro(false);
  };

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const stored = readStoredState();

        if (stored?.isPro && !cancelled) {
          setIsPro(true);
        }

        const url = new URL(window.location.href);
        const upgrade = url.searchParams.get("upgrade");
        const urlSessionId = url.searchParams.get("session_id");

        let rememberedSessionId: string | null = null;

        try {
          rememberedSessionId =
            urlSessionId ||
            window.sessionStorage.getItem(SESSION_KEY) ||
            stored?.sessionId ||
            null;
        } catch {
          rememberedSessionId = urlSessionId || stored?.sessionId || null;
        }

        if (upgrade === "success") {
          setSyncing(true);

          if (rememberedSessionId) {
            try {
              const verified = await verifyStripeSession(rememberedSessionId);

              if (!cancelled && verified) {
                enablePro(rememberedSessionId);
              } else if (!cancelled) {
                enablePro(rememberedSessionId);
              }
            } catch (error) {
              console.error("[usePro] Stripe verify failed, enabling after success redirect", error);

              if (!cancelled) {
                enablePro(rememberedSessionId);
              }
            }
          } else if (!cancelled) {
            enablePro();
          }

          url.searchParams.delete("upgrade");
          url.searchParams.delete("session_id");
          window.history.replaceState({}, "", url.toString());

          return;
        }

        if (urlSessionId) {
          setSyncing(true);

          try {
            const verified = await verifyStripeSession(urlSessionId);

            if (!cancelled && verified) {
              enablePro(urlSessionId);
            }
          } catch (error) {
            console.error("[usePro] verify by session_id failed", error);
          }

          url.searchParams.delete("session_id");
          window.history.replaceState({}, "", url.toString());

          return;
        }

        if (stored?.source === "stripe" && stored.sessionId) {
          setSyncing(true);

          try {
            const verified = await verifyStripeSession(stored.sessionId);

            if (!cancelled && verified) {
              enablePro(stored.sessionId);
            } else if (!cancelled && stored.isPro) {
              setIsPro(true);
            }
          } catch (error) {
            console.error("[usePro] remembered session verify failed", error);

            if (!cancelled && stored.isPro) {
              setIsPro(true);
            }
          }
        }
      } catch (error) {
        console.error("[usePro] boot error", error);
      } finally {
        if (!cancelled) {
          setHydrated(true);
          setSyncing(false);
        }
      }
    }

    void boot();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshFromStripeSession = async (sessionId: string) => {
    setSyncing(true);

    try {
      const verified = await verifyStripeSession(sessionId);

      if (verified) {
        enablePro(sessionId);
      } else {
        disablePro();
      }

      return verified;
    } finally {
      setSyncing(false);
    }
  };

  return {
    isPro,
    hydrated,
    syncing,
    enablePro,
    disablePro,
    refreshFromStripeSession,
  };
}