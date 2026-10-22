import { PlanCheckout } from "@/components/plan-checkout";

export default function CheckoutPage() {
  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10">
      <div className="mx-auto grid w-full max-w-300 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20">
        <div>
          <h1 className="type-h1 text-e2e-text-primary">
            Paddle checkout,
            <br />
            tested end to end
          </h1>
          <p className="mt-4 max-w-120 type-body text-e2e-text-secondary">
            A real Paddle subscription in a sandbox, tested with e2e: in the browser, and against what Paddle recorded.
          </p>
          <p className="mt-8 type-code-s text-e2e-text-faint">
            Test card 4242 4242 4242 4242, any future expiry, CVC 100.
          </p>
        </div>

        <PlanCheckout />
      </div>
    </main>
  );
}
