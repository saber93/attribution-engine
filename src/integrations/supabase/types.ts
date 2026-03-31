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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          actor_user_id: string | null
          campaign_id: string | null
          company_id: string | null
          contact_id: string | null
          created_at: string
          deal_id: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          lead_id: string | null
          occurred_at: string
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          updated_at: string
        }
        Insert: {
          actor_user_id?: string | null
          campaign_id?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          lead_id?: string | null
          occurred_at?: string
          title: string
          type: Database["public"]["Enums"]["activity_type"]
          updated_at?: string
        }
        Update: {
          actor_user_id?: string | null
          campaign_id?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          lead_id?: string | null
          occurred_at?: string
          title?: string
          type?: Database["public"]["Enums"]["activity_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          clicks: number
          created_at: string
          currency: string
          daily_budget: number | null
          end_date: string | null
          external_campaign_id: string | null
          id: string
          impressions: number
          metadata: Json
          name: string
          objective: string | null
          owner_user_id: string | null
          platform: Database["public"]["Enums"]["ad_platform"]
          spend_amount: number
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          total_budget: number | null
          updated_at: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          currency?: string
          daily_budget?: number | null
          end_date?: string | null
          external_campaign_id?: string | null
          id?: string
          impressions?: number
          metadata?: Json
          name: string
          objective?: string | null
          owner_user_id?: string | null
          platform: Database["public"]["Enums"]["ad_platform"]
          spend_amount?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          total_budget?: number | null
          updated_at?: string
        }
        Update: {
          clicks?: number
          created_at?: string
          currency?: string
          daily_budget?: number | null
          end_date?: string | null
          external_campaign_id?: string | null
          id?: string
          impressions?: number
          metadata?: Json
          name?: string
          objective?: string | null
          owner_user_id?: string | null
          platform?: Database["public"]["Enums"]["ad_platform"]
          spend_amount?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          total_budget?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          industry: string | null
          name: string
          owner_user_id: string | null
          size_band: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          industry?: string | null
          name: string
          owner_user_id?: string | null
          size_band?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          industry?: string | null
          name?: string
          owner_user_id?: string | null
          size_band?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company_id: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          job_title: string | null
          lifecycle_stage: Database["public"]["Enums"]["contact_lifecycle_stage"]
          owner_user_id: string | null
          phone: string | null
          source_lead_id: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          job_title?: string | null
          lifecycle_stage?: Database["public"]["Enums"]["contact_lifecycle_stage"]
          owner_user_id?: string | null
          phone?: string | null
          source_lead_id?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          job_title?: string | null
          lifecycle_stage?: Database["public"]["Enums"]["contact_lifecycle_stage"]
          owner_user_id?: string | null
          phone?: string | null
          source_lead_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_source_lead_id_fkey"
            columns: ["source_lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          ad_group_id: string | null
          ad_id: string | null
          amount: number
          campaign_id: string | null
          closed_at: string | null
          company_id: string
          created_at: string
          currency: string
          expected_close_date: string | null
          external_click_id: string | null
          fbclid: string | null
          gclid: string | null
          id: string
          landing_page_url: string | null
          lost_at: string | null
          lost_reason: string | null
          metadata: Json
          other_click_ids: Json
          owner_user_id: string | null
          platform: Database["public"]["Enums"]["ad_platform"] | null
          primary_contact_id: string | null
          probability: number | null
          source: string | null
          source_lead_id: string | null
          stage: Database["public"]["Enums"]["deal_stage"]
          stage_changed_at: string
          title: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          won_at: string | null
        }
        Insert: {
          ad_group_id?: string | null
          ad_id?: string | null
          amount?: number
          campaign_id?: string | null
          closed_at?: string | null
          company_id: string
          created_at?: string
          currency?: string
          expected_close_date?: string | null
          external_click_id?: string | null
          fbclid?: string | null
          gclid?: string | null
          id?: string
          landing_page_url?: string | null
          lost_at?: string | null
          lost_reason?: string | null
          metadata?: Json
          other_click_ids?: Json
          owner_user_id?: string | null
          platform?: Database["public"]["Enums"]["ad_platform"] | null
          primary_contact_id?: string | null
          probability?: number | null
          source?: string | null
          source_lead_id?: string | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          stage_changed_at?: string
          title: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          won_at?: string | null
        }
        Update: {
          ad_group_id?: string | null
          ad_id?: string | null
          amount?: number
          campaign_id?: string | null
          closed_at?: string | null
          company_id?: string
          created_at?: string
          currency?: string
          expected_close_date?: string | null
          external_click_id?: string | null
          fbclid?: string | null
          gclid?: string | null
          id?: string
          landing_page_url?: string | null
          lost_at?: string | null
          lost_reason?: string | null
          metadata?: Json
          other_click_ids?: Json
          owner_user_id?: string | null
          platform?: Database["public"]["Enums"]["ad_platform"] | null
          primary_contact_id?: string | null
          probability?: number | null
          source?: string | null
          source_lead_id?: string | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          stage_changed_at?: string
          title?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          won_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_primary_contact_id_fkey"
            columns: ["primary_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_source_lead_id_fkey"
            columns: ["source_lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          ad_group_id: string | null
          ad_id: string | null
          campaign_id: string | null
          company_id: string | null
          converted_at: string | null
          converted_contact_id: string | null
          created_at: string
          disqualification_reason: string | null
          disqualified_at: string | null
          email: string | null
          external_click_id: string | null
          fbclid: string | null
          full_name: string
          gclid: string | null
          id: string
          landing_page_url: string | null
          metadata: Json
          other_click_ids: Json
          owner_user_id: string | null
          phone: string | null
          platform: Database["public"]["Enums"]["ad_platform"] | null
          qualified_at: string | null
          score: number | null
          source: string
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          ad_group_id?: string | null
          ad_id?: string | null
          campaign_id?: string | null
          company_id?: string | null
          converted_at?: string | null
          converted_contact_id?: string | null
          created_at?: string
          disqualification_reason?: string | null
          disqualified_at?: string | null
          email?: string | null
          external_click_id?: string | null
          fbclid?: string | null
          full_name: string
          gclid?: string | null
          id?: string
          landing_page_url?: string | null
          metadata?: Json
          other_click_ids?: Json
          owner_user_id?: string | null
          phone?: string | null
          platform?: Database["public"]["Enums"]["ad_platform"] | null
          qualified_at?: string | null
          score?: number | null
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          ad_group_id?: string | null
          ad_id?: string | null
          campaign_id?: string | null
          company_id?: string | null
          converted_at?: string | null
          converted_contact_id?: string | null
          created_at?: string
          disqualification_reason?: string | null
          disqualified_at?: string | null
          email?: string | null
          external_click_id?: string | null
          fbclid?: string | null
          full_name?: string
          gclid?: string | null
          id?: string
          landing_page_url?: string | null
          metadata?: Json
          other_click_ids?: Json
          owner_user_id?: string | null
          phone?: string | null
          platform?: Database["public"]["Enums"]["ad_platform"] | null
          qualified_at?: string | null
          score?: number | null
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_contact_id_fkey"
            columns: ["converted_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_user_id: string | null
          campaign_id: string | null
          company_id: string | null
          completed_at: string | null
          contact_id: string | null
          created_at: string
          created_by_user_id: string | null
          deal_id: string | null
          description: string | null
          due_at: string | null
          id: string
          lead_id: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          type: Database["public"]["Enums"]["task_type"]
          updated_at: string
        }
        Insert: {
          assigned_user_id?: string | null
          campaign_id?: string | null
          company_id?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          deal_id?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Update: {
          assigned_user_id?: string | null
          campaign_id?: string | null
          company_id?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          deal_id?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type:
        | "call"
        | "email"
        | "whatsapp"
        | "meeting"
        | "note"
        | "system"
      ad_platform:
        | "google"
        | "meta"
        | "tiktok"
        | "linkedin"
        | "snapchat"
        | "other"
      campaign_status: "draft" | "active" | "paused" | "completed" | "archived"
      contact_lifecycle_stage:
        | "lead"
        | "marketing_qualified"
        | "sales_qualified"
        | "opportunity"
        | "customer"
        | "inactive"
      deal_stage:
        | "new"
        | "contacted"
        | "qualified"
        | "proposal"
        | "negotiation"
        | "won"
        | "lost"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "unqualified"
        | "converted"
        | "lost"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "pending" | "in_progress" | "completed" | "canceled"
      task_type:
        | "call"
        | "follow_up"
        | "meeting"
        | "email"
        | "whatsapp"
        | "review"
        | "other"
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
      activity_type: ["call", "email", "whatsapp", "meeting", "note", "system"],
      ad_platform: [
        "google",
        "meta",
        "tiktok",
        "linkedin",
        "snapchat",
        "other",
      ],
      campaign_status: ["draft", "active", "paused", "completed", "archived"],
      contact_lifecycle_stage: [
        "lead",
        "marketing_qualified",
        "sales_qualified",
        "opportunity",
        "customer",
        "inactive",
      ],
      deal_stage: [
        "new",
        "contacted",
        "qualified",
        "proposal",
        "negotiation",
        "won",
        "lost",
      ],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "unqualified",
        "converted",
        "lost",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["pending", "in_progress", "completed", "canceled"],
      task_type: [
        "call",
        "follow_up",
        "meeting",
        "email",
        "whatsapp",
        "review",
        "other",
      ],
    },
  },
} as const
