import { PlanCard } from "@/components/plan-card";
import { LightButton } from "@/components/ui/light-button";
import { PLANS } from "@/lib/plans";

export default function CheckoutPage() {
  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-300 flex-col gap-12">
        <div>
          <h1 className="type-h1 text-e2e-text-primary">
            Paddle checkout,
            <br />
            tested end to end
          </h1>
          <p className="mt-4 max-w-140 type-body text-e2e-text-secondary">
            A one-time purchase, a free trial, and a subscription in a Paddle sandbox, tested with e2e: in the browser,
            and against what Paddle recorded.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map((plan) => (
              <PlanCard key={plan.key} plan={plan}>
                <LightButton>{plan.action}</LightButton>
              </PlanCard>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <p className="type-caption text-e2e-text-faint">
              Paddle&apos;s checkout opens over this page. Prices in USD, before tax.
            </p>
            <p className="type-code-s text-e2e-text-faint">
              Test card 4242 4242 4242 4242, any future expiry, CVC 100.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
