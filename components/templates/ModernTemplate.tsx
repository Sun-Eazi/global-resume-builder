import type { Resume, ExperienceItem, EducationItem, SkillsItem, ProjectItem } from "@/types";
import { formatDateRange } from "@/utils/sanitize";

export default function ModernTemplate({ resume }: { resume: Resume }) {
  const pi = resume.personal_info;
  const sections = resume.sections || [];

  const getSection = (type: string) => sections.find((s) => s.type === type && s.is_visible);

  const experienceSection = getSection("experience");
  const educationSection = getSection("education");
  const skillsSection = getSection("skills");
  const projectsSection = getSection("projects");
  const certificationsSection = getSection("certifications");
  const languagesSection = getSection("languages");

  return (
    <div className="w-full min-h-full font-sans text-gray-900" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-10 py-8 text-white">
        <h1 className="text-4xl font-bold tracking-tight">{pi?.full_name || "Your Name"}</h1>
        {pi?.job_title && (
          <p className="text-blue-200 mt-1 text-lg">{pi.job_title}</p>
        )}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-blue-100">
          {pi?.email && (
            <span className="flex items-center gap-1.5">
              <span>✉</span> {pi.email}
            </span>
          )}
          {pi?.phone && (
            <span className="flex items-center gap-1.5">
              <span>📞</span> {pi.phone}
            </span>
          )}
          {pi?.location && (
            <span className="flex items-center gap-1.5">
              <span>📍</span> {pi.location}
            </span>
          )}
          {pi?.website && (
            <span className="flex items-center gap-1.5">
              <span>🌐</span> {pi.website}
            </span>
          )}
          {pi?.linkedin && (
            <span className="flex items-center gap-1.5">
              <span>in</span> {pi.linkedin}
            </span>
          )}
          {pi?.github && (
            <span className="flex items-center gap-1.5">
              <span>⌥</span> {pi.github}
            </span>
          )}
        </div>
      </div>

      <div className="px-10 py-8 space-y-8">
        {/* Summary */}
        {pi?.summary && (
          <section>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 border-b-2 border-blue-600 pb-1">
              Summary
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">{pi.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experienceSection && experienceSection.items.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 border-b-2 border-blue-600 pb-1">
              {experienceSection.title}
            </h2>
            <div className="space-y-5">
              {experienceSection.items.map((item) => {
                const data = item.data as ExperienceItem;
                return (
                  <div key={item.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{data.position}</h3>
                        <div className="text-blue-600 text-sm font-medium">{data.company}</div>
                      </div>
                      <div className="text-right text-xs text-gray-500 shrink-0 ml-4">
                        <div>{formatDateRange(data.start_date, data.end_date, data.is_current)}</div>
                        {data.location && <div>{data.location}</div>}
                      </div>
                    </div>
                    {data.description && (
                      <p className="text-gray-600 text-sm mt-2 leading-relaxed">{data.description}</p>
                    )}
                    {data.highlights && data.highlights.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {data.highlights.map((h, i) => (
                          <li key={i} className="text-gray-600 text-sm flex gap-2">
                            <span className="text-blue-500 mt-0.5 shrink-0">▸</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Education */}
        {educationSection && educationSection.items.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 border-b-2 border-blue-600 pb-1">
              {educationSection.title}
            </h2>
            <div className="space-y-4">
              {educationSection.items.map((item) => {
                const data = item.data as EducationItem;
                return (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{data.institution}</h3>
                      <div className="text-sm text-gray-600">
                        {data.degree}{data.field ? `, ${data.field}` : ""}
                        {data.gpa ? ` — GPA: ${data.gpa}` : ""}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 shrink-0 ml-4">
                      {formatDateRange(data.start_date, data.end_date)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Skills */}
        {skillsSection && skillsSection.items.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 border-b-2 border-blue-600 pb-1">
              {skillsSection.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              {skillsSection.items.map((item) => {
                const data = item.data as SkillsItem;
                return (
                  <span
                    key={item.id}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                  >
                    {data.name}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* Projects */}
        {projectsSection && projectsSection.items.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 border-b-2 border-blue-600 pb-1">
              {projectsSection.title}
            </h2>
            <div className="space-y-4">
              {projectsSection.items.map((item) => {
                const data = item.data as ProjectItem;
                return (
                  <div key={item.id}>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{data.name}</h3>
                      {data.url && (
                        <span className="text-blue-500 text-xs">{data.url}</span>
                      )}
                    </div>
                    {data.description && (
                      <p className="text-gray-600 text-sm mt-1">{data.description}</p>
                    )}
                    {data.technologies && data.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {data.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
