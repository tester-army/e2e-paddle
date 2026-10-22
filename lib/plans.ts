// The three prices of the "E2E" product in Paddle. Amounts are in cents, before tax.
// The price ids live in .env.local: they differ per sandbox, and only the server reads them.
export const PLANS = [
  { key: "one-time", name: "One-time", amount: 1999, interval: null, trialDays: 0, action: "Buy once" },
  { key: "pro", name: "Pro", amount: 4999, interval: "month", trialDays: 7, action: "Start free trial" },
  { key: "ultra", name: "Ultra", amount: 9999, interval: "month", trialDays: 0, action: "Subscribe" },
] as const;

export type Plan = (typeof PLANS)[number];
export type PlanKey = Plan["key"];

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatUsd(cents: number): string {
  return usd.format(cents / 100);
}
