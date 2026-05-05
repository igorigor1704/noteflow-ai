import { NextResponse } from "next/server";
import { getStripe } from "../../../lib/stripe/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isSubscriptionActive(status: string | null | undefined) {
  return status === "active" || status === "trialing";
}

export async function POST(req: Request) {
  try {
    const { sessionId } = (await req.json()) as { sessionId?: string };

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Brak sessionId." }, { status: 400 });
    }

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    const subscription =
      typeof session.subscription === "object" && session.subscription
        ? (session.subscription as {
            id: string;
            status?: string | null;
            cancel_at_period_end?: boolean;
            current_period_end?: number;
          })
        : null;

    const subscriptionStatus = subscription?.status ?? null;
    const isPro =
      session.payment_status === "paid" || isSubscriptionActive(subscriptionStatus);

    return NextResponse.json({
      ok: true,
      isPro,
      session: {
        id: session.id,
        mode: session.mode,
        payment_status: session.payment_status,
        customer: session.customer,
        subscription: subscription
          ? {
              id: subscription.id,
              status: subscription.status ?? null,
              cancel_at_period_end: subscription.cancel_at_period_end ?? false,
              current_period_end: subscription.current_period_end ?? null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("[VERIFY SESSION ERROR]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nie udało się zweryfikować sesji Stripe.",
      },
      { status: 500 }
    );
  }
}