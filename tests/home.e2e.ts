import { test } from "@e2e-dev/web";
import { expect } from "e2e";

test("the checkout shows the plan, what's due today, and the Subscribe button", async ({ app, screen }) => {
  await app.open("/");

  await expect(screen.getByRole("heading", "Paddle checkout, tested end to end")).toBeVisible();
  await expect(screen.getByRole("heading", "e2e Pro")).toBeVisible();
  await expect(screen.getByTestId("due-today")).toHaveText("$20.00");
  await expect(screen.getByRole("button", "Subscribe")).toBeVisible();
});

test("a failing /checkout shows our own error", async ({ app, browser, screen }) => {
  await browser.route("**/checkout", (route) => route.fulfill({ status: 500, json: { error: "Paddle is down" } }));
  await app.open("/");

  await screen.getByRole("button", "Subscribe").click();
  await expect(screen.getByTestId("checkout-error")).toHaveText("Couldn't start the checkout. Try again.");
});
