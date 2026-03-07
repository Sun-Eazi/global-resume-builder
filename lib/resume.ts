import { supabase } from "./supabase";
import type { Resume, ResumeSection, PersonalInfo } from "@/types";

// ============================================================
// RESUME CRUD
// ============================================================

export async function getResumes(userId: string): Promise<Resume[]> {
  const { data, error } = await supabase
    .from("resumes")
    .select(`
      *,
      personal_info(*),
      resume_sections(
        *,
        section_items(*)
      )
    `)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  // Map resume_sections to sections for the frontend
  return (data || []).map((r: any) => ({
    ...r,
    sections: r.resume_sections,
    resume_sections: undefined
  })) as unknown as Resume[];
}

export async function getResumeById(id: string): Promise<Resume | null> {
  const { data, error } = await supabase
    .from("resumes")
    .select(`
      *,
      personal_info(*),
      resume_sections(
        *,
        section_items(*)
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) return null;

  // Map resume_sections to sections
  return {
    ...data,
    sections: (data as any).resume_sections,
    resume_sections: undefined
  } as unknown as Resume;
}

export async function getResumeBySlug(slug: string): Promise<Resume | null> {
  const { data, error } = await supabase
    .from("resumes")
    .select(`
      *,
      personal_info(*),
      resume_sections(
        *,
        section_items(*)
      )
    `)
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (error || !data) return null;

  // Map resume_sections to sections
  return {
    ...data,
    sections: (data as any).resume_sections,
    resume_sections: undefined
  } as unknown as Resume;
}

export async function createResume(
  userId: string,
  title: string = "My Resume",
  templateId: string = "modern"
): Promise<Resume> {
  // Generate slug
  const slugBase = title.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  const slug = `${slugBase}-${userId.slice(0, 8)}-${Date.now()}`;

  const { data: resume, error } = await supabase
    .from("resumes")
    .insert({
      user_id: userId,
      title,
      template_id: templateId,
      slug,
      is_public: false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const newResume: Resume = {
    ...resume,
    sections: [],
  } as unknown as Resume;

  // Create default personal info
  await supabase.from("personal_info").insert({
    resume_id: (resume as any).id,
    full_name: "",
    email: "",
  });

  // Create default sections
  const defaultSections = [
    { type: "experience", title: "Work Experience", position: 0 },
    { type: "education", title: "Education", position: 1 },
    { type: "skills", title: "Skills", position: 2 },
    { type: "projects", title: "Projects", position: 3 },
  ];

  await supabase.from("resume_sections").insert(
    defaultSections.map((s) => ({ ...s, resume_id: (resume as any).id }))
  );

  // We just return the created resume base shell
  return newResume;
}

export async function updateResume(
  id: string,
  updates: Partial<Resume>
): Promise<Resume> {
  const { data, error } = await supabase
    .from("resumes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as Resume;
}

export async function deleteResume(id: string): Promise<void> {
  const { error } = await supabase.from("resumes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function duplicateResume(resumeId: string, userId: string): Promise<Resume> {
  const original = await getResumeById(resumeId);
  if (!original) throw new Error("Resume not found");

  const newResume = await createResume(userId, `${original.title} (Copy)`, original.template_id);

  // Copy personal info
  if (original.personal_info) {
    const { id: _id, resume_id: _rid, ...piData } = original.personal_info as any;
    await supabase.from("personal_info").update(piData).eq("resume_id", newResume.id);
  }

  // Copy sections and items
  if (original.sections && original.sections.length > 0) {
    for (const section of original.sections) {
      const { data: newSection } = await supabase
        .from("resume_sections")
        .insert({
          resume_id: newResume.id,
          type: section.type,
          title: section.title,
          position: section.position,
          is_visible: section.is_visible,
        })
        .select()
        .single();

      if (newSection && section.items) {
        for (const item of section.items) {
          await supabase.from("section_items").insert({
            section_id: (newSection as any).id,
            position: item.position,
            data: item.data as any,
          });
        }
      }
    }
  }

  return newResume;
}

// ============================================================
// PERSONAL INFO
// ============================================================

export async function updatePersonalInfo(
  resumeId: string,
  data: Partial<PersonalInfo>
): Promise<PersonalInfo> {
  const { data: result, error } = await supabase
    .from("personal_info")
    .upsert({ ...data, resume_id: resumeId } as any, { onConflict: "resume_id" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return result as unknown as PersonalInfo;
}

// ============================================================
// SECTIONS
// ============================================================

export async function addSection(
  resumeId: string,
  type: string,
  title: string
): Promise<ResumeSection> {
  const { data: existingSections } = await supabase
    .from("resume_sections")
    .select("position")
    .eq("resume_id", resumeId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existingSections?.[0]?.position !== undefined
    ? existingSections[0].position + 1
    : 0;

  const { data, error } = await supabase
    .from("resume_sections")
    .insert({ resume_id: resumeId, type, title, position: nextPosition })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as ResumeSection;
}

export async function updateSection(
  sectionId: string,
  updates: Partial<ResumeSection>
): Promise<void> {
  const { error } = await supabase
    .from("resume_sections")
    .update(updates)
    .eq("id", sectionId);

  if (error) throw new Error(error.message);
}

export async function deleteSection(sectionId: string): Promise<void> {
  const { error } = await supabase.from("resume_sections").delete().eq("id", sectionId);
  if (error) throw new Error(error.message);
}

export async function addSectionItem(sectionId: string, data: object): Promise<void> {
  const { data: existingItems } = await supabase
    .from("section_items")
    .select("position")
    .eq("section_id", sectionId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existingItems?.[0]?.position !== undefined
    ? existingItems[0].position + 1
    : 0;

  const { error } = await supabase.from("section_items").insert({
    section_id: sectionId,
    position: nextPosition,
    data: data as any,
  });

  if (error) throw new Error(error.message);
}

export async function updateSectionItem(itemId: string, data: object): Promise<void> {
  const { error } = await supabase
    .from("section_items")
    .update({ data: data as any })
    .eq("id", itemId);

  if (error) throw new Error(error.message);
}

export async function deleteSectionItem(itemId: string): Promise<void> {
  const { error } = await supabase.from("section_items").delete().eq("id", itemId);
  if (error) throw new Error(error.message);
}
