import { test } from "@e2e-dev/web";
import { expect } from "e2e";

test("the page shows the three plans and what each costs today", async ({ app, screen }) => {
  await app.open("/");

  await expect(screen.getByRole("heading", "Paddle checkout, tested end to end")).toBeVisible();

  await expect(screen.getByTestId("due-today-one-time")).toHaveText("$19.99");
  await expect(screen.getByRole("button", "Buy once")).toBeVisible();

  await expect(screen.getByTestId("due-today-pro")).toHaveText("$0.00");
  // The chip is uppercased by CSS, and e2e reads the rendered text.
  await expect(screen.getByTestId("plan-pro")).toContainText(/7-day free trial/i);
  await expect(screen.getByRole("button", "Start free trial")).toBeVisible();

  await expect(screen.getByTestId("due-today-ultra")).toHaveText("$99.99");
  await expect(screen.getByRole("button", "Subscribe")).toBeVisible();
});
