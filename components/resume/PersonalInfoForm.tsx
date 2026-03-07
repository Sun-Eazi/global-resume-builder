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

  return (
    <>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            value={(form.full_name as string) || ""}
            onChange={(e) => update("full_name", e.target.value)}
            placeholder="Jane Doe"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Job Title</label>
          <input
            type="text"
            className="form-input"
            value={(form.job_title as string) || ""}
            onChange={(e) => update("job_title", e.target.value)}
            placeholder="e.g. Software Engineer"
          />
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={(form.email as string) || ""}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jane@example.com"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-input"
            value={(form.phone as string) || ""}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 555 0100"
          />
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-input"
            value={(form.location as string) || ""}
            onChange={(e) => update("location", e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>
        <div className="form-group">
          <label className="form-label">LinkedIn</label>
          <input
            type="text"
            className="form-input"
            value={(form.linkedin as string) || ""}
            onChange={(e) => update("linkedin", e.target.value)}
            placeholder="linkedin.com/in/jane"
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Website</label>
        <input
          type="text"
          className="form-input"
          value={(form.website as string) || ""}
          onChange={(e) => update("website", e.target.value)}
          placeholder="https://janedoe.com"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Professional Summary</label>
        <textarea
          className="form-input form-textarea"
          rows={4}
          value={(form.summary as string) || ""}
          onChange={(e) => update("summary", e.target.value)}
          placeholder="Full-stack engineer with 6+ years building scalable SaaS products. Passionate about clean code and great UX."
        />
      </div>
    </>
  );
}
