import { User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type UserSettings = {
  user_id: string;
  notifications: {
    email: boolean;
    appointments: boolean;
    marketing: boolean;
  };
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
  };
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  author?: Profile;
};

export type BlogComment = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
};

export type DemoRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  industry: string;
  companySize: string;
  message: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      appointments: {
        Row: Appointment;
        Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Appointment, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      user_settings: {
        Row: UserSettings;
        Insert: Omit<UserSettings, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserSettings, 'user_id' | 'created_at' | 'updated_at'>>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BlogPost, 'id' | 'author_id' | 'created_at' | 'updated_at'>>;
      };
      blog_comments: {
        Row: BlogComment;
        Insert: Omit<BlogComment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BlogComment, 'id' | 'post_id' | 'author_id' | 'created_at' | 'updated_at'>>;
      };
      demo_requests: {
        Row: DemoRequest;
        Insert: Omit<DemoRequest, 'id' | 'status' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DemoRequest, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};