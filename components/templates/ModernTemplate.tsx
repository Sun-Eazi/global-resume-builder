import type { Resume, ExperienceItem, EducationItem, SkillsItem, ProjectItem, LanguageItem, CertificationItem } from "@/types";
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

  const initials = pi?.full_name
    ? pi.full_name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "Me";

  return (
    <div id="tmpl-modern" className="w-full h-full bg-white text-gray-900" style={{ display: "block" }}>
      <div className="resume-card" style={{ boxShadow: "none", border: "none", borderRadius: 0 }}>
        <div className="resume-modern-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="resume-name">{pi?.full_name || "Your Name"}</div>
              <div className="resume-role">{pi?.job_title || "Professional Title"}</div>
              <div className="resume-contact">
                {pi?.email && <span>✉ {pi.email}</span>}
                {pi?.phone && <span>☎ {pi.phone}</span>}
                {pi?.location && <span>⊙ {pi.location}</span>}
                {pi?.linkedin && <span>in {pi.linkedin}</span>}
                {pi?.website && <span>🌐 {pi.website}</span>}
                {pi?.github && <span>⌥ {pi.github}</span>}
              </div>
            </div>
            <div style={{
              width: "54px", height: "54px", borderRadius: "50%",
              background: "linear-gradient(135deg,#0A84FF,#70BFFF)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontFamily: "var(--font-syne), sans-serif",
              fontWeight: 800, fontSize: "18px", border: "3px solid rgba(255,255,255,.2)"
            }}>
              {initials}
            </div>
          </div>
        </div>

        <div className="resume-body">
          <div className="resume-sidebar">
            {/* Summary */}
            {pi?.summary && (
              <div style={{ marginBottom: "18px" }}>
                <div className="r-section-title">Summary</div>
                <p style={{ fontSize: "10px", color: "#475569", lineHeight: 1.7 }}>
                  {pi.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {skillsSection && (skillsSection.items?.length || 0) > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div className="r-section-title">{skillsSection.title}</div>
                <div>
                  {(skillsSection.items || []).map((item) => {
                    const data = item.data as SkillsItem;
                    return <span key={item.id} className="r-skill-tag">{data.name}</span>;
                  })}
                </div>
              </div>
            )}

            {/* Languages */}
            {languagesSection && (languagesSection.items?.length || 0) > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div className="r-section-title">{languagesSection.title}</div>
                {(languagesSection.items || []).map((item) => {
                  const data = item.data as LanguageItem;
                  return (
                    <div key={item.id} style={{ fontSize: "10px", color: "#1E293B", marginBottom: "4px" }}>
                      <strong>{data.name}</strong> <span style={{ color: "#64748B" }}>{data.proficiency?.replace(/_/g, " ")}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Certifications */}
            {certificationsSection && (certificationsSection.items?.length || 0) > 0 && (
              <div>
                <div className="r-section-title">{certificationsSection.title}</div>
                {(certificationsSection.items || []).map((item) => {
                  const data = item.data as CertificationItem;
                  return (
                    <div key={item.id} style={{ marginBottom: "8px" }}>
                      <div style={{ fontSize: "10px", color: "#1E293B", fontWeight: 600 }}>{data.name}</div>
                      <div style={{ fontSize: "9px", color: "#64748B" }}>{data.issuer}{data.date ? ` · ${data.date}` : ""}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="resume-main">
            {/* Work Experience */}
            {experienceSection && (experienceSection.items?.length || 0) > 0 && (
              <div className="r-main-section">
                <div className="r-main-title">{experienceSection.title}</div>
                {(experienceSection.items || []).map((item) => {
                  const data = item.data as ExperienceItem;
                  return (
                    <div className="r-job" key={item.id}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div><div className="r-job-title">{data.position}</div><div className="r-job-company">{data.company}</div></div>
                        <div style={{ textAlign: "right", minWidth: "100px" }}>
                          <div className="r-job-date">{formatDateRange(data.start_date, data.end_date, data.is_current)}</div>
                          {data.location && <div style={{ fontSize: "9px", color: "#94A3B8" }}>{data.location}</div>}
                        </div>
                      </div>
                      {data.description && <div className="r-job-desc whitespace-pre-wrap">{data.description}</div>}
                    </div>
                  );
                })}
              </div>
            )}

            {(experienceSection?.items?.length ?? 0) > 0 && <div className="r-divider"></div>}

            {/* Education */}
            {educationSection && (educationSection.items?.length || 0) > 0 && (
              <div className="r-main-section">
                <div className="r-main-title">{educationSection.title}</div>
                {(educationSection.items || []).map((item) => {
                  const data = item.data as EducationItem;
                  return (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A" }}>{data.degree}{data.field ? ` in ${data.field}` : ""}</div>
                        <div style={{ fontSize: "11px", color: "#0A84FF", fontWeight: 500 }}>{data.institution}</div>
                      </div>
                      <div style={{ fontSize: "10px", color: "#64748B", textAlign: "right", minWidth: "100px" }}>
                        {formatDateRange(data.start_date, data.end_date)}
                        {data.gpa && <><br />GPA {data.gpa}</>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {(educationSection?.items?.length || 0) > 0 && projectsSection && (projectsSection.items?.length || 0) > 0 && <div className="r-divider"></div>}

            {/* Projects */}
            {projectsSection && (projectsSection.items?.length || 0) > 0 && (
              <div className="r-main-section">
                <div className="r-main-title">{projectsSection.title}</div>
                {(projectsSection.items || []).map((item) => {
                  const data = item.data as ProjectItem;
                  return (
                    <div className="r-job" key={item.id}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div><div className="r-job-title">{data.name}</div></div>
                        <div style={{ textAlign: "right" }}>
                          {data.url && <div className="r-job-date lowercase" style={{ textTransform: 'lowercase' }}>{data.url}</div>}
                        </div>
                      </div>
                      {data.description && <div className="r-job-desc whitespace-pre-wrap">{data.description}</div>}
                      {data.technologies && (
                        <div style={{ marginTop: "4px" }}>
                          {Array.isArray(data.technologies) ? data.technologies.map((tech, i) => (
                            <span key={i} className="r-skill-tag inline-block mr-1 mb-1">{tech}</span>
                          )) : <span className="r-skill-tag inline-block mr-1 mb-1">{String(data.technologies)}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
