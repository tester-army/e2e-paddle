import { describe } from "@e2e-dev/web";
import { expect } from "e2e";

import { CARDS, daysUntil, PADDLE_FRAME, shopper, skip, test } from "./fixtures";

// Paddle picks the country from the shopper's location; some countries also ask for a postcode.
const FILL_CHECKOUT =
  "fill in the checkout form: email {email}, name on card {name}, card number {number}, expiry {expiry}, CVV {cvc}, and, if it asks for one, a postcode valid for the country it shows";

const THREE_D_SECURE =
  "After subscribing, Paddle shows a test 3D Secure page inside its checkout, with Fail and Complete buttons. It can take a few seconds to load.";

// Paddle's checkout isn't built for automation, so these tests retry.
describe("overlay checkout", { tags: ["overlay"], skip, retries: 2, timeout: 180_000 }, () => {
  test("a valid card subscribes at $20.00 a month and Paddle records it", async ({
    app,
    agent,
    screen,
    paddle,
    openCheckout,
  }) => {
    await app.open("/");
    const transactionId = await openCheckout();

    await agent.act(FILL_CHECKOUT, { params: { ...shopper(), number: CARDS.visa } });
    await agent.assert("the card number field shows 4242 4242 4242 4242 and $20.00 is due today", { vision: true });

    await agent.act("click the Subscribe now button");
    await expect(screen.getByTestId("payment-status")).toHaveText("Subscribed", { timeout: 30_000 });

    const transaction = await paddle.transactions.get(transactionId);
    expect(transaction.status).toBe("completed");
    expect(transaction.details?.totals?.grandTotal).toBe("2000");

    const subscription = await paddle.subscriptions.get(transaction.subscriptionId ?? "");
    expect(subscription.status).toBe("active");
    expect(subscription.items[0]?.price.unitPrice.amount).toBe("2000");
    expect(subscription.items[0]?.price.billingCycle).toMatchObject({ interval: "month", frequency: 1 });
    expect(daysUntil(subscription.nextBilledAt)).toBeGreaterThan(27);
    expect(daysUntil(subscription.nextBilledAt)).toBeLessThan(32);
  });

  test(
    "a declined card shows Paddle's error and nothing is charged",
    {
      agentContext:
        "The card is a Paddle test card that is always declined, so a decline message after subscribing is the expected outcome, not a failure.",
    },
    async ({ app, agent, browser, paddle, openCheckout }) => {
      await app.open("/");
      const transactionId = await openCheckout();

      await agent.act(FILL_CHECKOUT, { params: { ...shopper(), number: CARDS.declined } });
      await agent.assert("the card number field shows 4000 0000 0000 0002", { vision: true });

      await agent.act("click the Subscribe now button");
      await agent.waitFor("the checkout says the payment was declined", { vision: true });
      await expect(browser).toHaveURL("/");

      const transaction = await paddle.transactions.get(transactionId);
      expect(transaction).toMatchObject({ status: "ready", subscriptionId: null });
      expect(transaction.payments[0]).toMatchObject({ status: "error", errorCode: "declined" });
    },
  );

  test(
    "3D Secure: completing the challenge subscribes",
    { agentContext: THREE_D_SECURE },
    async ({ app, agent, screen, paddle, openCheckout }) => {
      await app.open("/");
      const transactionId = await openCheckout();

      await agent.act(FILL_CHECKOUT, { params: { ...shopper(), number: CARDS.threeDSecure } });
      await agent.assert("the card number field shows 4000 0038 0000 0446", { vision: true });

      await agent.act("click the Subscribe now button");
      await agent.waitFor("a 3D Secure test page with Fail and Complete buttons is showing", { vision: true });

      await agent.act("click Complete on the 3D Secure test page");
      await expect(screen.getByTestId("payment-status")).toHaveText("Subscribed", { timeout: 30_000 });

      const transaction = await paddle.transactions.get(transactionId);
      expect(transaction.status).toBe("completed");
      expect((await paddle.subscriptions.get(transaction.subscriptionId ?? "")).status).toBe("active");
    },
  );

  test(
    "3D Secure: failing the challenge leaves it unpaid",
    { agentContext: `${THREE_D_SECURE} Failing it is the goal, so an error afterwards is expected.` },
    async ({ app, agent, browser, paddle, openCheckout }) => {
      await app.open("/");
      const transactionId = await openCheckout();

      await agent.act(FILL_CHECKOUT, { params: { ...shopper(), number: CARDS.threeDSecure } });
      await agent.assert("the card number field shows 4000 0038 0000 0446", { vision: true });

      await agent.act("click the Subscribe now button");
      await agent.waitFor("a 3D Secure test page with Fail and Complete buttons is showing", { vision: true });

      await agent.act("click Fail on the 3D Secure test page");
      await agent.waitFor("the checkout shows an error saying the payment didn't go through", { vision: true });
      await expect(browser).toHaveURL("/");

      const transaction = await paddle.transactions.get(transactionId);
      expect(transaction).toMatchObject({ status: "ready", subscriptionId: null });
      expect(transaction.payments[0]?.status).toBe("error");
    },
  );

  test("closing the checkout returns to the page unpaid", async ({
    app,
    agent,
    browser,
    screen,
    paddle,
    openCheckout,
  }) => {
    await app.open("/");
    const transactionId = await openCheckout();

    await agent.waitFor("Paddle's checkout is open over the page and shows e2e Pro at $20.00/month", { vision: true });

    await agent.act("leave the checkout with its Return link at the top left");
    await expect(browser.locator(PADDLE_FRAME)).toBeHidden();
    await expect(screen.getByTestId("checkout-notice")).toHaveText("Checkout closed. Nothing was charged.");
    expect((await paddle.transactions.get(transactionId)).status).toBe("draft");
  });
});
