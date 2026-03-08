import type { Resume, ExperienceItem, EducationItem, SkillsItem, ProjectItem, LanguageItem, CertificationItem } from "@/types";
import { formatDateRange } from "@/utils/sanitize";

export default function MinimalTemplate({ resume }: { resume: Resume }) {
  const pi = resume.personal_info;
  const sections = resume.sections || [];

  const getSection = (type: string) => sections.find((s) => s.type === type && s.is_visible);

  const experienceSection = getSection("experience");
  const educationSection = getSection("education");
  const skillsSection = getSection("skills");
  const projectsSection = getSection("projects");

  return (
    <div id="tmpl-minimal" className="w-full h-full bg-white text-gray-900" style={{ display: "block" }}>
      <div className="resume-minimal" style={{ boxShadow: "none", borderRadius: 0, padding: "20px 0" }}>
        <div className="rm-header">
          <div className="rm-name">{pi?.full_name || "Your Name"}</div>
          <div className="rm-role">{pi?.job_title || "Professional Title"}</div>
          <div className="rm-contact">
            {pi?.email && <span>{pi.email}</span>}
            {pi?.phone && <span>{pi.phone}</span>}
            {pi?.location && <span>{pi.location}</span>}
            {pi?.website && <span>{pi.website}</span>}
            {pi?.linkedin && <span>{pi.linkedin}</span>}
          </div>
        </div>

        {pi?.summary && (
          <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.8, marginBottom: "22px" }}>
            {pi.summary}
          </p>
        )}

        {experienceSection && (experienceSection.items?.length || 0) > 0 && (
          <div className="rm-section">
            <div className="rm-stitle">{experienceSection.title}</div>
            {(experienceSection.items || []).map((item) => {
              const data = item.data as ExperienceItem;
              return (
                <div className="rm-row" key={item.id}>
                  <div className="rm-date whitespace-pre-wrap leading-tight">
                    {formatDateRange(data.start_date, data.end_date, data.is_current).replace(" — ", "\n— ")}
                  </div>
                  <div>
                    <div className="rm-title">{data.position}</div>
                    <div className="rm-sub">{data.company}{data.location ? ` · ${data.location}` : ""}</div>
                    {data.description && <div className="rm-desc whitespace-pre-wrap">{data.description}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {educationSection && (educationSection.items?.length || 0) > 0 && (
          <div className="rm-section">
            <div className="rm-stitle">{educationSection.title}</div>
            {(educationSection.items || []).map((item) => {
              const data = item.data as EducationItem;
              return (
                <div className="rm-row" key={item.id}>
                  <div className="rm-date">
                    {formatDateRange(data.start_date, data.end_date)}
                  </div>
                  <div>
                    <div className="rm-title">{data.institution}</div>
                    <div className="rm-sub">{data.degree}{data.field ? ` · ${data.field}` : ""}{data.gpa ? ` · GPA ${data.gpa}` : ""}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {projectsSection && (projectsSection.items?.length || 0) > 0 && (
          <div className="rm-section">
            <div className="rm-stitle">{projectsSection.title}</div>
            {(projectsSection.items || []).map((item) => {
              const data = item.data as ProjectItem;
              return (
                <div className="rm-row" key={item.id}>
                  <div className="rm-date">
                    {data.url ? <span style={{ fontSize: "9px", wordBreak: 'break-all' }}>{data.url}</span> : "Project"}
                  </div>
                  <div>
                    <div className="rm-title">{data.name}</div>
                    <div className="rm-sub">{data.technologies?.join(", ")}</div>
                    {data.description && <div className="rm-desc whitespace-pre-wrap">{data.description}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {skillsSection && (skillsSection.items?.length || 0) > 0 && (
          <div className="rm-section">
            <div className="rm-stitle">{skillsSection.title}</div>
            {(skillsSection.items || []).map((item) => {
              const data = item.data as SkillsItem;
              return <span key={item.id} className="rm-skill">{data.name}</span>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
