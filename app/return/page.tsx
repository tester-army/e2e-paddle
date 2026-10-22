import { ResultPanel } from "@/components/result-panel";
import { OutlineLink } from "@/components/ui/outline-link";

// Phase 1 asks Paddle for the transaction in ?transaction_id=; for now only the empty state.
export default function ReturnPage() {
  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-105 flex-col gap-4">
        <ResultPanel status="No payment" detail="Paddle sends you here after you pay." />
        <OutlineLink href="/">Back to plans</OutlineLink>
      </div>
    </main>
  );
}
