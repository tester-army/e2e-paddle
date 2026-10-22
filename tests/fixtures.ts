import { type Browser, test as base } from "@e2e-dev/web";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { expect, unique } from "e2e";
import { setTimeout as sleep } from "node:timers/promises";

const key = process.env.PADDLE_API_KEY;
// Sandbox keys contain _sdbx. A live key fails loudly instead of skipping.
if (key && !key.includes("_sdbx")) throw new Error("The e2e tests only run against a Paddle sandbox key.");

export const skip =
  !key || !process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
    ? "set PADDLE_API_KEY and NEXT_PUBLIC_PADDLE_CLIENT_TOKEN to run the Paddle tests"
    : !process.env.AI_GATEWAY_API_KEY
      ? "set AI_GATEWAY_API_KEY to run the agent tests"
      : false;

export const PADDLE_FRAME = 'iframe[name="paddle_frame"]';

// Clicks inside Paddle's checkout are exact; the agent fills in the form and checks what it shows.
export function paddleCheckout(browser: Browser) {
  return browser.frameLocator(PADDLE_FRAME);
}

// Paddle's sandbox runs cards through Stripe, whose 3D Secure test page sits three frames inside Paddle's.
export function threeDSecurePage(browser: Browser) {
  return paddleCheckout(browser)
    .frameLocator('iframe[name="iframe-challenge"]')
    .frameLocator('iframe[name^="__privateStripeFrame"]')
    .frameLocator('iframe[name="stripe-challenge-frame"]');
}

type OpenCheckout = () => Promise<string>;

const withPaddle = base.extend<{ paddle: Paddle }>({
  paddle: async ({}, use) => {
    await use(new Paddle(key ?? "", { environment: Environment.sandbox }));
  },
});

export const test = withPaddle.extend<{ openCheckout: OpenCheckout }>({
  openCheckout: async ({ browser, screen, paddle }, use) => {
    const transactionIds: string[] = [];
    await use(async () => {
      const created = browser.waitForResponse("**/checkout");
      await screen.getByRole("button", "Subscribe").click();
      const { transactionId } = (await (await created).json()) as { transactionId: string };
      transactionIds.push(transactionId);
      await expect(browser.locator(PADDLE_FRAME)).toBeVisible({ timeout: 15_000 });
      // A native <select> never shows its options in a screenshot, so a locator picks the country.
      await paddleCheckout(browser).getByLabel("Country").selectOption(COUNTRY);
      return transactionId;
    });
    // Cancel what this test subscribed, even after a failure.
    for (const id of transactionIds) {
      const subscriptionId = await subscriptionOf(paddle, id);
      if (subscriptionId) await paddle.subscriptions.cancel(subscriptionId, { effectiveFrom: "immediately" });
    }
  },
});

// The subscription appears a moment after the payment.
async function subscriptionOf(paddle: Paddle, transactionId: string): Promise<string | null> {
  for (let attempt = 1; ; attempt++) {
    const { subscriptionId, payments } = await paddle.transactions.get(transactionId);
    const paid = payments.some((payment) => payment.status === "captured" || payment.status === "authorized");
    if (subscriptionId || !paid || attempt === 10) return subscriptionId;
    await sleep(1000);
  }
}

// A fixed country, so Paddle asks for the same fields everywhere.
export const COUNTRY = "United Kingdom";

// A new email per test: Paddle's sandbox blocks a customer after many failed payments.
export function shopper() {
  return {
    email: unique(`ada+${Date.now()}@example.com`),
    postcode: "SW1A 1AA",
    name: "Ada Lovelace",
    expiry: "12/34",
    cvc: "100",
  };
}

export const CARDS = {
  visa: "4242 4242 4242 4242",
  declined: "4000 0000 0000 0002",
  threeDSecure: "4000 0038 0000 0446",
};

export function daysUntil(isoDate: string | null): number {
  return isoDate ? (Date.parse(isoDate) - Date.now()) / 86_400_000 : NaN;
}
