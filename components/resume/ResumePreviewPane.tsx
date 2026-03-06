import type { Resume } from "@/types";
import { formatDateRange } from "@/utils/sanitize";
import ModernTemplate from "@/components/templates/ModernTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";

interface ResumePreviewPaneProps {
  resume: Resume;
}

export default function ResumePreviewPane({ resume }: ResumePreviewPaneProps) {
  const templateId = resume.template_id || "modern";

  return (
    <div className="w-[794px] min-h-[1123px] bg-white shadow-2xl" id="resume-preview">
      {templateId === "modern" && <ModernTemplate resume={resume} />}
      {templateId === "minimal" && <MinimalTemplate resume={resume} />}
      {templateId === "professional" && <ProfessionalTemplate resume={resume} />}
    </div>
  );
}
