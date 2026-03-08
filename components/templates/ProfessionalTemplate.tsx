import type { Resume, ExperienceItem, EducationItem, SkillsItem, ProjectItem, LanguageItem, CertificationItem } from "@/types";
import { formatDateRange } from "@/utils/sanitize";

export default function ProfessionalTemplate({ resume }: { resume: Resume }) {
  const pi = resume.personal_info;
  const sections = resume.sections || [];

  const getSection = (type: string) => sections.find((s) => s.type === type && s.is_visible);

  const experienceSection = getSection("experience");
  const educationSection = getSection("education");
  const skillsSection = getSection("skills");
  const projectsSection = getSection("projects");

  return (
    <div id="tmpl-professional" className="w-full h-full bg-white text-gray-900" style={{ display: "block" }}>
      <div className="resume-professional" style={{ boxShadow: "none", borderRadius: 0, padding: "24px 0" }}>
        <div className="rp-header">
          <div className="rp-name">{pi?.full_name || "Your Name"}</div>
          <div className="rp-role">{pi?.job_title || "Professional Title"}</div>
          <div className="rp-contact">
            {pi?.email && <span>{pi.email}</span>}
            {pi?.phone && <span>{pi.phone}</span>}
            {pi?.location && <span>{pi.location}</span>}
            {pi?.linkedin && <span>{pi.linkedin}</span>}
            {pi?.website && <span>{pi.website}</span>}
          </div>
        </div>
        <div className="rp-accent"></div>
        <div className="rp-body">
          {pi?.summary && (
            <div className="rp-summary">
              {pi.summary}
            </div>
          )}

          {experienceSection && (experienceSection.items?.length || 0) > 0 && (
            <div className="rp-section">
              <div className="rp-stitle"><div className="rp-bar"></div><div className="rp-sname">{experienceSection.title}</div><div className="rp-sline"></div></div>
              {(experienceSection.items || []).map((item) => {
                const data = item.data as ExperienceItem;
                return (
                  <div className="rp-item" key={item.id}>
                    <div className="rp-row">
                      <div><span className="rp-job">{data.position}</span><span className="rp-co"> · {data.company}</span></div>
                      <div className="rp-date text-right whitespace-pre-wrap leading-[1.2]">
                        {formatDateRange(data.start_date, data.end_date, data.is_current)}
                        {data.location ? `\n${data.location}` : ""}
                      </div>
                    </div>
                    {data.description && <div className="rp-desc whitespace-pre-wrap">{data.description}</div>}
                  </div>
                );
              })}
            </div>
          )}

          {educationSection && (educationSection.items?.length || 0) > 0 && (
            <div className="rp-section">
              <div className="rp-stitle"><div className="rp-bar"></div><div className="rp-sname">{educationSection.title}</div><div className="rp-sline"></div></div>
              {(educationSection.items || []).map((item) => {
                const data = item.data as EducationItem;
                return (
                  <div className="rp-item" key={item.id}>
                    <div className="rp-row">
                      <div><span className="rp-job">{data.degree}{data.field ? `, ${data.field}` : ""}</span><span className="rp-co">, {data.institution}</span></div>
                      <div className="rp-date text-right whitespace-pre-wrap leading-[1.2]">
                        {formatDateRange(data.start_date, data.end_date)}
                        {data.gpa ? `\nGPA ${data.gpa}` : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {projectsSection && (projectsSection.items?.length || 0) > 0 && (
            <div className="rp-section">
              <div className="rp-stitle"><div className="rp-bar"></div><div className="rp-sname">{projectsSection.title}</div><div className="rp-sline"></div></div>
              {(projectsSection.items || []).map((item) => {
                const data = item.data as ProjectItem;
                return (
                  <div className="rp-item" key={item.id}>
                    <div className="rp-row">
                      <div><span className="rp-job">{data.name}</span>{data.technologies && <span className="rp-co"> · {Array.isArray(data.technologies) ? data.technologies.join(", ") : String(data.technologies)}</span>}</div>
                      {data.url && <div className="rp-date lowercase">{data.url}</div>}
                    </div>
                    {data.description && <div className="rp-desc whitespace-pre-wrap">{data.description}</div>}
                  </div>
                );
              })}
            </div>
          )}

          {skillsSection && (skillsSection.items?.length || 0) > 0 && (
            <div className="rp-section">
              <div className="rp-stitle"><div className="rp-bar"></div><div className="rp-sname">{skillsSection.title}</div><div className="rp-sline"></div></div>
              <div className="rp-item" style={{ fontSize: "11px", color: "#374151" }}>
                {(skillsSection.items || []).map((item, index) => {
                  const data = item.data as SkillsItem;
                  return (
                    <span key={item.id}>
                      {data.name}
                      {index < (skillsSection.items?.length || 0) - 1 ? <span> &nbsp;|&nbsp; </span> : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
