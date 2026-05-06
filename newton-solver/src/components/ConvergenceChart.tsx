"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { NewtonIteration } from "@/lib/newton";

interface ConvergenceChartProps {
  iterations: NewtonIteration[];
  root: number | null;
}

export default function ConvergenceChart({ iterations, root }: ConvergenceChartProps) {
  const errorData = iterations.map((it) => ({
    n: it.n,
    "log₁₀ |error|": it.error > 0 ? Math.log10(it.error) : null,
    "|error|": it.error,
  }));

  const xData = iterations.map((it) => ({
    n: it.n,
    xₙ: parseFloat(it.x_n.toPrecision(8)),
    "xₙ₊₁": parseFloat(it.x_next.toPrecision(8)),
  }));

  return (
    <div className="space-y-6">
      {/* Convergence of x_n */}
      <div>
        <h3 className="text-sm font-display font-semibold text-ink mb-3">
          Convergence of xₙ Toward the Root
        </h3>
        <div className="bg-white border border-border rounded-xl p-4">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={xData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2dfd8" />
              <XAxis
                dataKey="n"
                label={{ value: "Iteration n", position: "insideBottom", offset: -2, fontSize: 11 }}
                tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
              />
              <YAxis
                tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
                tickFormatter={(v: number) =>
                  Math.abs(v) > 1000 ? v.toExponential(1) : String(parseFloat(v.toPrecision(4)))
                }
              />
              <Tooltip
                formatter={(v: number) => [v.toPrecision(8), ""]}
                labelFormatter={(l) => `Iteration ${l}`}
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 11 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: "DM Sans" }} />
              {root !== null && (
                <ReferenceLine
                  y={root}
                  stroke="#e85d3a"
                  strokeDasharray="5 3"
                  label={{ value: `root≈${root.toPrecision(5)}`, position: "right", fontSize: 10 }}
                />
              )}
              <Line
                type="monotone"
                dataKey="xₙ"
                stroke="#3a7bd5"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted mt-2">
          The blue line shows how xₙ approaches the root (red dashed line) with each iteration.
        </p>
      </div>

      {/* Error convergence */}
      <div>
        <h3 className="text-sm font-display font-semibold text-ink mb-3">
          Error Convergence (log₁₀ scale)
        </h3>
        <div className="bg-white border border-border rounded-xl p-4">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={errorData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2dfd8" />
              <XAxis
                dataKey="n"
                label={{ value: "Iteration n", position: "insideBottom", offset: -2, fontSize: 11 }}
                tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
              />
              <YAxis
                tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
                label={{ value: "log₁₀ |error|", angle: -90, position: "insideLeft", fontSize: 11, offset: 10 }}
              />
              <Tooltip
                formatter={(v: number) => [v !== null ? v.toFixed(4) : "N/A", "log₁₀ |error|"]}
                labelFormatter={(l) => `Iteration ${l}`}
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="log₁₀ |error|"
                stroke="#e85d3a"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted mt-2">
          Steep downward slope indicates fast (quadratic) convergence — a hallmark of Newton&apos;s Method.
        </p>
      </div>
    </div>
  );
}
