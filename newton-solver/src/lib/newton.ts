import { compile, derivative, evaluate } from "mathjs";

export interface NewtonIteration {
  n: number;
  x_n: number;
  f_x_n: number;
  f_prime_x_n: number;
  x_next: number;
  error: number;
}

export interface NewtonResult {
  iterations: NewtonIteration[];
  root: number | null;
  converged: boolean;
  diverged: boolean;
  message: string;
}

export function runNewton(
  funcStr: string,
  x0: number,
  tolerance: number,
  maxIter: number
): NewtonResult {
  const iterations: NewtonIteration[] = [];
  let x = x0;
  let converged = false;
  let diverged = false;
  let message = "";

  // Parse function and derivative
  let f: (xVal: number) => number;
  let fPrime: (xVal: number) => number;

  try {
    const compiled = compile(funcStr);
    f = (xVal: number) => {
      return compiled.evaluate({ x: xVal }) as number;
    };

    // Try symbolic derivative first
    try {
      const derivExpr = derivative(funcStr, "x");
      const compiledDeriv = compile(derivExpr.toString());
      fPrime = (xVal: number) => compiledDeriv.evaluate({ x: xVal }) as number;
    } catch {
      // Fallback: numerical derivative (central difference)
      const h = 1e-7;
      fPrime = (xVal: number) => (f(xVal + h) - f(xVal - h)) / (2 * h);
    }
  } catch (e) {
    throw new Error(`Invalid function: ${(e as Error).message}`);
  }

  for (let n = 0; n < maxIter; n++) {
    let fx: number, fpx: number;

    try {
      fx = f(x);
      fpx = fPrime(x);
    } catch {
      message = `Evaluation error at x = ${x}`;
      diverged = true;
      break;
    }

    if (!isFinite(fx) || !isFinite(fpx)) {
      message = `Function or derivative is not finite at x = ${x}`;
      diverged = true;
      break;
    }

    if (Math.abs(fpx) < 1e-14) {
      message = `Derivative is zero at x = ${x}. Newton's method fails.`;
      diverged = true;
      break;
    }

    const xNext = x - fx / fpx;
    const error = Math.abs(xNext - x);

    iterations.push({
      n,
      x_n: x,
      f_x_n: fx,
      f_prime_x_n: fpx,
      x_next: xNext,
      error,
    });

    if (!isFinite(xNext) || Math.abs(xNext) > 1e15) {
      message = `Sequence diverged at iteration ${n}.`;
      diverged = true;
      x = xNext;
      break;
    }

    x = xNext;

    if (error < tolerance && Math.abs(fx) < tolerance * 100) {
      converged = true;
      message = `Converged after ${n + 1} iteration(s). Root ≈ ${x.toPrecision(10)}`;
      break;
    }
  }

  if (!converged && !diverged) {
    message = `Did not converge within ${maxIter} iterations. Last estimate: x ≈ ${x}`;
  }

  return {
    iterations,
    root: converged ? x : null,
    converged,
    diverged,
    message,
  };
}
