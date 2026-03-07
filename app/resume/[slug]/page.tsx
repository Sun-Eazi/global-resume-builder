import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase";
import ResumePreviewPane from "@/components/resume/ResumePreviewPane";
import type { Resume } from "@/types";
import brand from "@/config/brand";

interface PublicResumePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PublicResumePageProps) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("resumes")
    .select("title, personal_info(full_name, job_title, summary)")
    .eq("slug", params.slug)
    .eq("is_public", true)
    .single();

  if (!data) return { title: "Resume Not Found" };

  const pi = data.personal_info as any;
  return {
    title: `${pi?.full_name || data.title} — Resume | ${brand.appName}`,
    description: pi?.summary || `${pi?.full_name}'s professional resume`,
  };
}

export default async function PublicResumePage({ params }: PublicResumePageProps) {
  const supabase = createServerClient();

  const { data: resumeData, error } = await supabase
    .from("resumes")
    .select(`
      *,
      personal_info(*),
      resume_sections(
        *,
        section_items(*)
      )
    `)
    .eq("slug", params.slug)
    .eq("is_public", true)
    .single();

  if (error || !resumeData) {
    notFound();
  }

  // Increment view count
  await supabase
    .from("resumes")
    .update({ view_count: ((resumeData as any).view_count || 0) + 1 })
    .eq("id", (resumeData as any).id);

  const resume = resumeData as unknown as Resume;
  const pi = resume.personal_info;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Public header bar */}
      <div className="bg-[#0B0E1A] border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">G</div>
          <span>Resume shared via <span className="text-white">{brand.appName}</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{(resumeData as any).view_count || 0} views</span>
          <a
            href={`/auth/signup`}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            Create Your Resume
          </a>
        </div>
      </div>

      {/* Resume content */}
      <div className="flex justify-center py-10 px-4">
        <div className="shadow-2xl">
          <ResumePreviewPane resume={resume} />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center pb-12">
        <p className="text-gray-500 text-sm mb-3">Want to create your own professional resume?</p>
        <a
          href="/auth/signup"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Get Started — It's Free
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
