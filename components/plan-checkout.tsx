"use client";

import { CheckoutEventNames, initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useEffect, useRef, useState } from "react";

import { CheckoutMessage } from "@/components/checkout-message";
import { PlanCard } from "@/components/plan-card";
import { LightButton } from "@/components/ui/light-button";

const TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";

type Message = { kind: "notice" | "error"; text: string };

export function PlanCheckout() {
  const paddle = useRef<Promise<Paddle | undefined>>(Promise.resolve(undefined));
  const completed = useRef(false);
  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    // Sandbox tokens only.
    if (TOKEN.startsWith("test_")) {
      paddle.current = initializePaddle({
        environment: "sandbox",
        token: TOKEN,
        eventCallback: (event) => {
          if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) completed.current = true;
          if (event.name === CheckoutEventNames.CHECKOUT_CLOSED && !completed.current) {
            setMessage({ kind: "notice", text: "Checkout closed. Nothing was charged." });
          }
        },
      });
    }
    // Enable the button once a click can open the checkout.
    paddle.current.finally(() => setReady(true));
  }, []);

  async function openCheckout() {
    setOpening(true);
    setMessage(null);
    completed.current = false;
    try {
      const instance = await paddle.current;
      if (!instance) throw new Error("Paddle.js didn't load. Is NEXT_PUBLIC_PADDLE_CLIENT_TOKEN set?");

      const response = await fetch("/checkout", { method: "POST" });
      if (!response.ok) throw new Error(`POST /checkout answered ${response.status}`);
      const { transactionId } = (await response.json()) as { transactionId: string };

      instance.Checkout.open({
        transactionId,
        settings: {
          displayMode: "overlay",
          theme: "dark",
          variant: "one-page",
          allowedPaymentMethods: ["card"],
          successUrl: `${window.location.origin}/return?transaction_id=${transactionId}`,
        },
      });
    } catch (error) {
      console.error(error);
      setMessage({ kind: "error", text: "Couldn't start the checkout. Try again." });
    } finally {
      setOpening(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PlanCard>
        <LightButton disabled={!ready || opening} aria-busy={opening} onClick={openCheckout}>
          {opening ? "Opening checkout…" : "Subscribe"}
        </LightButton>
      </PlanCard>
      {message && <CheckoutMessage kind={message.kind}>{message.text}</CheckoutMessage>}
    </div>
  );
}
