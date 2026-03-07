"use client";

import type { TemplateId } from "@/types";

interface TemplateSelectorProps {
  selected: TemplateId;
  onChange: (id: TemplateId) => void;
}

export default function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <>
      <div
        className={`tmpl-option ${selected === "modern" ? "active" : ""}`}
        onClick={() => onChange("modern")}
      >
        <div className="tmpl-icon" style={{ background: "rgba(10,132,255,.15)", border: "1px solid rgba(10,132,255,.3)" }}>📄</div>
        <div>
          <div className="tmpl-name">Modern</div>
          <div className="tmpl-desc">Two-column, bold accents</div>
        </div>
        {selected === "modern" && <span className="tmpl-check">✓</span>}
      </div>

      <div
        className={`tmpl-option ${selected === "minimal" ? "active" : ""}`}
        onClick={() => onChange("minimal")}
      >
        <div className="tmpl-icon" style={{ background: "rgba(139,148,158,.15)", border: "1px solid rgba(139,148,158,.3)" }}>📄</div>
        <div>
          <div className="tmpl-name">Minimal</div>
          <div className="tmpl-desc">Single-column, typographic</div>
        </div>
        {selected === "minimal" && <span className="tmpl-check">✓</span>}
      </div>

      <div
        className={`tmpl-option ${selected === "professional" ? "active" : ""}`}
        onClick={() => onChange("professional")}
      >
        <div className="tmpl-icon" style={{ background: "rgba(255,107,53,.15)", border: "1px solid rgba(255,107,53,.3)" }}>📄</div>
        <div>
          <div className="tmpl-name">Professional</div>
          <div className="tmpl-desc">Classic corporate format</div>
        </div>
        {selected === "professional" && <span className="tmpl-check">✓</span>}
      </div>
    </>
  );
}
