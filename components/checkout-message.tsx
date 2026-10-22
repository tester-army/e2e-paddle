import clsx from "clsx";

export function CheckoutMessage({ kind, children }: { kind: "notice" | "error"; children: string }) {
  const error = kind === "error";

  return (
    <p
      role={error ? "alert" : "status"}
      data-testid={error ? "checkout-error" : "checkout-notice"}
      className={clsx(
        "border bg-e2e-panel px-5 py-3",
        error
          ? "border-e2e-accent type-code-s text-e2e-accent"
          : "border-e2e-hairline-strong type-body-s text-e2e-text-soft",
      )}
    >
      {children}
    </p>
  );
}
