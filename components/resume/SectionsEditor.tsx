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
  { type: "languages", label: "Languages", icon: "🌐" },
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
    try {
      setIsAdding(true);
      setShowAddMenu(false);
      await addSection(resumeId, type, label);
      onRefresh();
    } catch (err: any) {
      alert("Error adding section: " + err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section?")) return;
    try {
      await deleteSection(sectionId);
      onRefresh();
    } catch (err: any) {
      alert("Error deleting section: " + err.message);
    }
  };

  const handleToggleVisibility = async (section: ResumeSection) => {
    try {
      await updateSection(section.id, { is_visible: !section.is_visible });
      onRefresh();
    } catch (err: any) {
      alert("Error updating visibility: " + err.message);
    }
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
    try {
      await addSectionItem(sectionId, defaultData[type]);
      onRefresh();
    } catch (err: any) {
      alert("Error adding item: " + err.message);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteSectionItem(itemId);
      onRefresh();
    } catch (err: any) {
      alert("Error deleting item: " + err.message);
    }
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;
    try {
      await updateSectionItem(editingItem.id, editingItem.data);
      setEditingItem(null);
      onRefresh();
    } catch (err: any) {
      alert("Error saving item: " + err.message);
    }
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

  const getSectionIcon = (type: string) => {
    return SECTION_TYPES.find(t => t.type === type)?.icon || "📄";
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0, fontFamily: "var(--font-syne), sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em" }}>Sections</p>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            disabled={isAdding}
            style={{ fontSize: "11px", color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
          >
            + Add Section
          </button>
          {showAddMenu && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 10 }}
                onClick={() => setShowAddMenu(false)}
              />
              <div style={{ position: "absolute", right: 0, top: "100%", marginTop: "8px", zIndex: 20, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", width: "160px", padding: "4px" }}>
                {SECTION_TYPES.map((s) => (
                  <button
                    key={s.type}
                    onClick={() => handleAddSection(s.type, s.label)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "8px", fontSize: "11px", color: "var(--text)", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderRadius: "6px" }}
                    onMouseOver={(e) => e.currentTarget.style.background = "var(--bg)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "none"}
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
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)", fontSize: "12px" }}>
          No sections yet. Add one to get started.
        </div>
      ) : (
        <div>
          {sections.sort((a, b) => a.position - b.position).map((section) => (
            <div key={section.id} className="section-item">
              <div
                className="section-item-header"
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="section-item-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{getSectionIcon(section.type)}</span>
                    <span style={{ textDecoration: !section.is_visible ? "line-through" : "none", opacity: !section.is_visible ? 0.6 : 1 }}>
                      {section.title} ({section.items?.length || 0})
                    </span>
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleVisibility(section); }}
                    style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}
                    title="Toggle Visibility"
                  >
                    {section.is_visible ? "👁️" : "🗑️"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}
                    style={{ background: "none", border: "none", color: "var(--accent)", fontSize: "11px", cursor: "pointer" }}
                    title="Delete Section"
                  >
                    ✕
                  </button>
                  <span style={{ color: "var(--muted)", fontSize: "11px", marginLeft: "4px" }}>
                    {expandedSection === section.id ? "▼" : "▶"}
                  </span>
                </div>
              </div>

              {expandedSection === section.id && (
                <div className="section-collapse">
                  {section.items?.map((item) => (
                    <div key={item.id} style={{ marginBottom: "12px" }}>
                      {editingItem?.id === item.id ? (
                        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px" }}>
                          {section.type === "experience" && (
                            <>
                              <div className="form-grid" style={{ marginBottom: "8px" }}>
                                <div>
                                  <label className="form-label">Position</label>
                                  <input
                                    className="form-input"
                                    value={editingItem.data.position || ""}
                                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, position: e.target.value } })}
                                    placeholder="Software Engineer"
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Company</label>
                                  <input
                                    className="form-input"
                                    value={editingItem.data.company || ""}
                                    onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, company: e.target.value } })}
                                    placeholder="Google"
                                  />
                                </div>
                              </div>
                              <div style={{ marginBottom: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                  <label className="form-label" style={{ marginBottom: 0 }}>Description / Bullets</label>
                                  <button
                                    onClick={() => handleGenerateExperience(editingItem.data.company || "a company", editingItem.data.position || "a position")}
                                    disabled={isGenerating}
                                    style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "10px", cursor: "pointer" }}
                                  >
                                    {isGenerating ? "Generating..." : "✨ AI Generate"}
                                  </button>
                                </div>
                                <textarea
                                  className="form-input form-textarea"
                                  rows={4}
                                  value={editingItem.data.description || ""}
                                  onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                                  placeholder="• Built amazing things..."
                                />
                              </div>
                            </>
                          )}
                          {section.type !== "experience" && (
                            <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "12px", fontStyle: "italic" }}>
                              Simplified editing in this view for {section.type}. (A full implementation would have targeted inputs).
                            </div>
                          )}

                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button
                              onClick={() => setEditingItem(null)}
                              style={{ background: "none", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text)", padding: "4px 12px", fontSize: "11px", cursor: "pointer" }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveItem}
                              style={{ background: "var(--primary)", border: "none", borderRadius: "6px", color: "white", padding: "4px 12px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "var(--surface)", borderRadius: "7px", padding: "8px 10px", fontSize: "11px", color: "var(--text)" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {section.type === "experience" ? (
                              <>
                                <div style={{ fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {(item.data as any).position || "New Position"} · <span style={{ color: "var(--muted)", fontWeight: 400 }}>{(item.data as any).company || "Company"}</span>
                                </div>
                                {((item.data as any).description) && <div style={{ color: "var(--muted)", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{(item.data as any).description}</div>}
                              </>
                            ) : (
                              <span style={{ fontFamily: "monospace", color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                                {JSON.stringify(item.data).slice(0, 60)}...
                              </span>
                            )}
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, paddingLeft: "8px" }}>
                            <button
                              onClick={() => setEditingItem({ id: item.id, data: { ...item.data } })}
                              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "10px", cursor: "pointer" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              style={{ background: "none", border: "none", color: "var(--accent)", fontSize: "10px", cursor: "pointer" }}
                            >
                              Del
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddItem(section.id, section.type as SectionType)}
                    className="add-item-btn"
                  >
                    + Add Item
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
