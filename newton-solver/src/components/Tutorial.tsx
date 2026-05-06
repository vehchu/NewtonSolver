"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Enter a Function",
    content: `Type your function f(x) in the input field using mathjs syntax. For example:
• x^3 - 2*x - 5  (polynomial)
• cos(x) - x  (transcendental)
• exp(x) - 3*x  (exponential)

Always use * for multiplication (e.g., 2*x, not 2x), ^ for powers, and standard function names like sin, cos, tan, exp, log, sqrt.`,
  },
  {
    n: "02",
    title: "Choose an Initial Guess x₀",
    content: `Newton's Method starts from an initial guess and iterates. A good initial guess:
• Should be near the root you want to find.
• Can be found by graphing the function mentally or using the convergence chart.
• If the method diverges, try a different starting point.

For example, for f(x) = x³ - 2x - 5, the root near x = 2 can be found with x₀ = 2.`,
  },
  {
    n: "03",
    title: "Set Tolerance & Iterations",
    content: `These control when the algorithm stops:
• Tolerance ε: The method stops when |x_{n+1} - x_n| < ε. Default: 1e-6.
• Max Iterations: A safety cap on iterations. Default: 50. Most functions converge within 10.

For high-precision work, lower the tolerance (e.g., 1e-12). If the method doesn't converge, increase max iterations or try a better initial guess.`,
  },
  {
    n: "04",
    title: "Read the Iteration Table",
    content: `The table shows each iteration of Newton's Method:
• n — Iteration number (starting from 0)
• xₙ — Current estimate of the root
• f(xₙ) — Value of the function at xₙ (approaches 0 as we converge)
• f′(xₙ) — Derivative at xₙ (used to compute the next step)
• xₙ₊₁ = xₙ - f(xₙ)/f′(xₙ) — Next estimate
• |error| = |xₙ₊₁ - xₙ| — Step size (approaches 0 on convergence)`,
  },
  {
    n: "05",
    title: "View Convergence Charts",
    content: `The charts tab shows two graphs:
• xₙ vs Iteration: How the estimate of the root changes over iterations. A good run shows rapid horizontal convergence.
• log₁₀|error| vs Iteration: A steep downward slope means fast (quadratic) convergence — Newton's Method doubles the number of correct decimal places each iteration when working well.`,
  },
  {
    n: "06",
    title: "Get an AI Explanation",
    content: `Click the "AI Explanation" button (powered by Gemini) to get a plain-English breakdown of your specific calculation. The AI will:
• Explain what Newton's Method is doing for your function.
• Walk through the first few iterations step by step.
• Comment on convergence behavior.
• Flag any interesting observations.`,
  },
  {
    n: "07",
    title: "Download as PDF",
    content: `Click the "Download PDF" button to save a beautifully formatted report containing:
• All your input parameters
• The result and root found
• The full iteration table
• The Newton's Method formula

Great for submitting homework, reports, or study notes.`,
  },
  {
    n: "08",
    title: "Use the AI Prompt Mode",
    content: `Not sure about syntax? Switch to the "AI Prompt" tab and describe your problem in plain English. Examples:
• "Find the root of x cubed minus 2x minus 5, starting at x=2"
• "Solve cos(x) equals x starting from x=1"
• "Find the square root of 2 using Newton's method"

Gemini will parse your message and fill in all the parameters automatically.`,
  },
];

const FAQ = [
  {
    q: "What is Newton's Method?",
    a: "Newton's Method (also called the Newton-Raphson method) is an iterative numerical technique for finding the roots of a real-valued function f(x). Starting from an initial guess x₀, it repeatedly applies the formula x_{n+1} = x_n - f(x_n) / f′(x_n) until convergence.",
  },
  {
    q: "When does Newton's Method fail?",
    a: "It fails when: (1) f′(xₙ) = 0 (zero derivative, causing division by zero), (2) the initial guess is far from any root, (3) the function has no real roots, or (4) the iterates cycle or diverge. In these cases, try a different initial guess.",
  },
  {
    q: "What does 'quadratic convergence' mean?",
    a: "Near a simple root, Newton's Method converges quadratically — the number of correct decimal digits roughly doubles each iteration. This is why you often see it converge in 5–8 iterations even for high precision.",
  },
  {
    q: "What functions are supported?",
    a: "Any function expressible in mathjs notation: polynomials, trigonometric (sin, cos, tan), exponential (exp), logarithmic (log, log2, log10), square root (sqrt), absolute value (abs), and combinations thereof.",
  },
];

export default function Tutorial() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-display font-semibold uppercase tracking-wide">
          Tutorial & Documentation
        </div>
        <h1 className="font-display font-bold text-3xl text-ink">
          How to Use NewtonSolve
        </h1>
        <p className="text-muted font-body max-w-lg mx-auto text-sm leading-relaxed">
          A complete guide to Newton&apos;s Method and all features of this calculator.
        </p>
      </div>

      {/* Theory */}
      <section>
        <h2 className="font-display font-bold text-xl text-ink mb-4">
          Newton&apos;s Method — The Math
        </h2>
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4 text-sm font-body text-ink/80 leading-relaxed">
          <p>
            Given a differentiable function f(x), Newton&apos;s Method finds a root (where f(x) = 0) by starting
            with an initial guess x₀ and applying the recurrence:
          </p>
          <div className="bg-ink text-paper font-mono text-base rounded-xl px-6 py-4 text-center my-2">
            x&#8342;&#8330;&#8321; = x&#8342; &minus; f(x&#8342;) / f&prime;(x&#8342;)
          </div>
          <p>
            Geometrically, each step draws a tangent line at (xₙ, f(xₙ)) and sets the next estimate
            to where that tangent line crosses the x-axis. Near a simple root, convergence is{" "}
            <strong>quadratic</strong> — errors decrease roughly as the square each iteration.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            {[
              { label: "Input", val: "f(x), x₀, ε" },
              { label: "Output", val: "Root x*" },
              { label: "Convergence", val: "Quadratic (order 2)" },
            ].map((c) => (
              <div key={c.label} className="bg-paper rounded-xl px-4 py-3 text-center border border-border">
                <p className="text-xs text-muted mb-1">{c.label}</p>
                <p className="font-mono font-semibold text-ink text-sm">{c.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section>
        <h2 className="font-display font-bold text-xl text-ink mb-4">
          Step-by-Step Guide
        </h2>
        <div className="space-y-3">
          {STEPS.map((step) => (
            <div key={step.n} className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-start gap-4">
                <span className="font-display font-bold text-2xl text-accent/30 leading-none shrink-0 mt-0.5">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-display font-semibold text-ink mb-2">{step.title}</h3>
                  <p className="text-sm font-body text-muted whitespace-pre-line leading-relaxed">
                    {step.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Function Syntax */}
      <section>
        <h2 className="font-display font-bold text-xl text-ink mb-4">
          Function Syntax Reference
        </h2>
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border bg-ink/[0.03]">
                <th className="px-5 py-3 text-left font-display font-semibold text-muted text-xs uppercase tracking-wide">Instead of</th>
                <th className="px-5 py-3 text-left font-display font-semibold text-muted text-xs uppercase tracking-wide">Write</th>
                <th className="px-5 py-3 text-left font-display font-semibold text-muted text-xs uppercase tracking-wide">Example</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["2x", "2*x", "2*x - 1"],
                ["x²", "x^2", "x^2 - 4"],
                ["x³", "x^3", "x^3 - 8"],
                ["sin x", "sin(x)", "sin(x) - 0.5"],
                ["e^x", "exp(x)", "exp(x) - 2"],
                ["ln(x)", "log(x)", "log(x) - 1"],
                ["log₁₀(x)", "log10(x)", "log10(x) - 2"],
                ["√x", "sqrt(x)", "sqrt(x) - 3"],
                ["|x|", "abs(x)", "abs(x) - 1"],
              ].map(([bad, good, ex]) => (
                <tr key={bad} className="border-b border-border/50 hover:bg-paper/50">
                  <td className="px-5 py-2.5 font-mono text-red-400 line-through">{bad}</td>
                  <td className="px-5 py-2.5 font-mono text-green-600 font-semibold">{good}</td>
                  <td className="px-5 py-2.5 font-mono text-muted">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-8">
        <h2 className="font-display font-bold text-xl text-ink mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-white border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-body font-semibold text-ink text-sm">{item.q}</span>
                {openFaq === i ? (
                  <ChevronUp size={16} className="text-muted shrink-0 ml-4" />
                ) : (
                  <ChevronDown size={16} className="text-muted shrink-0 ml-4" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm font-body text-muted leading-relaxed border-t border-border pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
