"use client";
import { useState } from "react";
import { BookOpen, X, Menu } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = [
    { id: "calculator", label: "Calculator" },
    { id: "ai-prompt", label: "AI Prompt" },
    { id: "tutorial", label: "Tutorial" },
    { id: "mary", label: "Mary" },
    { id: "hailey", label: "Hailey" },
    { id: "sakura", label: "Sakura" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setActiveTab("calculator")}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-display font-bold text-sm">N</span>
          </div>
          <span className="font-display font-bold text-ink text-lg tracking-tight">
            Newton<span className="text-accent">Solve</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-ink text-paper"
                  : "text-muted hover:text-ink hover:bg-ink/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Mobile menu */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-ink/5"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-paper px-4 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMobileOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium mt-1 transition-all ${
                activeTab === tab.id
                  ? "bg-ink text-paper"
                  : "text-muted hover:text-ink hover:bg-ink/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
