"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getResumes, createResume, deleteResume, duplicateResume } from "@/lib/resume";
import type { Resume } from "@/types";
import brand from "@/config/brand";

function ResumeCard({
  resume,
  onDelete,
  onDuplicate,
}: {
  resume: Resume;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const templateColors: Record<string, string> = {
    modern: "from-blue-500/20 to-indigo-500/20",
    minimal: "from-gray-500/20 to-slate-500/20",
    professional: "from-violet-500/20 to-purple-500/20",
  };

  return (
    <div className="group relative feature-card overflow-hidden transition-all duration-300 hover:-translate-y-1" style={{ padding: 0 }}>
      {/* Thumbnail */}
      <div
        onClick={() => router.push(`/builder/${resume.id}`)}
        className={`h-40 cursor-pointer bg-gradient-to-br ${templateColors[resume.template_id] || templateColors.modern} relative overflow-hidden`}
      >
        <div className="absolute inset-0 p-4">
          <div className="bg-white/10 rounded-lg h-full p-3 space-y-2">
            <div className="h-2.5 bg-white/30 rounded w-3/4" />
            <div className="h-2 bg-white/20 rounded w-1/2" />
            <div className="mt-3 space-y-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-1.5 bg-white/15 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          </div>
        </div>
        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/builder/${resume.id}`);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Open Editor
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="text-white font-medium text-sm truncate">{resume.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 capitalize">{resume.template_id}</span>
              {resume.is_public && (
                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                  Public
                </span>
              )}
            </div>
          </div>

          {/* Kebab menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 bottom-full mb-1 z-20 bg-[#1F2937] border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[160px]">
                  <button
                    onClick={() => { setShowMenu(false); router.push(`/builder/${resume.id}`); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); onDuplicate(resume.id); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Duplicate
                  </button>
                  {resume.is_public && (
                    <>
                      <a
                        href={`/resume/${resume.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShowMenu(false)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        Open Public Link
                      </a>
                      <button
                        onClick={() => { setShowMenu(false); navigator.clipboard.writeText(`${window.location.origin}/resume/${resume.slug}`); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy Link
                      </button>
                    </>
                  )}
                  <div className="h-px bg-white/5 mx-2" />
                  <button
                    onClick={() => { setShowMenu(false); onDelete(resume.id); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Updated {new Date(resume.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, profile, signOut, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  const loadResumes = useCallback(async () => {
    if (!user) return;
    const data = await getResumes(user.id);
    setResumes(data);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const handleCreate = async () => {
    if (!user) return;
    setIsCreating(true);
    setError(null);
    try {
      const resume = await createResume(user.id, "My Resume");
      router.push(`/builder/${resume.id}`);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message?.includes("foreign key constraint")
          ? "Database Configuration Error: Your account was created before the database tables were fully set up. Please run the SQL Fix Script provided by the assistant to synchronize your account."
          : err.message || "Failed to create resume."
      );
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume? This cannot be undone.")) return;
    await deleteResume(id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDuplicate = async (id: string) => {
    if (!user) return;
    const copy = await duplicateResume(id, user.id);
    setResumes((prev) => [copy, ...prev]);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0E1A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div id="page-dashboard" className="page active" style={{ display: "block", minHeight: "100vh" }}>
      {/* Top Nav */}
      <nav className="custom-nav" style={{ position: "relative", zIndex: 10 }}>
        <div className="nav-inner" style={{ maxWidth: "1280px" }}>
          <Link href="/" className="logo">
            <div className="logo-icon">GRB</div>
            <span className="logo-name">{brand.appName}</span>
          </Link>
          <div className="nav-btns">
            <span className="text-sm text-gray-400 hidden md:inline-block mr-4">
              {profile?.full_name || user.email}
            </span>
            <button onClick={signOut} className="cv-btn cv-btn-ghost" style={{ padding: "8px 16px", fontSize: "13px" }}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 pt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              Welcome back, {profile?.full_name?.split(" ")[0] || "there"}
            </h1>
            <p className="text-gray-400 mt-1">{resumes.length} resume{resumes.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={handleCreate} disabled={isCreating} className="cv-btn cv-btn-primary">
            {isCreating ? "Creating..." : "New Resume →"}
          </button>
        </div>

        {error && (
          <div className="mb-8 px-4 py-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500/90 text-sm w-full">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <strong className="block font-medium mb-1">Error Creating Resume</strong>
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Resume Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="feature-card overflow-hidden" style={{ padding: 0 }}>
                <div className="h-40 skeleton" />
                <div className="p-4 space-y-2">
                  <div className="h-3 skeleton rounded w-3/4" />
                  <div className="h-2.5 skeleton rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: "Syne, sans-serif" }}>No resumes yet</h3>
            <p className="text-gray-500 mb-8">Create your first resume to get started</p>
            <button onClick={handleCreate} className="cv-btn cv-btn-primary flex items-center gap-2 mx-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create my first resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
            {/* Create new card */}
            <button
              onClick={handleCreate}
              className="feature-card border border-dashed border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-blue-400"
            >
              <div className="w-10 h-10 rounded-xl border border-current flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-medium">New Resume</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
