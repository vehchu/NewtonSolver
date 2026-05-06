import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NewtonSolve — Numerical Methods Calculator",
  description:
    "An interactive Newton's Method calculator with step-by-step explanations, AI-powered prompting, visualizations, and PDF export.",
  keywords: ["Newton's method", "numerical analysis", "root finding", "calculator"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="noise">{children}</body>
    </html>
  );
}
