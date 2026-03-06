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
    <div className="group relative glass rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div
        className={`h-40 bg-gradient-to-br ${templateColors[resume.template_id] || templateColors.modern} relative overflow-hidden`}
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
            onClick={() => router.push(`/builder/${resume.id}`)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => router.push(`/resume/preview/${resume.id}`)}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors border border-white/20"
          >
            Preview
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
                    <button
                      onClick={() => { setShowMenu(false); navigator.clipboard.writeText(`${window.location.origin}/resume/${resume.slug}`); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      Copy Link
                    </button>
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
    try {
      const resume = await createResume(user.id, "My Resume");
      router.push(`/builder/${resume.id}`);
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-[#0B0E1A]">
      {/* Top Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10 bg-[#0B0E1A]/90">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs">G</div>
          <span className="font-semibold text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>{brand.appName}</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden md:block">
            {profile?.full_name || user.email}
          </span>
          <button
            onClick={signOut}
            className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              My Resumes
            </h1>
            <p className="text-gray-400 mt-1">{resumes.length} resume{resumes.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={handleCreate} disabled={isCreating} className="btn-primary">
            {isCreating ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Resume
              </>
            )}
          </button>
        </div>

        {/* Resume Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden border border-white/10">
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
            <button onClick={handleCreate} className="btn-primary">
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
              className="glass rounded-2xl border border-dashed border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-blue-400"
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
