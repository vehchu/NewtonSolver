"use client";
import { useState } from "react";
import { Calculator, ChevronDown, ChevronUp, Info } from "lucide-react";

interface CalcFormProps {
  onSubmit: (params: {
    func: string;
    x0: number;
    tolerance: number;
    maxIter: number;
  }) => void;
  loading: boolean;
  initialValues?: { func?: string; x0?: number; tolerance?: number; maxIter?: number };
}

const EXAMPLES = [
  { label: "x³ - 2x - 5", func: "x^3 - 2*x - 5", x0: 2 },
  { label: "cos(x) - x", func: "cos(x) - x", x0: 1 },
  { label: "e^x - 3x", func: "exp(x) - 3*x", x0: 1 },
  { label: "x² - 2", func: "x^2 - 2", x0: 1.5 },
  { label: "ln(x) - 1", func: "log(x) - 1", x0: 2 },
];

export default function CalcForm({ onSubmit, loading, initialValues }: CalcFormProps) {
  const [func, setFunc] = useState(initialValues?.func ?? "x^3 - 2*x - 5");
  const [x0, setX0] = useState(String(initialValues?.x0 ?? 2));
  const [tolerance, setTolerance] = useState(String(initialValues?.tolerance ?? 1e-6));
  const [maxIter, setMaxIter] = useState(String(initialValues?.maxIter ?? 50));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync with initialValues changes (from AI prompt)
  useState(() => {
    if (initialValues?.func) setFunc(initialValues.func);
    if (initialValues?.x0 !== undefined) setX0(String(initialValues.x0));
    if (initialValues?.tolerance !== undefined) setTolerance(String(initialValues.tolerance));
    if (initialValues?.maxIter !== undefined) setMaxIter(String(initialValues.maxIter));
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!func.trim()) errs.func = "Function is required.";
    if (isNaN(parseFloat(x0))) errs.x0 = "Initial guess must be a number.";
    const tol = parseFloat(tolerance);
    if (isNaN(tol) || tol <= 0) errs.tolerance = "Tolerance must be a positive number.";
    const iter = parseInt(maxIter);
    if (isNaN(iter) || iter < 1 || iter > 200) errs.maxIter = "Max iterations: 1–200.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      func: func.trim(),
      x0: parseFloat(x0),
      tolerance: parseFloat(tolerance),
      maxIter: parseInt(maxIter),
    });
  };

  const loadExample = (ex: (typeof EXAMPLES)[0]) => {
    setFunc(ex.func);
    setX0(String(ex.x0));
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Examples */}
      <div>
        <p className="text-xs font-body font-medium text-muted mb-2 uppercase tracking-wider">
          Quick Examples
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => loadExample(ex)}
              className="px-3 py-1.5 bg-ink/5 hover:bg-ink/10 rounded-md text-sm font-mono text-ink/70 hover:text-ink transition-all"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Function Input */}
      <div>
        <label className="block text-sm font-body font-medium text-ink mb-1.5">
          Function f(x)
          <span className="ml-2 text-muted text-xs font-normal">
            (in mathjs format)
          </span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-mono text-sm select-none">
            f(x) =
          </span>
          <input
            type="text"
            value={func}
            onChange={(e) => { setFunc(e.target.value); setErrors((prev) => ({ ...prev, func: "" })); }}
            placeholder="x^3 - 2*x - 5"
            className={`w-full pl-14 pr-4 py-2.5 rounded-lg border font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors ${
              errors.func ? "border-red-400" : "border-border"
            }`}
          />
        </div>
        {errors.func && <p className="mt-1 text-xs text-red-500">{errors.func}</p>}
        <p className="mt-1.5 text-xs text-muted">
          Use <code className="bg-ink/5 px-1 rounded">*</code> for multiplication,{" "}
          <code className="bg-ink/5 px-1 rounded">^</code> for powers,{" "}
          <code className="bg-ink/5 px-1 rounded">sin</code>,{" "}
          <code className="bg-ink/5 px-1 rounded">cos</code>,{" "}
          <code className="bg-ink/5 px-1 rounded">exp</code>,{" "}
          <code className="bg-ink/5 px-1 rounded">log</code>,{" "}
          <code className="bg-ink/5 px-1 rounded">sqrt</code>
        </p>
      </div>

      {/* Initial Guess */}
      <div>
        <label className="block text-sm font-body font-medium text-ink mb-1.5">
          Initial Guess x₀
        </label>
        <input
          type="number"
          value={x0}
          onChange={(e) => { setX0(e.target.value); setErrors((prev) => ({ ...prev, x0: "" })); }}
          step="any"
          className={`w-full px-4 py-2.5 rounded-lg border font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors ${
            errors.x0 ? "border-red-400" : "border-border"
          }`}
        />
        {errors.x0 && <p className="mt-1 text-xs text-red-500">{errors.x0}</p>}
      </div>

      {/* Advanced Options */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-sm font-body text-muted hover:text-ink transition-colors"
        >
          {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          Advanced Options
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-4 pl-4 border-l-2 border-border">
            <div>
              <label className="block text-sm font-body font-medium text-ink mb-1.5">
                Tolerance (ε)
              </label>
              <input
                type="text"
                value={tolerance}
                onChange={(e) => { setTolerance(e.target.value); setErrors((prev) => ({ ...prev, tolerance: "" })); }}
                className={`w-full px-4 py-2.5 rounded-lg border font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors ${
                  errors.tolerance ? "border-red-400" : "border-border"
                }`}
              />
              {errors.tolerance && <p className="mt-1 text-xs text-red-500">{errors.tolerance}</p>}
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-ink mb-1.5">
                Max Iterations
              </label>
              <input
                type="number"
                value={maxIter}
                min={1}
                max={200}
                onChange={(e) => { setMaxIter(e.target.value); setErrors((prev) => ({ ...prev, maxIter: "" })); }}
                className={`w-full px-4 py-2.5 rounded-lg border font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors ${
                  errors.maxIter ? "border-red-400" : "border-border"
                }`}
              />
              {errors.maxIter && <p className="mt-1 text-xs text-red-500">{errors.maxIter}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3 px-6 rounded-xl font-body font-semibold text-sm hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Calculating...
          </>
        ) : (
          <>
            <Calculator size={16} />
            Solve with Newton&apos;s Method
          </>
        )}
      </button>
    </form>
  );
}
