import { getPaddle } from "@/lib/paddle";
import { PLAN } from "@/lib/plan";

export async function POST() {
  // An inline price, so a fresh sandbox needs no catalog setup.
  const transaction = await getPaddle().transactions.create({
    currencyCode: "USD",
    items: [
      {
        quantity: 1,
        price: {
          name: "Monthly",
          description: `${PLAN.name}, billed monthly`,
          unitPrice: { amount: String(PLAN.amount), currencyCode: "USD" },
          billingCycle: { interval: PLAN.interval, frequency: 1 },
          // Tax included: $20.00 in every country.
          taxMode: "internal",
          quantity: { minimum: 1, maximum: 1 },
          product: { name: PLAN.name, taxCategory: "standard" },
        },
      },
    ],
  });

  return Response.json({ transactionId: transaction.id });
}
