import type { Resume, ExperienceItem, EducationItem, SkillsItem, ProjectItem, LanguageItem, CertificationItem } from "@/types";
import { formatDateRange } from "@/utils/sanitize";

export default function ProfessionalTemplate({ resume }: { resume: Resume }) {
  const pi = resume.personal_info;
  const sections = resume.sections || [];
  const getSection = (type: string) => sections.find((s) => s.type === type && s.is_visible);

  const proficiencyLabel: Record<string, string> = {
    native: "Native",
    full_professional: "Fluent",
    professional_working: "Professional",
    limited_working: "Intermediate",
    elementary: "Basic",
  };

  return (
    <div className="w-full min-h-full flex font-sans text-sm bg-white" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {/* Left sidebar */}
      <div className="w-[240px] bg-gray-900 text-white shrink-0 px-6 py-8 space-y-7">
        {/* Avatar placeholder */}
        <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-2xl font-bold">
          {(pi?.full_name?.[0] || "?").toUpperCase()}
        </div>

        <div>
          <h1 className="text-xl font-bold leading-tight">{pi?.full_name || "Your Name"}</h1>
          {pi?.job_title && <p className="text-violet-300 text-xs mt-1">{pi.job_title}</p>}
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 font-semibold">Contact</h3>
          <div className="space-y-1.5 text-xs text-gray-300">
            {pi?.email && <div>{pi.email}</div>}
            {pi?.phone && <div>{pi.phone}</div>}
            {pi?.location && <div>{pi.location}</div>}
            {pi?.website && <div className="text-violet-300">{pi.website}</div>}
            {pi?.linkedin && <div className="text-violet-300">{pi.linkedin}</div>}
            {pi?.github && <div className="text-violet-300">{pi.github}</div>}
          </div>
        </div>

        {/* Skills */}
        {getSection("skills")?.items?.length ? (
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 font-semibold">
              {getSection("skills")!.title}
            </h3>
            <div className="space-y-2">
              {getSection("skills")!.items.map((item) => {
                const data = item.data as SkillsItem;
                const levelMap: Record<string, number> = {
                  beginner: 25, intermediate: 50, advanced: 75, expert: 100,
                };
                const width = levelMap[data.level || "expert"] || 80;
                return (
                  <div key={item.id}>
                    <div className="text-xs text-gray-200 mb-1">{data.name}</div>
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Languages */}
        {getSection("languages")?.items?.length ? (
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 font-semibold">Languages</h3>
            <div className="space-y-1">
              {getSection("languages")!.items.map((item) => {
                const data = item.data as LanguageItem;
                return (
                  <div key={item.id} className="flex justify-between text-xs text-gray-300">
                    <span>{data.name}</span>
                    <span className="text-gray-500">{proficiencyLabel[data.proficiency || ""] || ""}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* Main content */}
      <div className="flex-1 px-8 py-8 space-y-7">
        {pi?.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-violet-700 mb-3 border-b border-gray-200 pb-1">
              Profile
            </h2>
            <p className="text-gray-600 text-xs leading-relaxed">{pi.summary}</p>
          </section>
        )}

        {getSection("experience")?.items?.length ? (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-violet-700 mb-4 border-b border-gray-200 pb-1">
              {getSection("experience")!.title}
            </h2>
            <div className="space-y-5">
              {getSection("experience")!.items.map((item) => {
                const data = item.data as ExperienceItem;
                return (
                  <div key={item.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-gray-900">{data.position}</div>
                        <div className="text-violet-700 text-xs font-medium mt-0.5">{data.company}</div>
                      </div>
                      <div className="text-right text-xs text-gray-400 shrink-0 ml-4">
                        <div>{formatDateRange(data.start_date, data.end_date, data.is_current)}</div>
                        {data.location && <div>{data.location}</div>}
                      </div>
                    </div>
                    {data.description && <p className="text-gray-600 text-xs mt-1.5 leading-relaxed">{data.description}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {getSection("education")?.items?.length ? (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-violet-700 mb-4 border-b border-gray-200 pb-1">
              {getSection("education")!.title}
            </h2>
            <div className="space-y-4">
              {getSection("education")!.items.map((item) => {
                const data = item.data as EducationItem;
                return (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-900">{data.institution}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{data.degree}{data.field ? `, ${data.field}` : ""}</div>
                      {data.gpa && <div className="text-gray-400 text-xs">GPA: {data.gpa}</div>}
                    </div>
                    <div className="text-xs text-gray-400 shrink-0 ml-4">
                      {formatDateRange(data.start_date, data.end_date)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
