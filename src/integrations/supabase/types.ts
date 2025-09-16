export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      affiliate_assignments: {
        Row: {
          affiliate_id: string | null
          affiliate_link: string
          created_at: string | null
          id: string
          offer_id: string | null
        }
        Insert: {
          affiliate_id?: string | null
          affiliate_link: string
          created_at?: string | null
          id?: string
          offer_id?: string | null
        }
        Update: {
          affiliate_id?: string | null
          affiliate_link?: string
          created_at?: string | null
          id?: string
          offer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_assignments_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_assignments_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "affiliate_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_offers: {
        Row: {
          business_id: string | null
          commission_rate: number
          commission_type: Database["public"]["Enums"]["commission_type"]
          conversion_pixel_code: string | null
          cookie_duration_days: number | null
          created_at: string | null
          description: string | null
          id: string
          status: Database["public"]["Enums"]["offer_status"] | null
          target_url: string
          title: string
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          business_id?: string | null
          commission_rate: number
          commission_type: Database["public"]["Enums"]["commission_type"]
          conversion_pixel_code?: string | null
          cookie_duration_days?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["offer_status"] | null
          target_url: string
          title: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          business_id?: string | null
          commission_rate?: number
          commission_type?: Database["public"]["Enums"]["commission_type"]
          conversion_pixel_code?: string | null
          cookie_duration_days?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["offer_status"] | null
          target_url?: string
          title?: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_offers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_pixels: {
        Row: {
          assignment_id: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          assignment_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          assignment_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_pixels_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "affiliate_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          business_id: string
          created_at: string
          creator_id: string
          id: string
          message: string | null
          offer_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          creator_id: string
          id?: string
          message?: string | null
          offer_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          creator_id?: string
          id?: string
          message?: string | null
          offer_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "affiliate_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          participant_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          participant_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          participant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_rooms_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      click_tracking: {
        Row: {
          assignment_id: string | null
          clicked_at: string | null
          country: string | null
          device_type: string | null
          id: string
          ip_address: unknown | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          assignment_id?: string | null
          clicked_at?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          assignment_id?: string | null
          clicked_at?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "click_tracking_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "affiliate_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_styles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      conversion_tracking: {
        Row: {
          assignment_id: string | null
          commission_amount: number | null
          converted_at: string | null
          id: string
          sale_amount: number | null
        }
        Insert: {
          assignment_id?: string | null
          commission_amount?: number | null
          converted_at?: string | null
          id?: string
          sale_amount?: number | null
        }
        Update: {
          assignment_id?: string | null
          commission_amount?: number | null
          converted_at?: string | null
          id?: string
          sale_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversion_tracking_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "affiliate_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_videos: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          sales_rep_id: string | null
          thumbnail_url: string | null
          title: string
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          sales_rep_id?: string | null
          thumbnail_url?: string | null
          title: string
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          sales_rep_id?: string | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_videos_sales_rep_id_fkey"
            columns: ["sales_rep_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      file_comments: {
        Row: {
          comment: string
          created_at: string
          file_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          file_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          file_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_comments_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "workspace_files"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          created_at: string | null
          file_url: string | null
          id: string
          message_type: Database["public"]["Enums"]["message_type"] | null
          room_id: string | null
          sender_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          message_type?: Database["public"]["Enums"]["message_type"] | null
          room_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          message_type?: Database["public"]["Enums"]["message_type"] | null
          room_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: string
          is_approved: boolean | null
          media_type: string | null
          media_url: string
          title: string
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_approved?: boolean | null
          media_type?: string | null
          media_url: string
          title: string
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_approved?: boolean | null
          media_type?: string | null
          media_url?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company_logo_url: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          industry: string | null
          industry_focus: string | null
          last_name: string | null
          portfolio_links: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          sales_experience: string | null
          specializations: string[] | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          industry?: string | null
          industry_focus?: string | null
          last_name?: string | null
          portfolio_links?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          sales_experience?: string | null
          specializations?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          industry?: string | null
          industry_focus?: string | null
          last_name?: string | null
          portfolio_links?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          sales_experience?: string | null
          specializations?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      project_content_styles: {
        Row: {
          content_style_id: string | null
          created_at: string
          id: string
          workspace_id: string | null
        }
        Insert: {
          content_style_id?: string | null
          created_at?: string
          id?: string
          workspace_id?: string | null
        }
        Update: {
          content_style_id?: string | null
          created_at?: string
          id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_content_styles_content_style_id_fkey"
            columns: ["content_style_id"]
            isOneToOne: false
            referencedRelation: "content_styles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_content_styles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "project_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      project_workspaces: {
        Row: {
          affiliate_id: string | null
          business_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          offer_id: string | null
        }
        Insert: {
          affiliate_id?: string | null
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          offer_id?: string | null
        }
        Update: {
          affiliate_id?: string | null
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          offer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_workspaces_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_workspaces_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_workspaces_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "affiliate_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_files: {
        Row: {
          feedback: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          reviewed_at: string | null
          status: Database["public"]["Enums"]["file_status"] | null
          uploaded_at: string | null
          uploaded_by: string | null
          workspace_id: string | null
        }
        Insert: {
          feedback?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["file_status"] | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          workspace_id?: string | null
        }
        Update: {
          feedback?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["file_status"] | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_files_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "project_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_permissions: {
        Row: {
          created_at: string
          id: string
          permission_level: string | null
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          permission_level?: string | null
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          permission_level?: string | null
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_permissions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "project_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      track_affiliate_pixel: {
        Args: {
          p_assignment_id: string
          p_event_data?: Json
          p_event_type?: string
          p_session_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      commission_type: "percentage" | "flat_fee"
      file_status: "pending" | "approved" | "revision_requested"
      message_type: "text" | "file" | "system"
      offer_status: "active" | "paused" | "inactive"
      user_role: "business" | "content_creator" | "sales_representative"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      commission_type: ["percentage", "flat_fee"],
      file_status: ["pending", "approved", "revision_requested"],
      message_type: ["text", "file", "system"],
      offer_status: ["active", "paused", "inactive"],
      user_role: ["business", "content_creator", "sales_representative"],
    },
  },
} as const
