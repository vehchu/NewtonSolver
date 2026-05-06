"use client";
import { NewtonIteration } from "@/lib/newton";

interface StepsViewProps {
  iterations: NewtonIteration[];
  func: string;
}

function formatNum(n: number): string {
  if (!isFinite(n)) return String(n);
  if (Math.abs(n) < 1e-4 && n !== 0) return n.toExponential(6);
  return n.toPrecision(8);
}

export default function StepsView({ iterations, func }: StepsViewProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted font-body mb-4">
        Newton&apos;s Method formula:{" "}
        <span className="font-mono bg-ink/5 px-2 py-0.5 rounded text-ink">
          x&#8342;&#8330;&#8321; = x&#8342; − f(x&#8342;) / f′(x&#8342;)
        </span>
      </p>

      {iterations.map((it) => (
        <div
          key={it.n}
          className="bg-white border border-border rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-ink/[0.03] border-b border-border">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent text-white text-xs font-display font-bold flex items-center justify-center">
                {it.n}
              </span>
              <span className="text-sm font-display font-semibold text-ink">
                Iteration {it.n}
              </span>
            </div>
            <span className="text-xs font-mono text-muted">
              |err| = {it.error.toExponential(4)}
            </span>
          </div>

          {/* Steps */}
          <div className="p-4 space-y-2 font-mono text-sm">
            <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
              <span className="text-muted w-24 shrink-0">Current x:</span>
              <span className="text-ink font-semibold">x&#8342; = {formatNum(it.x_n)}</span>
            </div>
            <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
              <span className="text-muted w-24 shrink-0">f(x&#8342;):</span>
              <span className="text-ink">
                f({formatNum(it.x_n)}) = <span className="font-semibold">{formatNum(it.f_x_n)}</span>
              </span>
            </div>
            <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
              <span className="text-muted w-24 shrink-0">f′(x&#8342;):</span>
              <span className="text-ink">
                f′({formatNum(it.x_n)}) = <span className="font-semibold">{formatNum(it.f_prime_x_n)}</span>
              </span>
            </div>
            <hr className="border-border my-2" />
            <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
              <span className="text-muted w-24 shrink-0">Step:</span>
              <span className="text-ink">
                {formatNum(it.x_n)} − ({formatNum(it.f_x_n)}) / ({formatNum(it.f_prime_x_n)})
              </span>
            </div>
            <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
              <span className="text-muted w-24 shrink-0">x&#8342;&#8330;&#8321;:</span>
              <span className="text-accent-2 font-bold text-base">
                {formatNum(it.x_next)}
              </span>
            </div>
          </div>
        </div>
      ))}

      {iterations.length === 0 && (
        <p className="text-center text-muted text-sm py-8">No iterations yet.</p>
      )}
    </div>
  );
}
