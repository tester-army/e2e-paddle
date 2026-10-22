// Amounts in cents.
export const PLAN = { name: "e2e Pro", amount: 2000, interval: "month" } as const;

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatUsd(cents: number): string {
  return usd.format(cents / 100);
}
