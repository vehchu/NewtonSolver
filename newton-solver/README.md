# NewtonSolve — Newton's Method Calculator

An interactive Newton's Method calculator built with Next.js, featuring:
- ✅ Function-based root finding with step-by-step iteration table
- ✅ Convergence charts (x_n vs iterations + log error)
- ✅ Step-by-step breakdown for each iteration
- ✅ AI Explanation powered by Gemini
- ✅ AI Prompt Mode — describe your problem in plain English
- ✅ PDF export with formatted report
- ✅ Tutorial & documentation tab
- ✅ Quick example presets

---

## Setup & Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env.local` and add your Gemini API key:
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```
GEMINI_API_KEY=your_actual_key_here
```
Get a free API key at: https://aistudio.google.com/app/apikey

### 3. Run locally
```bash
npm run dev
```
Visit http://localhost:3000

---

## Deploy to Vercel

### Option A: CLI
```bash
npm install -g vercel
vercel
```
Then add the environment variable in the Vercel dashboard:
- Key: `GEMINI_API_KEY`
- Value: your Gemini API key

### Option B: GitHub + Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to https://vercel.com/new and import the repo
3. In "Environment Variables", add `GEMINI_API_KEY`
4. Click Deploy

> ⚠️ Important: The `.env.local` file is NOT committed to git and will NOT be deployed automatically. You must add `GEMINI_API_KEY` manually in the Vercel dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Computation | Next.js API Routes + mathjs |
| AI Features | Google Gemini 1.5 Flash |
| Charts | Recharts |
| PDF Export | jsPDF + jspdf-autotable |
| Deployment | Vercel |

---

## Developed By
**Group 4 — Borromeo, Garcia, Samson**  
Numerical Analysis · © 2024
