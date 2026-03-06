"use client";

import { useState, useEffect } from "react";
import type { PersonalInfo } from "@/types";

interface PersonalInfoFormProps {
  resumeId: string;
  data?: PersonalInfo;
  onChange: (info: PersonalInfo) => void;
}

export default function PersonalInfoForm({ resumeId, data, onChange }: PersonalInfoFormProps) {
  const [form, setForm] = useState<Partial<PersonalInfo>>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    job_title: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
    ...data,
  });

  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);

  const update = (field: keyof PersonalInfo, value: string) => {
    const updated = { ...form, [field]: value, resume_id: resumeId } as PersonalInfo;
    setForm(updated);
    onChange(updated);
  };

  const fields: { key: keyof PersonalInfo; label: string; placeholder: string; type?: string }[] = [
    { key: "full_name", label: "Full Name", placeholder: "John Doe" },
    { key: "job_title", label: "Job Title / Headline", placeholder: "Senior Software Engineer" },
    { key: "email", label: "Email", placeholder: "john@example.com", type: "email" },
    { key: "phone", label: "Phone", placeholder: "+1 (555) 000-0000", type: "tel" },
    { key: "location", label: "Location", placeholder: "New York, NY" },
    { key: "website", label: "Website", placeholder: "https://johndoe.com" },
    { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/johndoe" },
    { key: "github", label: "GitHub", placeholder: "github.com/johndoe" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
          Personal Information
        </h2>
        <p className="text-xs text-gray-500">This will appear at the top of your resume</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key} className={f.key === "full_name" || f.key === "job_title" ? "sm:col-span-2" : ""}>
            <label className="label">{f.label}</label>
            <input
              type={f.type || "text"}
              value={(form[f.key] as string) || ""}
              onChange={(e) => update(f.key, e.target.value)}
              className="input"
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>

      {/* Summary */}
      <div>
        <label className="label">Professional Summary</label>
        <textarea
          value={form.summary || ""}
          onChange={(e) => update("summary", e.target.value)}
          className="input resize-none"
          rows={4}
          placeholder="A results-driven engineer with 5+ years of experience building scalable web applications..."
        />
        <p className="text-xs text-gray-600 mt-1.5">
          {(form.summary || "").length}/500 characters
        </p>
      </div>
    </div>
  );
}
