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

type ActiveTab = "personal" | "sections" | "template" | "settings";

export default function BuilderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("personal");
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
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
      setSaveMsg("Saved!");
      setTimeout(() => setSaveMsg(""), 2000);
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
    }
    setIsGeneratingPdf(false);
  };

  const updateResumeLocally = (updates: Partial<Resume>) => {
    setResume((prev) => prev ? { ...prev, ...updates } : prev);
    setIsDirty(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E1A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!resume) return null;

  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "sections", label: "Sections", icon: "📄" },
    { id: "template", label: "Template", icon: "🎨" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E1A] flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/5 px-4 md:px-6 py-3 flex items-center gap-4 bg-[#0B0E1A]/95 backdrop-blur-sm sticky top-0 z-20">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <input
          type="text"
          value={resume.title}
          onChange={(e) => updateResumeLocally({ title: e.target.value })}
          className="flex-1 bg-transparent text-white font-medium text-sm outline-none border-b border-transparent focus:border-white/20 pb-0.5 max-w-xs"
        />

        <div className="ml-auto flex items-center gap-2">
          {saveMsg && <span className="text-xs text-green-400">{saveMsg}</span>}
          {isDirty && <span className="text-xs text-yellow-400">Unsaved</span>}

          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`hidden md:flex btn-ghost text-xs px-3 py-1.5 gap-1.5 ${showPreview ? "border-blue-500/30 text-blue-400" : ""}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>

          <button onClick={handleSave} disabled={isSaving || !isDirty} className="btn-primary text-xs px-3 py-1.5">
            {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="btn-ghost text-xs px-3 py-1.5 gap-1.5"
          >
            {isGeneratingPdf ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PDF
              </>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 flex flex-col bg-[#0D1120] shrink-0 overflow-y-auto hidden md:flex">
          <nav className="p-3 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Public toggle */}
          <div className="mt-auto p-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-gray-400">Public Link</div>
                <div className="text-xs text-gray-600 mt-0.5">Share your resume</div>
              </div>
              <button
                onClick={() => updateResumeLocally({ is_public: !resume.is_public })}
                className={`relative w-10 h-5.5 rounded-full transition-colors ${
                  resume.is_public ? "bg-blue-600" : "bg-white/10"
                }`}
                style={{ height: "22px" }}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    resume.is_public ? "translate-x-[18px]" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            {resume.is_public && (
              <div className="mt-3 flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-400 truncate flex-1">
                  /resume/{resume.slug}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/resume/${resume.slug}`)}
                  className="text-gray-500 hover:text-white transition-colors shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main editor area */}
        <main className={`flex-1 overflow-y-auto ${showPreview ? "hidden md:block md:max-w-[45%]" : ""}`}>
          <div className="max-w-2xl mx-auto p-6">
            {activeTab === "personal" && (
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
              <TemplateSelector
                selected={resume.template_id as TemplateId}
                onChange={(t) => updateResumeLocally({ template_id: t })}
              />
            )}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Resume Settings</h2>
                <div>
                  <label className="label">Resume Title</label>
                  <input
                    type="text"
                    value={resume.title}
                    onChange={(e) => updateResumeLocally({ title: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Visibility</label>
                  <div className="glass rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white font-medium">Public Resume</div>
                      <div className="text-xs text-gray-500 mt-0.5">Anyone with the link can view</div>
                    </div>
                    <button
                      onClick={() => updateResumeLocally({ is_public: !resume.is_public })}
                      className={`relative w-10 rounded-full transition-colors ${resume.is_public ? "bg-blue-600" : "bg-white/10"}`}
                      style={{ height: "22px" }}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${resume.is_public ? "translate-x-[18px]" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Preview pane */}
        {showPreview && (
          <div className="hidden md:flex flex-1 border-l border-white/5 bg-gray-100 overflow-auto p-6 justify-center">
            <div className="shadow-2xl" style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
              <ResumePreviewPane resume={resume} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
