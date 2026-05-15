"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { compile } from "mathjs";
import { NewtonIteration } from "@/lib/newton";

interface ConvergenceChartProps {
  iterations: NewtonIteration[];
  root: number | null;
  func: string;
}

/* ── Fixed axis window ───────────────────────────────────────────── */
const MIN = -20;
const MAX = 20;
const RANGE = MAX - MIN; // 40
const CHART_H = 480;
// Must match the margin passed to <ComposedChart>
const M = { top: 16, right: 24, bottom: 32, left: 48 };

const clamp = (v: number) => Math.max(MIN, Math.min(MAX, v));
const inRange = (v: number) => v >= MIN && v <= MAX;
const fmt = (v: number) => String(v);

export default function ConvergenceChart({ iterations, root, func }: ConvergenceChartProps) {
  /* Measure the wrapper so we can compute pixel ↔ data coords */
  const wrapRef = useRef<HTMLDivElement>(null);
  const [plotW, setPlotW] = useState(0);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      setPlotW(e.contentRect.width - M.left - M.right);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const plotH = CHART_H - M.top - M.bottom;

  /** Data value → overlay SVG pixel (relative to plot-area origin) */
  const px = (x: number) => ((x - MIN) / RANGE) * plotW;
  const py = (y: number) => ((MAX - y) / RANGE) * plotH;

  /* ── Sample the function curve ─────────────────────────────────── */
  const curveData = useMemo(() => {
    if (!func) return [];
    let evalF: (x: number) => number;
    try {
      const compiled = compile(func);
      evalF = (x) => compiled.evaluate({ x }) as number;
    } catch { return []; }

    const pts: { x: number; y: number | null }[] = [];
    for (let i = 0; i <= 800; i++) {
      const x = MIN + (i / 800) * RANGE;
      try {
        const y = evalF(x);
        // Out-of-range values → null so the line simply ends (no flat clamping)
        const inBounds = isFinite(y) && y >= MIN && y <= MAX;
        pts.push({ x: parseFloat(x.toPrecision(7)), y: inBounds ? y : null });
      } catch { pts.push({ x, y: null }); }
    }
    return pts;
  }, [func]);

  const axisTicks = [-20, -15, -10, -5, 0, 5, 10, 15, 20];

  return (
    <div>
      {/* Wrapper: recharts chart + SVG overlay stacked */}
      <div className="bg-white border border-border rounded-xl p-4">
        <div ref={wrapRef} style={{ position: "relative", width: "100%", height: CHART_H }}>

          {/* ── Recharts: axes + function curve only ────────────── */}
          <ResponsiveContainer width="100%" height={CHART_H}>
            <ComposedChart data={curveData} margin={M}>
              <CartesianGrid stroke="#e2dfd8" strokeWidth={1} />
              <XAxis dataKey="x" type="number" domain={[MIN, MAX]}
                ticks={axisTicks} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
                tickLine={false} axisLine={{ stroke: "#0a0a0f", strokeWidth: 1.5 }}
                tickFormatter={fmt} />
              <YAxis domain={[MIN, MAX]} ticks={axisTicks}
                tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
                tickLine={false} axisLine={{ stroke: "#0a0a0f", strokeWidth: 1.5 }}
                tickFormatter={fmt} width={40} />
              <ReferenceLine y={0} stroke="#0a0a0f" strokeWidth={2} />
              <ReferenceLine x={0} stroke="#0a0a0f" strokeWidth={2} />
              {root !== null && inRange(root) && (
                <ReferenceLine x={root} stroke="#e85d3a" strokeDasharray="6 3" strokeWidth={1.5}
                  label={{ value: `root≈${root.toPrecision(5)}`, position: "top", fontSize: 10, fill: "#e85d3a" }} />
              )}
              {/* f(x) curve — black */}
              <Line type="monotone" dataKey="y" stroke="#0a0a0f" strokeWidth={2.5}
                dot={false} activeDot={false} connectNulls={false}
                isAnimationActive={false} legendType="none" />
            </ComposedChart>
          </ResponsiveContainer>

          {/* ── SVG overlay: Newton step geometry ───────────────── */}
          {plotW > 0 && (
            <svg
              style={{
                position: "absolute",
                top: M.top,
                left: M.left,
                width: plotW,
                height: plotH,
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              {/* Clip so nothing escapes the plot area */}
              <defs>
                <clipPath id="plot-clip">
                  <rect x={0} y={0} width={plotW} height={plotH} />
                </clipPath>
              </defs>

              {/* ── x0 step ── */}
              {(() => {
                const it = iterations[0];
                if (!it) return null;

                const slope = it.f_prime_x_n;
                const intercept = it.f_x_n - slope * it.x_n; // T(x) = slope·x + intercept

                // Evaluate tangent at the full x-window edges (no clamping — clipPath handles it)
                const ty_left = slope * MIN + intercept;  // T(-20)
                const ty_right = slope * MAX + intercept;  // T(+20)

                const x0px = px(it.x_n);
                const y0px = py(0);
                const yfPx = py(clamp(it.f_x_n));
                const x1px = inRange(it.x_next) ? px(it.x_next) : null;

                return (
                  <g clipPath="url(#plot-clip)">
                    {/* Full-width tangent line: T(x) = f(x₀) + f′(x₀)·(x − x₀) */}
                    <line
                      x1={px(MIN)} y1={py(ty_left)}
                      x2={px(MAX)} y2={py(ty_right)}
                      stroke="#e85d3a" strokeWidth={2} opacity={0.9}
                    />

                    {/* Dashed vertical: (x₀, 0) → (x₀, f(x₀)) */}
                    <line x1={x0px} y1={y0px} x2={x0px} y2={yfPx}
                      stroke="#3a7bd5" strokeWidth={1.5} strokeDasharray="5 3" opacity={0.85} />

                    {/* 🟠 Orange dot at (x₀, f(x₀)) */}
                    <circle cx={x0px} cy={yfPx} r={6} fill="orange" stroke="white" strokeWidth={1.5} />

                    {/* 🔴 Red dot at (x₀, 0) */}
                    <circle cx={x0px} cy={y0px} r={5} fill="red" stroke="white" strokeWidth={1.5} />
                    <text x={x0px} y={y0px + 16} textAnchor="middle" fontSize={10}
                      fontFamily="JetBrains Mono, monospace" fill="red" fontWeight={700}>x₀</text>


                  </g>
                );
              })()}
            </svg>
          )}
        </div>
      </div>

      <p className="text-xs text-muted mt-2">
        <span style={{ color: "red" }}>●</span> x-axis projection &nbsp;
        <span style={{ color: "orange" }}>●</span> point on curve &nbsp;·&nbsp;
        dashed = vertical helper &nbsp;·&nbsp; solid = tangent T(x) = f(xₙ) + f′(xₙ)(x − xₙ)
      </p>
    </div>
  );
}
