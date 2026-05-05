export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Brak STRIPE_SECRET_KEY w zmiennych środowiskowych.");
  }

  return new Stripe(secretKey);
}

function getWebhookSecret() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Brak STRIPE_WEBHOOK_SECRET w zmiennych środowiskowych.");
  }

  return webhookSecret;
}

export async function POST(req) {
  try {
    const stripe = getStripe();
    const webhookSecret = getWebhookSecret();

    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Brak nagłówka stripe-signature." },
        { status: 400 }
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      return NextResponse.json(
        {
          error:
            err instanceof Error
              ? `Nieprawidłowy podpis webhooka: ${err.message}`
              : "Nieprawidłowy podpis webhooka.",
        },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        console.log("[STRIPE WEBHOOK] checkout.session.completed", {
          id: session.id,
          customer: session.customer,
          subscription: session.subscription,
          payment_status: session.payment_status,
          mode: session.mode,
        });

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        console.log(`[STRIPE WEBHOOK] ${event.type}`, {
          id: subscription.id,
          customer: subscription.customer,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_end: subscription.current_period_end,
        });

        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        const invoice = event.data.object;

        console.log(`[STRIPE WEBHOOK] ${event.type}`, {
          id: invoice.id,
          customer: invoice.customer,
          subscription: invoice.subscription,
          status: invoice.status,
        });

        break;
      }

      default: {
        console.log(`[STRIPE WEBHOOK] ignored event: ${event.type}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[STRIPE WEBHOOK ERROR]", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Webhook error",
      },
      { status: 500 }
    );
  }
}