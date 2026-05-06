import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NewtonResult } from "@/lib/newton";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { result, func, x0, tolerance } = body as {
      result: NewtonResult;
      func: string;
      x0: number;
      tolerance: number;
    };

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const iterSummary = result.iterations
      .slice(0, 10)
      .map(
        (it) =>
          `Iteration ${it.n}: x_n=${it.x_n.toPrecision(8)}, f(x_n)=${it.f_x_n.toPrecision(8)}, f'(x_n)=${it.f_prime_x_n.toPrecision(8)}, x_{n+1}=${it.x_next.toPrecision(8)}, |error|=${it.error.toExponential(4)}`
      )
      .join("\n");

    const prompt = `You are a friendly numerical analysis tutor explaining Newton's Method to a student.

The student applied Newton's Method with:
- Function: f(x) = ${func}
- Initial guess: x₀ = ${x0}
- Tolerance: ${tolerance}
- Status: ${result.message}
${result.root !== null ? `- Root found: x ≈ ${result.root}` : ""}

First ${Math.min(result.iterations.length, 10)} iteration(s):
${iterSummary}

Please provide:
1. A brief, clear explanation of what Newton's Method is doing conceptually for this specific function.
2. Walk through the first 2–3 iterations step-by-step in plain language (show the formula: x_{n+1} = x_n - f(x_n)/f'(x_n)).
3. Comment on the convergence behavior (fast? slow? why?).
4. Any interesting observations about this particular function or result.

Keep your response concise (under 350 words), engaging, and educational. Use simple markdown formatting (bold, bullet points). Do not use LaTeX.`;

    const geminiResult = await model.generateContent(prompt);
    const response = geminiResult.response;
    const text = response.text();

    return NextResponse.json({ explanation: text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
