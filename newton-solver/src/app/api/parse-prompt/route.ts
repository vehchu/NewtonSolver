import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 500 }
      );
    }

    const { prompt } = await req.json() as { prompt: string };
    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are a parser that extracts Newton's Method parameters from natural language.

From the user's message, extract:
- func: the function f(x) in mathjs-compatible format (e.g., "x^3 - 2*x - 5", "cos(x) - x", "exp(x) - 3*x")
- x0: initial guess (number)
- tolerance: convergence tolerance (default 1e-6 if not specified)
- maxIter: maximum iterations (default 50 if not specified)

Rules for func:
- Use * for multiplication (e.g., 2*x not 2x)
- Use ^ for exponentiation
- Use mathjs function names: sin, cos, tan, exp, log, sqrt, abs
- Convert natural language like "x cubed" to x^3, "x squared" to x^2, "e to the x" to exp(x)

Respond ONLY with valid JSON like:
{"func": "x^3 - 2*x - 5", "x0": 2, "tolerance": 1e-6, "maxIter": 50}

Do not include any explanation or markdown. Just the JSON object.`;

    const geminiResult = await model.generateContent([
      { text: systemPrompt },
      { text: `User message: ${prompt}` },
    ]);

    const text = geminiResult.response.text().trim();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse parameters from your prompt. Please try being more specific." },
        { status: 422 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate
    if (!parsed.func || parsed.x0 === undefined) {
      return NextResponse.json(
        { error: "Could not identify the function or initial guess. Please include them in your prompt." },
        { status: 422 }
      );
    }

    return NextResponse.json(parsed);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
