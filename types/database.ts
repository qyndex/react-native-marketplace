/** Auto-generated Supabase types — regenerate with `npx supabase gen types typescript` */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          bio: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string;
          created_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          seller_id: string;
          title: string;
          description: string;
          price: number;
          category: string;
          image_urls: string[];
          status: 'active' | 'sold' | 'draft' | 'archived';
          created_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          title: string;
          description?: string;
          price: number;
          category?: string;
          image_urls?: string[];
          status?: 'active' | 'sold' | 'draft' | 'archived';
          created_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          title?: string;
          description?: string;
          price?: number;
          category?: string;
          image_urls?: string[];
          status?: 'active' | 'sold' | 'draft' | 'archived';
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          listing_id: string | null;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          listing_id?: string | null;
          content: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          listing_id?: string | null;
          content?: string;
          read?: boolean;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          listing_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          listing_id?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
