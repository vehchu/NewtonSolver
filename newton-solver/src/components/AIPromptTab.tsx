"use client";
import { useState } from "react";
import { Sparkles, ArrowRight, Lightbulb } from "lucide-react";

interface AIPromptTabProps {
  onParsed: (params: {
    func: string;
    x0: number;
    tolerance: number;
    maxIter: number;
  }) => void;
}

const SUGGESTIONS = [
  "Find the root of x cubed minus 2x minus 5, starting at x=2",
  "Solve cos(x) equals x starting from x=1 with tolerance 1e-8",
  "Find where e to the power x equals 3x, initial guess 1.5",
  "Find the square root of 2 using Newton's method",
];

export default function AIPromptTab({ onParsed }: AIPromptTabProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<{
    func: string; x0: number; tolerance: number; maxIter: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setParsed(null);

    try {
      const res = await fetch("/api/parse-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setParsed(data);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleUse = () => {
    if (parsed) onParsed(parsed);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Intro */}
      <div className="bg-gradient-to-br from-accent/5 to-accent-2/10 border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-accent" />
          <h2 className="font-display font-bold text-ink text-lg">AI-Powered Input</h2>
        </div>
        <p className="text-sm font-body text-muted leading-relaxed">
          Describe your Newton&apos;s Method problem in plain English. Gemini AI will extract
          the function, initial guess, and parameters automatically.
        </p>
      </div>

      {/* Suggestions */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Lightbulb size={14} className="text-muted" />
          <p className="text-xs font-body font-medium text-muted uppercase tracking-wide">
            Try these examples
          </p>
        </div>
        <div className="space-y-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setPrompt(s)}
              className="w-full text-left px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-body text-ink/70 hover:text-ink hover:border-accent/30 hover:shadow-sm transition-all"
            >
              &ldquo;{s}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-body font-medium text-ink mb-1.5">
            Describe your problem
          </label>
          <textarea
            value={prompt}
            onChange={(e) => { setPrompt(e.target.value); setError(""); }}
            rows={4}
            placeholder="e.g. Find the root of x^3 - 2x - 5 starting at x = 2..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 bg-ink text-paper py-3 rounded-xl font-body font-semibold text-sm hover:bg-ink/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
              Parsing with Gemini...
            </>
          ) : (
            <>
              <Sparkles size={15} />
              Extract Parameters
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-body">
          ⚠ {error}
        </div>
      )}

      {/* Parsed result */}
      {parsed && (
        <div className="bg-white border border-green-200 rounded-xl overflow-hidden animate-fade-up">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border-b border-green-100">
            <span className="text-green-600">✓</span>
            <p className="text-sm font-display font-semibold text-green-800">
              Parameters extracted successfully
            </p>
          </div>
          <div className="p-4 space-y-2 font-mono text-sm">
            {[
              ["f(x)", parsed.func],
              ["x₀", String(parsed.x0)],
              ["Tolerance", String(parsed.tolerance)],
              ["Max Iterations", String(parsed.maxIter)],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3">
                <span className="text-muted w-28 shrink-0">{label}:</span>
                <span className="text-ink font-semibold">{value}</span>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <button
              onClick={handleUse}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white py-2.5 rounded-xl font-body font-semibold text-sm hover:bg-accent/90 transition-all"
            >
              Use These Parameters
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
