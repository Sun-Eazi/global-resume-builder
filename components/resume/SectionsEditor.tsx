"use client";

import { useState } from "react";
import type { ResumeSection, SectionType } from "@/types";
import { addSection, deleteSection, updateSection, addSectionItem, deleteSectionItem } from "@/lib/resume";

const SECTION_TYPES: { type: SectionType; label: string; icon: string }[] = [
  { type: "experience", label: "Work Experience", icon: "💼" },
  { type: "education", label: "Education", icon: "🎓" },
  { type: "skills", label: "Skills", icon: "⚡" },
  { type: "projects", label: "Projects", icon: "🚀" },
  { type: "certifications", label: "Certifications", icon: "📜" },
  { type: "languages", label: "Languages", icon: "🌍" },
  { type: "custom", label: "Custom Section", icon: "✦" },
];

interface SectionsEditorProps {
  resumeId: string;
  sections: ResumeSection[];
  onRefresh: () => void;
}

export default function SectionsEditor({ resumeId, sections, onRefresh }: SectionsEditorProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSection = async (type: SectionType, label: string) => {
    setIsAdding(true);
    setShowAddMenu(false);
    await addSection(resumeId, type, label);
    onRefresh();
    setIsAdding(false);
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section?")) return;
    await deleteSection(sectionId);
    onRefresh();
  };

  const handleToggleVisibility = async (section: ResumeSection) => {
    await updateSection(section.id, { is_visible: !section.is_visible });
    onRefresh();
  };

  const handleAddItem = async (sectionId: string, type: SectionType) => {
    const defaultData: Record<SectionType, object> = {
      experience: { company: "", position: "", start_date: "", end_date: "", is_current: false, description: "" },
      education: { institution: "", degree: "", field: "", start_date: "", end_date: "" },
      skills: { name: "", level: "intermediate" },
      projects: { name: "", description: "", technologies: [] },
      certifications: { name: "", issuer: "", date: "" },
      languages: { name: "", proficiency: "professional_working" },
      custom: { title: "", description: "" },
    };
    await addSectionItem(sectionId, defaultData[type]);
    onRefresh();
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteSectionItem(itemId);
    onRefresh();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Sections</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your resume sections</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            disabled={isAdding}
            className="btn-primary text-xs px-3 py-2 gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Section
          </button>
          {showAddMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowAddMenu(false)} />
              <div className="absolute right-0 top-full mt-2 z-20 bg-[#1F2937] border border-white/10 rounded-xl shadow-2xl overflow-hidden w-52">
                {SECTION_TYPES.map((s) => (
                  <button
                    key={s.type}
                    onClick={() => handleAddSection(s.type, s.label)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <p className="text-sm">No sections yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.sort((a, b) => a.position - b.position).map((section) => (
            <div key={section.id} className={`glass rounded-xl border transition-all ${expandedSection === section.id ? "border-blue-500/20" : "border-white/5"}`}>
              {/* Section header */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              >
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ${expandedSection === section.id ? "rotate-90" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>

                <span className="text-sm text-white font-medium flex-1">{section.title}</span>
                <span className="text-xs text-gray-500">{section.items?.length || 0} items</span>

                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleVisibility(section); }}
                  className={`text-xs px-2 py-1 rounded-md transition-colors ${section.is_visible ? "text-green-400 bg-green-500/10" : "text-gray-500 bg-white/5"}`}
                >
                  {section.is_visible ? "Visible" : "Hidden"}
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}
                  className="text-gray-600 hover:text-red-400 transition-colors p-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Expanded content */}
              {expandedSection === section.id && (
                <div className="border-t border-white/5 p-4 space-y-3">
                  {section.items?.map((item) => (
                    <div key={item.id} className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 text-xs text-gray-400 font-mono">
                          {JSON.stringify(item.data).slice(0, 60)}...
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-gray-600 hover:text-red-400 transition-colors p-1 shrink-0"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddItem(section.id, section.type as SectionType)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-500 hover:text-blue-400 border border-dashed border-white/10 hover:border-blue-500/30 rounded-xl transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Item
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
