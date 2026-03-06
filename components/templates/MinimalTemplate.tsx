import type { Resume, ExperienceItem, EducationItem, SkillsItem, ProjectItem } from "@/types";
import { formatDateRange } from "@/utils/sanitize";

export default function MinimalTemplate({ resume }: { resume: Resume }) {
  const pi = resume.personal_info;
  const sections = resume.sections || [];
  const getSection = (type: string) => sections.find((s) => s.type === type && s.is_visible);

  return (
    <div className="w-full min-h-full px-12 py-12 font-sans text-gray-900 bg-white" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {/* Header — minimal */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{pi?.full_name || "Your Name"}</h1>
        {pi?.job_title && <p className="text-gray-500 mt-1">{pi.job_title}</p>}
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
          {pi?.email && <span>{pi.email}</span>}
          {pi?.phone && <span>{pi.phone}</span>}
          {pi?.location && <span>{pi.location}</span>}
          {pi?.website && <span>{pi.website}</span>}
          {pi?.linkedin && <span>{pi.linkedin}</span>}
          {pi?.github && <span>{pi.github}</span>}
        </div>
        <div className="mt-6 h-px bg-gray-200" />
      </div>

      <div className="space-y-8">
        {pi?.summary && (
          <section>
            <p className="text-gray-600 text-sm leading-relaxed">{pi.summary}</p>
          </section>
        )}

        {getSection("experience")?.items?.length ? (
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium">
              {getSection("experience")!.title}
            </h2>
            <div className="space-y-6">
              {getSection("experience")!.items.map((item) => {
                const data = item.data as ExperienceItem;
                return (
                  <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4">
                    <div>
                      <div className="font-semibold text-gray-900">{data.position}</div>
                      <div className="text-gray-500 text-sm">{data.company}{data.location ? ` · ${data.location}` : ""}</div>
                      {data.description && <p className="text-gray-500 text-sm mt-2 leading-relaxed">{data.description}</p>}
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDateRange(data.start_date, data.end_date, data.is_current)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {getSection("education")?.items?.length ? (
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium">
              {getSection("education")!.title}
            </h2>
            <div className="space-y-4">
              {getSection("education")!.items.map((item) => {
                const data = item.data as EducationItem;
                return (
                  <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4">
                    <div>
                      <div className="font-semibold text-gray-900">{data.institution}</div>
                      <div className="text-gray-500 text-sm">{data.degree}{data.field ? `, ${data.field}` : ""}</div>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDateRange(data.start_date, data.end_date)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {getSection("skills")?.items?.length ? (
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium">
              {getSection("skills")!.title}
            </h2>
            <div className="text-sm text-gray-600">
              {getSection("skills")!.items.map((item, i, arr) => {
                const data = item.data as SkillsItem;
                return (
                  <span key={item.id}>
                    {data.name}{i < arr.length - 1 ? " · " : ""}
                  </span>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
