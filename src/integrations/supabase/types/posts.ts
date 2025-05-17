
import { Database } from "@/integrations/supabase/types";

export interface Post {
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

// Extend the existing Database interface to include the posts table
declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
        posts: {
          Row: Post;
          Insert: PostInsert;
          Update: Partial<PostInsert>;
        };
      } & Database['public']['Tables']
    }
  }
}
