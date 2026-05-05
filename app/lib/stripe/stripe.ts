import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (stripeInstance) {
    return stripeInstance;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Brak STRIPE_SECRET_KEY w zmiennych środowiskowych.");
  }

  stripeInstance = new Stripe(secretKey);

  return stripeInstance;
}