import type { ReactNode } from "react";

import { formatUsd, PLAN } from "@/lib/plan";

export function PlanCard({ children }: { children: ReactNode }) {
  const price = formatUsd(PLAN.amount);

  return (
    <section
      aria-labelledby="plan-heading"
      className="flex flex-col gap-6 border border-e2e-hairline-strong bg-e2e-panel p-5"
    >
      <h2 id="plan-heading" className="type-h3-display text-e2e-text-primary">
        {PLAN.name}
      </h2>

      <p className="flex items-baseline gap-2">
        <span className="type-h2 text-e2e-text-bright">{price}</span>
        <span className="type-body-s text-e2e-text-secondary">/ {PLAN.interval}</span>
      </p>

      <dl className="flex flex-col gap-3 border-t border-e2e-hairline-strong pt-4 type-body-s">
        <div className="flex justify-between gap-4 font-medium text-e2e-text-bright">
          <dt>Due today</dt>
          <dd data-testid="due-today">{price}</dd>
        </div>
        <div className="flex justify-between gap-4 text-e2e-text-soft">
          <dt>Then</dt>
          <dd>
            {price}/{PLAN.interval}
          </dd>
        </div>
      </dl>

      {children}
      <p className="type-caption text-e2e-text-faint">Paddle&apos;s checkout opens over this page.</p>
    </section>
  );
}
