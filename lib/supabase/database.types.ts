/**
 * Database types. Hand-written until the Supabase project exists; then
 * `npm run db:types` replaces this file with the generated version.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        {
          user_id: string;
          birth_month: string | null;
          guardian_consent_at: string | null;
          plan: string;
          created_at: string;
          updated_at: string;
        },
        {
          user_id: string;
          birth_month?: string | null;
          guardian_consent_at?: string | null;
          plan?: string;
          created_at?: string;
          updated_at?: string;
        }
      >;
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
