import type { ReactNode } from "react";

import { formatUsd, type Plan } from "@/lib/plans";

export function PlanCard({ plan, children }: { plan: Plan; children: ReactNode }) {
  const price = formatUsd(plan.amount);
  const dueToday = plan.trialDays > 0 ? formatUsd(0) : price;
  const then = plan.interval
    ? `${price}/${plan.interval}${plan.trialDays > 0 ? ` after ${plan.trialDays} days` : ""}`
    : "Nothing";

  return (
    <section
      aria-labelledby={`plan-${plan.key}`}
      data-testid={`plan-${plan.key}`}
      className="flex flex-col gap-6 border border-e2e-hairline-strong bg-e2e-panel p-5"
    >
      <div className="flex h-7 items-center justify-between gap-4">
        <h2 id={`plan-${plan.key}`} className="type-h3-display text-e2e-text-primary">
          {plan.name}
        </h2>
        {plan.trialDays > 0 && (
          <span className="border border-e2e-chip-stroke px-2 type-label-xs text-e2e-text-soft">
            {plan.trialDays}-day free trial
          </span>
        )}
      </div>

      <p className="flex items-baseline gap-2">
        <span className="type-h2 text-e2e-text-bright">{price}</span>
        <span className="type-body-s text-e2e-text-secondary">{plan.interval ? `/ ${plan.interval}` : "once"}</span>
      </p>

      <dl className="flex flex-col gap-3 border-t border-e2e-hairline-strong pt-4 type-body-s">
        <div className="flex justify-between gap-4 font-medium text-e2e-text-bright">
          <dt>Due today</dt>
          <dd data-testid={`due-today-${plan.key}`}>{dueToday}</dd>
        </div>
        <div className="flex justify-between gap-4 text-e2e-text-soft">
          <dt>Then</dt>
          <dd>{then}</dd>
        </div>
      </dl>

      <div className="mt-auto">{children}</div>
    </section>
  );
}
