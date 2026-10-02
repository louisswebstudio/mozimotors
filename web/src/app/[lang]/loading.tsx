import { MoziMark } from "@/components/brand-loader";

/** Route-transition fallback: the favicon mark drawing itself on a loop. */
export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="mz-route flex min-h-[60vh] items-center justify-center">
      <MoziMark className="w-40" />
    </div>
  );
}
