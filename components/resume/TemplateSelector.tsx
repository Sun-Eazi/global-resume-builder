"use client";

import type { TemplateId } from "@/types";

const templates: { id: TemplateId; name: string; desc: string; accent: string; preview: React.ReactNode }[] = [
  {
    id: "modern",
    name: "Modern",
    desc: "Bold, colorful, and contemporary",
    accent: "blue",
    preview: (
      <div className="p-3 space-y-2 bg-white h-full">
        <div className="h-2 bg-blue-500 rounded w-full" />
        <div className="h-2 bg-gray-800 rounded w-3/4" />
        <div className="h-1.5 bg-gray-300 rounded w-1/2" />
        <div className="mt-2 space-y-1">
          <div className="h-1.5 bg-blue-200 rounded w-1/4" />
          <div className="h-1.5 bg-gray-200 rounded" />
          <div className="h-1.5 bg-gray-200 rounded w-4/5" />
        </div>
      </div>
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Clean, simple, and distraction-free",
    accent: "gray",
    preview: (
      <div className="p-3 space-y-2 bg-white h-full">
        <div className="h-2.5 bg-gray-900 rounded w-1/2" />
        <div className="h-1.5 bg-gray-400 rounded w-1/3" />
        <div className="h-px bg-gray-200 my-2" />
        <div className="space-y-1">
          <div className="h-1.5 bg-gray-800 rounded w-1/4" />
          <div className="h-1 bg-gray-200 rounded" />
          <div className="h-1 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    ),
  },
  {
    id: "professional",
    name: "Professional",
    desc: "Traditional and corporate",
    accent: "violet",
    preview: (
      <div className="bg-white h-full flex">
        <div className="w-1/3 bg-gray-900 p-2 space-y-2">
          <div className="w-6 h-6 rounded-full bg-violet-500 mx-auto" />
          <div className="h-1.5 bg-gray-600 rounded" />
          <div className="h-1 bg-gray-700 rounded w-3/4" />
          <div className="mt-2 space-y-1">
            <div className="h-1 bg-violet-400 rounded w-1/2" />
            <div className="h-1 bg-gray-600 rounded" />
          </div>
        </div>
        <div className="flex-1 p-2 space-y-2">
          <div className="h-1.5 bg-gray-300 rounded" />
          <div className="h-1 bg-gray-200 rounded w-4/5" />
          <div className="h-1 bg-gray-200 rounded" />
        </div>
      </div>
    ),
  },
];

interface TemplateSelectorProps {
  selected: TemplateId;
  onChange: (id: TemplateId) => void;
}

export default function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
          Choose Template
        </h2>
        <p className="text-xs text-gray-500">Select a design that matches your style</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`group flex items-center gap-5 p-4 rounded-2xl border transition-all duration-200 text-left ${
              selected === t.id
                ? "border-blue-500/50 bg-blue-500/10"
                : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
            }`}
          >
            {/* Thumbnail */}
            <div className="w-24 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg">
              {t.preview}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">{t.name}</span>
                {selected === t.id && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-xs mt-0.5">{t.desc}</p>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selected === t.id ? "border-blue-500 bg-blue-500" : "border-white/20"
              }`}
            >
              {selected === t.id && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
