"use client";
import { NewtonIteration } from "@/lib/newton";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface ResultsTableProps {
  iterations: NewtonIteration[];
  root: number | null;
  converged: boolean;
  diverged: boolean;
  message: string;
  func: string;
}

function formatNum(n: number, places = 8): string {
  if (!isFinite(n)) return String(n);
  if (Math.abs(n) < 1e-4 && n !== 0) return n.toExponential(6);
  return n.toPrecision(places);
}

export default function ResultsTable({
  iterations,
  root,
  converged,
  diverged,
  message,
  func,
}: ResultsTableProps) {
  const statusColor = converged
    ? "text-green-700 bg-green-50 border-green-200"
    : diverged
    ? "text-red-700 bg-red-50 border-red-200"
    : "text-yellow-700 bg-yellow-50 border-yellow-200";

  const StatusIcon = converged ? CheckCircle : diverged ? XCircle : AlertCircle;

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-body ${statusColor}`}>
        <StatusIcon size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">{converged ? "Root Found!" : diverged ? "Diverged" : "Max Iterations Reached"}</p>
          <p className="mt-0.5 opacity-90">{message}</p>
          {root !== null && (
            <p className="mt-1 font-mono font-semibold">
              Root ≈ {root.toPrecision(12)}
            </p>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Iterations", value: iterations.length },
          {
            label: "Final |error|",
            value:
              iterations.length > 0
                ? iterations[iterations.length - 1].error.toExponential(3)
                : "—",
          },
          {
            label: "f(root)",
            value:
              iterations.length > 0
                ? iterations[iterations.length - 1].f_x_n.toExponential(3)
                : "—",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-border rounded-xl p-3 text-center"
          >
            <p className="text-xs text-muted font-body mb-1">{s.label}</p>
            <p className="font-mono font-semibold text-ink text-sm">{String(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border bg-ink/[0.03]">
              {["n", "xₙ", "f(xₙ)", "f′(xₙ)", "xₙ₊₁", "|error|"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-display font-semibold text-muted uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {iterations.map((it, i) => (
              <tr
                key={it.n}
                className={`border-b border-border/50 transition-colors hover:bg-accent/5 ${
                  i === iterations.length - 1 && converged
                    ? "bg-green-50/60"
                    : ""
                }`}
              >
                <td className="px-4 py-2.5 text-muted font-semibold">{it.n}</td>
                <td className="px-4 py-2.5 text-ink">{formatNum(it.x_n)}</td>
                <td className="px-4 py-2.5 text-ink">{formatNum(it.f_x_n)}</td>
                <td className="px-4 py-2.5 text-ink">{formatNum(it.f_prime_x_n)}</td>
                <td className="px-4 py-2.5 font-semibold text-accent-2">
                  {formatNum(it.x_next)}
                </td>
                <td className="px-4 py-2.5 text-muted">
                  {it.error.toExponential(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {iterations.length === 0 && (
          <div className="py-8 text-center text-muted text-sm">No iterations to display.</div>
        )}
      </div>
    </div>
  );
}
