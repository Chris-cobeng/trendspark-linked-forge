
import { Tables } from "@/integrations/supabase/types";

export interface Post extends Tables<'posts'> {
  id: string;
  title: string;
  content: string;
  status: 'saved' | 'scheduled';
  scheduled_at: string | null;
  created_at: string;
  user_id?: string;
}

export interface PostInsert {
  title: string;
  content: string;
  status: 'saved' | 'scheduled';
  scheduled_at: string | null;
  user_id?: string;
}

// Make sure Tables includes "posts" type by augmenting the existing type
declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
        posts: {
          Row: Post;
          Insert: PostInsert;
          Update: Partial<PostInsert>;
        }
      }
    }
  }
}
