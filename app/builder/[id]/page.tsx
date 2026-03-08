"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getResumeById, updateResume, updatePersonalInfo } from "@/lib/resume";
import type { Resume, TemplateId } from "@/types";
import PersonalInfoForm from "@/components/resume/PersonalInfoForm";
import SectionsEditor from "@/components/resume/SectionsEditor";
import TemplateSelector from "@/components/resume/TemplateSelector";
import ResumePreviewPane from "@/components/resume/ResumePreviewPane";
import brand from "@/config/brand";
import Link from "next/link";

type ActiveTab = "info" | "sections" | "template" | "settings";

export default function BuilderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("info");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [scale, setScale] = useState(62);
  const [origin, setOrigin] = useState("");

  // AI Mock Feature
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  const loadResume = useCallback(async () => {
    if (!id) return;
    const data = await getResumeById(id);
    if (!data || data.user_id !== user?.id) {
      router.push("/dashboard");
      return;
    }
    setResume(data);
    setIsLoading(false);
  }, [id, user, router]);

  useEffect(() => {
    if (user) loadResume();
  }, [user, loadResume]);

  const handleSave = async () => {
    if (!resume || isSaving) return;
    setIsSaving(true);
    try {
      await updateResume(resume.id, {
        title: resume.title,
        template_id: resume.template_id,
        is_public: resume.is_public,
      });
      if (resume.personal_info) {
        await updatePersonalInfo(resume.id, resume.personal_info);
      }
      setIsDirty(false);
      setSaveMsg("✓ Saved");
      setTimeout(() => setSaveMsg(""), 2200);
    } catch (err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  const handleDownloadPdf = async () => {
    if (!resume) return;
    setIsGeneratingPdf(true);
    try {
      const res = await fetch(`/api/pdf/${resume.id}`);
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("In the full app, this triggers Puppeteer server-side to generate a pixel-perfect A4 PDF! Run the Next.js app to use real PDF export.");
    }
    setIsGeneratingPdf(false);
  };

  const updateResumeLocally = (updates: Partial<Resume>) => {
    setResume((prev) => prev ? { ...prev, ...updates } : prev);
    setIsDirty(true);
  };

  const runAI = () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setAiResult("Generating…");
    setTimeout(() => {
      const AI_SAMPLES = [
        "• Increased API response time by 42% through Redis caching and query optimization\n• Reduced infrastructure costs by $24K/year by migrating to containerized microservices\n• Led cross-functional team of 8 to deliver critical product feature 2 weeks ahead of schedule",
        "• Architected real-time notification system handling 1M+ daily events with <50ms latency\n• Implemented CI/CD pipeline reducing deployment time from 4 hours to 12 minutes\n• Mentored 3 junior engineers, 2 of whom were promoted within 12 months",
        "• Redesigned checkout flow, improving conversion rate by 23% and reducing cart abandonment\n• Built A/B testing framework used by 8 product teams across the organization\n• Achieved 99.98% uptime for payment processing system serving $2B+ in annual transactions"
      ];
      setAiResult(AI_SAMPLES[Math.floor(Math.random() * AI_SAMPLES.length)]);
      setIsAiGenerating(false);
    }, 1400);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0A84FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div id="page-builder" className="page active flex flex-col min-h-screen">
      <nav style={{ position: "relative", backdropFilter: "none", zIndex: 10 }}>
        <div className="nav-inner" style={{ maxWidth: "100%" }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-400 hover:text-white transition-colors"
              title="Back to Dashboard"
            >
              <svg className="w-5 h-5 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <input
              type="text"
              value={resume.title}
              onChange={(e) => updateResumeLocally({ title: e.target.value })}
              title="Resume Title"
              className="bg-transparent text-white font-medium text-sm outline-none border-b border-transparent focus:border-white/20 max-w-xs"
            />
          </div>

          <div className="flex items-center gap-3">
            {isDirty && <span className="text-xs text-[#FF6B35]">Unsaved</span>}
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className={`cv-btn ${saveMsg ? "cv-btn-ghost" : "cv-btn-primary"} cv-btn-sm ${saveMsg ? "!text-[#3FB950] border !border-[#3FB950]/30 !bg-[#3FB950]/10" : ""}`}
            >
              {isSaving ? "Saving..." : saveMsg || "Save Changes"}
            </button>
          </div>
        </div>
      </nav>

      <div className="builder-layout" style={{ paddingTop: 0, flex: 1, height: "auto" }}>
        {/* Sidebar */}
        <aside className="builder-sidebar">
          <div className="builder-tabs">
            <button
              className={`builder-tab ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
              title="Personal Info"
            >
              👤
            </button>
            <button
              className={`builder-tab ${activeTab === "sections" ? "active" : ""}`}
              onClick={() => setActiveTab("sections")}
              title="Sections"
            >
              📋
            </button>
            <button
              className={`builder-tab ${activeTab === "template" ? "active" : ""}`}
              onClick={() => setActiveTab("template")}
              title="Template"
            >
              🎨
            </button>
            <button
              className={`builder-tab ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
              title="Settings"
            >
              ⚙
            </button>
          </div>

          <div className="builder-tab-content">
            {activeTab === "info" && (
              <PersonalInfoForm
                resumeId={resume.id}
                data={resume.personal_info}
                onChange={(info) => updateResumeLocally({ personal_info: info })}
              />
            )}

            {activeTab === "sections" && (
              <SectionsEditor
                resumeId={resume.id}
                sections={resume.sections || []}
                onRefresh={loadResume}
              />
            )}

            {activeTab === "template" && (
              <div>
                <p style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "14px", fontFamily: "var(--font-syne), sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em" }}>Choose Template</p>
                <TemplateSelector
                  selected={resume.template_id as TemplateId}
                  onChange={(t) => updateResumeLocally({ template_id: t })}
                />

                <div style={{ marginTop: "20px" }}>
                  <p style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "8px" }}>Preview Scale</p>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <p style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "12px", fontFamily: "var(--font-syne), sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em" }}>Visibility</p>

                <div className="toggle-row">
                  <div>
                    <div style={{ fontSize: "13px", color: "var(--text)" }}>Public Resume Link</div>
                    <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>Anyone with link can view</div>
                  </div>
                  <button
                    className={`toggle ${resume.is_public ? "on" : ""}`}
                    onClick={() => updateResumeLocally({ is_public: !resume.is_public })}
                  />
                </div>

                {resume.is_public && (
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px", marginBottom: "14px" }}>
                    <div style={{ fontSize: "10px", color: "var(--muted)", marginBottom: "3px" }}>Your Public URL</div>
                    <Link
                      href={`/resume/${resume.slug}`}
                      target="_blank"
                      style={{ fontSize: "11px", color: "#58A6FF", textDecoration: "none" }}
                    >
                      {origin ? `${origin}/resume/${resume.slug}` : `.../resume/${resume.slug}`}
                    </Link>
                  </div>
                )}

                <p style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "12px", marginTop: "24px", fontFamily: "var(--font-syne), sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em" }}>🤖 AI Assistant</p>
                <textarea
                  className="form-input form-textarea"
                  rows={3}
                  placeholder="e.g. Write 3 bullet points for a React developer at a fintech startup with 3 years experience"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <button
                  onClick={runAI}
                  disabled={isAiGenerating || !aiPrompt.trim()}
                  style={{
                    width: "100%", marginTop: "8px", padding: "9px",
                    background: "rgba(255,107,53,.15)", border: "1px solid rgba(255,107,53,.3)",
                    color: "#FF6B35", borderRadius: "8px", fontSize: "12px", cursor: "pointer",
                    fontFamily: "var(--font-dm-sans), sans-serif", transition: "all .2s",
                    opacity: isAiGenerating || !aiPrompt.trim() ? 0.5 : 1
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,107,53,.25)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,107,53,.15)"}
                >
                  {isAiGenerating ? "Generating..." : "✨ Get AI Suggestion"}
                </button>
                {aiResult && (
                  <div style={{ marginTop: "10px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px", fontSize: "11px", color: "#C9D1D9", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                    {aiResult}
                  </div>
                )}

                <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    style={{
                      width: "100%", padding: "10px", background: "var(--primary)", color: "white",
                      border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                      cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif", transition: "all .2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#0060DF"}
                    onMouseOut={(e) => e.currentTarget.style.background = "var(--primary)"}
                  >
                    {isGeneratingPdf ? "Generating PDF..." : "⬇ Download PDF"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Preview */}
        <main className="builder-preview" id="builder-preview-area">
          <div className="preview-wrap" style={{ transform: `scale(${scale / 100})` }}>
            <ResumePreviewPane resume={resume} />
          </div>
        </main>
      </div>
    </div>
  );
}
