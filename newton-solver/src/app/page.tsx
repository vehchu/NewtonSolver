"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CalcForm from "@/components/CalcForm";
import ResultsTable from "@/components/ResultsTable";
import ConvergenceChart from "@/components/ConvergenceChart";
import StepsView from "@/components/StepsView";
import ExplanationPanel from "@/components/ExplanationPanel";
import AIPromptTab from "@/components/AIPromptTab";
import Tutorial from "@/components/Tutorial";
import MaryTab from "@/components/MaryTab";
import HaileyTab from "@/components/HaileyTab";
import SakuraTab from "@/components/SakuraTab";
import { NewtonResult } from "@/lib/newton";
import { FileDown, Table2, BarChart3, ListOrdered, Info } from "lucide-react";

type ResultTab = "table" | "chart" | "steps";

export default function Home() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [result, setResult] = useState<NewtonResult | null>(null);
  const [lastParams, setLastParams] = useState<{
    func: string; x0: number; tolerance: number; maxIter: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultTab, setResultTab] = useState<ResultTab>("table");
  const [aiParams, setAiParams] = useState<{
    func?: string; x0?: number; tolerance?: number; maxIter?: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleCalc = async (params: {
    func: string; x0: number; tolerance: number; maxIter: number;
  }) => {
    setLoading(true);
    setError("");
    setResult(null);
    setLastParams(params);

    try {
      const res = await fetch("/api/newton", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data as NewtonResult);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIParsed = (params: {
    func: string; x0: number; tolerance: number; maxIter: number;
  }) => {
    setAiParams(params);
    setActiveTab("calculator");
    // Small delay to let tab switch render
    setTimeout(() => handleCalc(params), 100);
  };

  const handleDownloadPDF = async () => {
    if (!result || !lastParams) return;
    const { downloadPDF } = await import("@/lib/exportPDF");
    await downloadPDF(result, lastParams.func, lastParams.x0, lastParams.tolerance, lastParams.maxIter);
  };

  const resultTabs: { id: ResultTab; label: string; icon: React.ReactNode }[] = [
    { id: "table", label: "Table", icon: <Table2 size={14} /> },
    { id: "chart", label: "Charts", icon: <BarChart3 size={14} /> },
    { id: "steps", label: "Steps", icon: <ListOrdered size={14} /> },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-paper">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ───────────── CALCULATOR TAB ───────────── */}
        {activeTab === "calculator" && (
          <div className="animate-fade-in">
            {/* Hero headline */}
            <div className="mb-8 max-w-2xl">
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink leading-tight mb-2">
                Newton&apos;s Method{" "}
                <span className="text-accent">Calculator</span>
              </h1>
              <p className="text-muted font-body text-sm sm:text-base leading-relaxed">
                Find roots of any function with step-by-step iteration tables, convergence
                charts, AI explanations, and PDF export.
              </p>
            </div>

            <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
              {/* Left: Form */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="font-display font-semibold text-ink text-lg mb-5">
                  Input Parameters
                </h2>
                <CalcForm
                  onSubmit={handleCalc}
                  loading={loading}
                  initialValues={aiParams ?? undefined}
                />
              </div>

              {/* Right: Results */}
              <div className="space-y-4">
                {/* Error state */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700 text-sm font-body flex gap-3 items-start">
                    <span className="text-red-500 mt-0.5">⚠</span>
                    <div>
                      <p className="font-semibold">Calculation Error</p>
                      <p className="mt-0.5 opacity-90">{error}</p>
                    </div>
                  </div>
                )}

                {/* Loading placeholder */}
                {loading && (
                  <div className="bg-white border border-border rounded-2xl p-8 flex flex-col items-center gap-3">
                    <span className="w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full animate-spin" style={{ borderWidth: 3 }} />
                    <p className="text-muted text-sm font-body">Running Newton&apos;s iterations...</p>
                  </div>
                )}

                {/* Results */}
                {result && !loading && (
                  <div className="space-y-4 animate-fade-up">
                    {/* Result tab bar + download */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex gap-1 bg-white border border-border rounded-xl p-1">
                        {resultTabs.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setResultTab(t.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-all ${resultTab === t.id
                              ? "bg-ink text-paper"
                              : "text-muted hover:text-ink"
                              }`}
                          >
                            {t.icon}
                            {t.label}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-body font-medium text-ink hover:bg-ink hover:text-paper transition-all"
                      >
                        <FileDown size={15} />
                        Download PDF
                      </button>
                    </div>

                    {/* Result content */}
                    <div className="bg-white border border-border rounded-2xl p-5">
                      {resultTab === "table" && (
                        <ResultsTable
                          iterations={result.iterations}
                          root={result.root}
                          converged={result.converged}
                          diverged={result.diverged}
                          message={result.message}
                          func={lastParams?.func ?? ""}
                        />
                      )}
                      {resultTab === "chart" && (
                        <ConvergenceChart
                          iterations={result.iterations}
                          root={result.root}
                        />
                      )}
                      {resultTab === "steps" && (
                        <StepsView
                          iterations={result.iterations}
                          func={lastParams?.func ?? ""}
                        />
                      )}
                    </div>

                    {/* AI Explanation */}
                    {lastParams && (
                      <ExplanationPanel
                        result={result}
                        func={lastParams.func}
                        x0={lastParams.x0}
                        tolerance={lastParams.tolerance}
                      />
                    )}
                  </div>
                )}

                {/* Empty state */}
                {!result && !loading && !error && (
                  <div className="bg-white border border-dashed border-border rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <Info size={22} className="text-accent" />
                    </div>
                    <p className="font-display font-semibold text-ink">
                      Results will appear here
                    </p>
                    <p className="text-sm text-muted font-body max-w-xs">
                      Fill in the parameters on the left and click &ldquo;Solve with Newton&apos;s Method&rdquo;.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ───────────── AI PROMPT TAB ───────────── */}
        {activeTab === "ai-prompt" && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="font-display font-bold text-3xl text-ink mb-2">
                AI <span className="text-accent">Prompt</span> Mode
              </h1>
              <p className="text-muted font-body text-sm">
                Describe your problem in plain English and let Gemini extract the parameters.
              </p>
            </div>
            <AIPromptTab onParsed={handleAIParsed} />
          </div>
        )}

        {/* ───────────── TUTORIAL TAB ───────────── */}
        {activeTab === "tutorial" && (
          <div className="animate-fade-in">
            <Tutorial />
          </div>
        )}

        {/* ───────────── MARY'S TAB ───────────── */}
        {activeTab === "mary" && <MaryTab />}

        {/* ───────────── HAILEY'S TAB ───────────── */}
        {activeTab === "hailey" && <HaileyTab />}

        {/* ───────────── SAKURA'S TAB ───────────── */}
        {activeTab === "sakura" && <SakuraTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 text-center">
        <p className="text-xs text-muted font-body">
          <span className="font-display font-semibold text-ink">NewtonSolve</span>
          {" "}— Numerical Methods Calculator
          {" "}· Built with Next.js, Tailwind CSS, mathjs & Gemini AI
        </p>
        <p className="text-xs text-muted mt-1">
          Developed by Group 5 with ❤️ · © 2026
        </p>
      </footer>
    </div>
  );
}
