"use client";

import { useState } from "react";
import type { ResumeSection, SectionType } from "@/types";
import { addSection, deleteSection, updateSection, addSectionItem, deleteSectionItem, updateSectionItem } from "@/lib/resume";

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
  const [editingItem, setEditingItem] = useState<{ id: string; data: any } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleSaveItem = async () => {
    if (!editingItem) return;
    await updateSectionItem(editingItem.id, editingItem.data);
    setEditingItem(null);
    onRefresh();
  };

  const handleGenerateExperience = async (company: string, position: string) => {
    if (!editingItem) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "experience",
          prompt: `Write 3 strong bullet points for a ${position} at ${company}. Keep it achievements-focused.`
        })
      });
      if (res.ok) {
        const { text } = await res.json();
        setEditingItem({ ...editingItem, data: { ...editingItem.data, description: text } });
      }
    } catch (e) {
      console.error(e);
    }
    setIsGenerating(false);
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
                    <div key={item.id} className="bg-white/[0.03] rounded-xl p-3 border border-white/5 space-y-3">
                      {editingItem?.id === item.id ? (
                        <div className="space-y-3">
                          {section.type === "experience" && (
                            <>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="label text-[10px]">Position</label>
                                  <input
                                    className="input text-xs p-2"
                                    value={editingItem.data.position || ""}
                                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, position: e.target.value } })}
                                    placeholder="Software Engineer"
                                  />
                                </div>
                                <div>
                                  <label className="label text-[10px]">Company</label>
                                  <input
                                    className="input text-xs p-2"
                                    value={editingItem.data.company || ""}
                                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, company: e.target.value } })}
                                    placeholder="Google"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <label className="label text-[10px] m-0">Description / Bullets</label>
                                  <button
                                    onClick={() => handleGenerateExperience(editingItem.data.company || "a company", editingItem.data.position || "a position")}
                                    disabled={isGenerating}
                                    className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                  >
                                    {isGenerating ? "Generating..." : "✨ Generate with AI"}
                                  </button>
                                </div>
                                <textarea
                                  className="input text-xs p-2 h-24"
                                  value={editingItem.data.description || ""}
                                  onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                                  placeholder="• Built amazing things..."
                                />
                              </div>
                            </>
                          )}
                          {section.type !== "experience" && (
                            <div className="text-xs text-gray-400 italic">Editing for {section.type} is simplified in this view.</div>
                          )}
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingItem(null)} className="text-xs text-gray-400 hover:text-white px-2 py-1">Cancel</button>
                            <button onClick={handleSaveItem} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded">Save</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 text-xs text-gray-300">
                            {section.type === "experience" ? (
                              <div className="font-medium">
                                {(item.data as any).position || "New Position"} at {(item.data as any).company || "Company"}
                                {((item.data as any).description) && <div className="text-gray-500 font-normal mt-1 truncate">{(item.data as any).description}</div>}
                              </div>
                            ) : (
                              <span className="font-mono text-gray-500 truncate">{JSON.stringify(item.data).slice(0, 60)}...</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setEditingItem({ id: item.id, data: { ...item.data } })} className="text-gray-500 hover:text-blue-400 p-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-gray-600 hover:text-red-400 transition-colors p-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
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
