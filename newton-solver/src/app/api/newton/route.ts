import { NextRequest, NextResponse } from "next/server";
import { runNewton } from "@/lib/newton";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { func, x0, tolerance, maxIter } = body as {
      func: string;
      x0: number;
      tolerance: number;
      maxIter: number;
    };

    if (!func || x0 === undefined || !tolerance || !maxIter) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (maxIter > 200) {
      return NextResponse.json({ error: "Max iterations cannot exceed 200." }, { status: 400 });
    }

    const result = runNewton(func, x0, tolerance, maxIter);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
