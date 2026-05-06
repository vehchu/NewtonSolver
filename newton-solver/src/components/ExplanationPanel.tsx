"use client";
import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { NewtonResult } from "@/lib/newton";

interface ExplanationPanelProps {
  result: NewtonResult;
  func: string;
  x0: number;
  tolerance: number;
}

export default function ExplanationPanel({
  result,
  func,
  x0,
  tolerance,
}: ExplanationPanelProps) {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shown, setShown] = useState(false);

  const fetchExplanation = async () => {
    if (explanation) {
      setShown(!shown);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result, func, x0, tolerance }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setExplanation(data.explanation);
      setShown(true);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Simple markdown renderer
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Bold
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Bullet points
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        return (
          <li key={i} className="ml-4 list-disc text-ink/80" dangerouslySetInnerHTML={{ __html: line.replace(/^[\-•]\s*/, "") }} />
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={i} className="ml-4 list-decimal text-ink/80" dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s/, "") }} />
        );
      }
      if (!line.trim()) return <br key={i} />;
      return <p key={i} className="text-ink/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: line }} />;
    });
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={fetchExplanation}
        disabled={loading}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-accent/5 to-accent-2/5 hover:from-accent/10 hover:to-accent-2/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <span className="font-display font-semibold text-sm text-ink">
            AI Explanation
          </span>
          <span className="text-xs text-muted font-body">powered by Gemini</span>
        </div>
        {loading ? (
          <span className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        ) : shown ? (
          <ChevronUp size={16} className="text-muted" />
        ) : (
          <ChevronDown size={16} className="text-muted" />
        )}
      </button>

      {shown && explanation && (
        <div className="px-5 py-4 bg-white border-t border-border">
          <div className="text-sm font-body space-y-1.5">{renderMarkdown(explanation)}</div>
        </div>
      )}

      {error && (
        <div className="px-5 py-3 bg-red-50 border-t border-red-100 text-red-600 text-sm font-body">
          ⚠ {error}
        </div>
      )}
    </div>
  );
}
