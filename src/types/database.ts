// Database types for Supabase tables
// These are used until auto-generated types sync after migrations

export type AppRole = 'admin' | 'manager' | 'staff' | 'author';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentSubmission {
  id: string;
  user_id: string;
  title: string;
  content: string;
  content_type: string;
  tribe: string | null;
  status: string;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentComment {
  id: string;
  content_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}
