export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    username: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    username?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    username?: string | null;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            };
            resumes: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    slug: string;
                    template_id: string;
                    is_public: boolean;
                    thumbnail_url: string | null;
                    view_count: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    slug: string;
                    template_id?: string;
                    is_public?: boolean;
                    thumbnail_url?: string | null;
                    view_count?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    slug?: string;
                    template_id?: string;
                    is_public?: boolean;
                    thumbnail_url?: string | null;
                    view_count?: number;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "resumes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            };
            personal_info: {
                Row: {
                    id: string;
                    resume_id: string;
                    full_name: string;
                    email: string;
                    phone: string | null;
                    location: string | null;
                    website: string | null;
                    linkedin: string | null;
                    github: string | null;
                    summary: string | null;
                    job_title: string | null;
                    avatar_url: string | null;
                };
                Insert: {
                    id?: string;
                    resume_id: string;
                    full_name: string;
                    email: string;
                    phone?: string | null;
                    location?: string | null;
                    website?: string | null;
                    linkedin?: string | null;
                    github?: string | null;
                    summary?: string | null;
                    job_title?: string | null;
                    avatar_url?: string | null;
                };
                Update: {
                    id?: string;
                    resume_id?: string;
                    full_name?: string;
                    email?: string;
                    phone?: string | null;
                    location?: string | null;
                    website?: string | null;
                    linkedin?: string | null;
                    github?: string | null;
                    summary?: string | null;
                    job_title?: string | null;
                    avatar_url?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "personal_info_resume_id_fkey"
                        columns: ["resume_id"]
                        isOneToOne: true
                        referencedRelation: "resumes"
                        referencedColumns: ["id"]
                    }
                ]
            };
            resume_sections: {
                Row: {
                    id: string;
                    resume_id: string;
                    type: string;
                    title: string;
                    position: number;
                    is_visible: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    resume_id: string;
                    type: string;
                    title: string;
                    position?: number;
                    is_visible?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    resume_id?: string;
                    type?: string;
                    title?: string;
                    position?: number;
                    is_visible?: boolean;
                };
                Relationships: [
                    {
                        foreignKeyName: "resume_sections_resume_id_fkey"
                        columns: ["resume_id"]
                        isOneToOne: false
                        referencedRelation: "resumes"
                        referencedColumns: ["id"]
                    }
                ]
            };
            section_items: {
                Row: {
                    id: string;
                    section_id: string;
                    position: number;
                    data: Json;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    section_id: string;
                    position?: number;
                    data: Json;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    section_id?: string;
                    position?: number;
                    data?: Json;
                };
                Relationships: [
                    {
                        foreignKeyName: "section_items_section_id_fkey"
                        columns: ["section_id"]
                        isOneToOne: false
                        referencedRelation: "resume_sections"
                        referencedColumns: ["id"]
                    }
                ]
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
}
