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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line: string
          city: string | null
          country: string | null
          created_at: string
          id: string
          is_active: boolean
          label: string | null
          lat: number | null
          lng: number | null
          postal_code: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line: string
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string | null
          lat?: number | null
          lng?: number | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line?: string
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string | null
          lat?: number | null
          lng?: number | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_impersonation_logs: {
        Row: {
          admin_user_id: number
          company_id: number | null
          created_at: string
          id: number
          reason: string
          target_user_id: number
        }
        Insert: {
          admin_user_id: number
          company_id?: number | null
          created_at?: string
          id?: number
          reason?: string
          target_user_id: number
        }
        Update: {
          admin_user_id?: number
          company_id?: number | null
          created_at?: string
          id?: number
          reason?: string
          target_user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "admin_impersonation_logs_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_impersonation_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_impersonation_logs_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      allergens: {
        Row: {
          code: string | null
          company_id: string | null
          created_at: string
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          code?: string | null
          company_id?: string | null
          created_at?: string
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string | null
          company_id?: string | null
          created_at?: string
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "allergens_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      api_v2_notifications: {
        Row: {
          body: string
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      app_permissions: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      app_role_permissions: {
        Row: {
          created_at: string
          permission_id: number
          role_id: number
        }
        Insert: {
          created_at?: string
          permission_id: number
          role_id: number
        }
        Update: {
          created_at?: string
          permission_id?: number
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "app_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "app_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "app_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_roles: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      app_user_permissions: {
        Row: {
          created_at: string
          permission_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          permission_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          permission_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "app_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_user_roles: {
        Row: {
          created_at: string
          role_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          role_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "app_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_legacy_user_id: number | null
          company_id: number | null
          created_at: string
          id: number
          new_row: Json | null
          old_row: Json | null
          record_pk: string
          table_name: string
        }
        Insert: {
          action: string
          actor_legacy_user_id?: number | null
          company_id?: number | null
          created_at?: string
          id?: number
          new_row?: Json | null
          old_row?: Json | null
          record_pk: string
          table_name: string
        }
        Update: {
          action?: string
          actor_legacy_user_id?: number | null
          company_id?: number | null
          created_at?: string
          id?: number
          new_row?: Json | null
          old_row?: Json | null
          record_pk?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_legacy_user_id_fkey"
            columns: ["actor_legacy_user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_user_map: {
        Row: {
          auth_user_id: string
          created_at: string
          legacy_user_id: number
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          legacy_user_id: number
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          legacy_user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "auth_user_map_legacy_user_id_fkey"
            columns: ["legacy_user_id"]
            isOneToOne: true
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_categories: {
        Row: {
          active: boolean
          company_id: number
          created_at: string | null
          deleted_at: string | null
          id: number
          name: string
          order_index: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          company_id: number
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          name: string
          order_index?: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          company_id?: number
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          name?: string
          order_index?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_companies: {
        Row: {
          active: boolean
          address: string
          can_deliver: boolean
          can_dinein: boolean
          can_pickup: boolean
          city_id: number | null
          cover: string
          created_at: string | null
          currency: string
          deleted_at: string | null
          description: string
          do_covertion: boolean
          fb_username: string | null
          fee: number
          free_deliver: boolean
          id: number
          is_featured: boolean
          lat: string
          lng: string
          logo: string
          minimum: string
          mollie_payment_key: string
          name: string
          payment_info: string
          phone: string
          radius: Json
          self_deliver: boolean
          static_fee: number
          subdomain: string | null
          updated_at: string | null
          user_id: number
          views: number
          whatsapp_phone: string | null
        }
        Insert: {
          active?: boolean
          address: string
          can_deliver?: boolean
          can_dinein?: boolean
          can_pickup?: boolean
          city_id?: number | null
          cover?: string
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          description?: string
          do_covertion?: boolean
          fb_username?: string | null
          fee?: number
          free_deliver?: boolean
          id?: number
          is_featured?: boolean
          lat: string
          lng: string
          logo?: string
          minimum?: string
          mollie_payment_key?: string
          name: string
          payment_info?: string
          phone: string
          radius?: Json
          self_deliver?: boolean
          static_fee?: number
          subdomain?: string | null
          updated_at?: string | null
          user_id: number
          views?: number
          whatsapp_phone?: string | null
        }
        Update: {
          active?: boolean
          address?: string
          can_deliver?: boolean
          can_dinein?: boolean
          can_pickup?: boolean
          city_id?: number | null
          cover?: string
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          description?: string
          do_covertion?: boolean
          fb_username?: string | null
          fee?: number
          free_deliver?: boolean
          id?: number
          is_featured?: boolean
          lat?: string
          lng?: string
          logo?: string
          minimum?: string
          mollie_payment_key?: string
          name?: string
          payment_info?: string
          phone?: string
          radius?: Json
          self_deliver?: boolean
          static_fee?: number
          subdomain?: string | null
          updated_at?: string | null
          user_id?: number
          views?: number
          whatsapp_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_company_areas: {
        Row: {
          company_id: number
          created_at: string | null
          deleted_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_areas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_company_hours: {
        Row: {
          company_id: number
          created_at: string | null
          friday_from: string | null
          friday_to: string | null
          id: number
          monday_from: string | null
          monday_to: string | null
          saturday_from: string | null
          saturday_to: string | null
          sunday_from: string | null
          sunday_to: string | null
          thursday_from: string | null
          thursday_to: string | null
          tuesday_from: string | null
          tuesday_to: string | null
          updated_at: string | null
          wednesday_from: string | null
          wednesday_to: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          friday_from?: string | null
          friday_to?: string | null
          id?: number
          monday_from?: string | null
          monday_to?: string | null
          saturday_from?: string | null
          saturday_to?: string | null
          sunday_from?: string | null
          sunday_to?: string | null
          thursday_from?: string | null
          thursday_to?: string | null
          tuesday_from?: string | null
          tuesday_to?: string | null
          updated_at?: string | null
          wednesday_from?: string | null
          wednesday_to?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          friday_from?: string | null
          friday_to?: string | null
          id?: number
          monday_from?: string | null
          monday_to?: string | null
          saturday_from?: string | null
          saturday_to?: string | null
          sunday_from?: string | null
          sunday_to?: string | null
          thursday_from?: string | null
          thursday_to?: string | null
          tuesday_from?: string | null
          tuesday_to?: string | null
          updated_at?: string | null
          wednesday_from?: string | null
          wednesday_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_hours_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_company_tables: {
        Row: {
          area_id: number | null
          company_id: number
          created_at: string | null
          deleted_at: string | null
          h: number | null
          id: number
          name: string
          rounded: string | null
          size: number
          updated_at: string | null
          w: number | null
          x: number | null
          y: number | null
        }
        Insert: {
          area_id?: number | null
          company_id: number
          created_at?: string | null
          deleted_at?: string | null
          h?: number | null
          id?: number
          name: string
          rounded?: string | null
          size?: number
          updated_at?: string | null
          w?: number | null
          x?: number | null
          y?: number | null
        }
        Update: {
          area_id?: number | null
          company_id?: number
          created_at?: string | null
          deleted_at?: string | null
          h?: number | null
          id?: number
          name?: string
          rounded?: string | null
          size?: number
          updated_at?: string | null
          w?: number | null
          x?: number | null
          y?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_tables_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "backup_company_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_tables_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_coupons: {
        Row: {
          active_from: string
          active_to: string
          code: string
          company_id: number
          created_at: string | null
          id: number
          limit_to_num_uses: number
          name: string
          price: number
          type: number
          updated_at: string | null
          used_count: number
        }
        Insert: {
          active_from: string
          active_to: string
          code: string
          company_id: number
          created_at?: string | null
          id?: number
          limit_to_num_uses?: number
          name: string
          price: number
          type?: number
          updated_at?: string | null
          used_count?: number
        }
        Update: {
          active_from?: string
          active_to?: string
          code?: string
          company_id?: number
          created_at?: string | null
          id?: number
          limit_to_num_uses?: number
          name?: string
          price?: number
          type?: number
          updated_at?: string | null
          used_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "coupons_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_idempotency_keys: {
        Row: {
          actor_user_id: string | null
          created_at: string
          expires_at: string | null
          key: string
          operation: string
          request_hash: string | null
          response: Json
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          expires_at?: string | null
          key: string
          operation: string
          request_hash?: string | null
          response?: Json
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          expires_at?: string | null
          key?: string
          operation?: string
          request_hash?: string | null
          response?: Json
        }
        Relationships: []
      }
      backup_item_allergens: {
        Row: {
          allergen_id: number | null
          created_at: string | null
          id: number
          item_id: number | null
          updated_at: string | null
        }
        Insert: {
          allergen_id?: number | null
          created_at?: string | null
          id?: number
          item_id?: number | null
          updated_at?: string | null
        }
        Update: {
          allergen_id?: number | null
          created_at?: string | null
          id?: number
          item_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_allergens_allergen_id_fkey"
            columns: ["allergen_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_allergens_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "backup_items"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_item_extras: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          extra_for_all_variants: boolean
          id: number
          item_id: number
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          extra_for_all_variants?: boolean
          id?: number
          item_id: number
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          extra_for_all_variants?: boolean
          id?: number
          item_id?: number
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_extras_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "backup_items"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_item_options: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: number
          item_id: number
          name: string
          options: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          item_id: number
          name: string
          options: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          item_id?: number
          name?: string
          options?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_options_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "backup_items"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_item_variants: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          enable_qty: boolean
          id: number
          image: string
          is_system: boolean
          item_id: number
          options: string
          price: number
          qty: number
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          enable_qty?: boolean
          id?: number
          image?: string
          is_system?: boolean
          item_id: number
          options: string
          price: number
          qty?: number
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          enable_qty?: boolean
          id?: number
          image?: string
          is_system?: boolean
          item_id?: number
          options?: string
          price?: number
          qty?: number
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_variants_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "backup_items"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_items: {
        Row: {
          available: boolean
          category_id: number
          created_at: string | null
          deleted_at: string | null
          description: string
          discounted_price: number
          enable_system_variants: boolean
          has_variants: boolean
          id: number
          image: string
          name: string
          order_index: number
          price: number
          qty: number
          qty_management: boolean
          updated_at: string | null
          vat: number | null
        }
        Insert: {
          available?: boolean
          category_id: number
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          discounted_price?: number
          enable_system_variants?: boolean
          has_variants?: boolean
          id?: number
          image?: string
          name: string
          order_index?: number
          price?: number
          qty?: number
          qty_management?: boolean
          updated_at?: string | null
          vat?: number | null
        }
        Update: {
          available?: boolean
          category_id?: number
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          discounted_price?: number
          enable_system_variants?: boolean
          has_variants?: boolean
          id?: number
          image?: string
          name?: string
          order_index?: number
          price?: number
          qty?: number
          qty_management?: boolean
          updated_at?: string | null
          vat?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "backup_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories_legacy_view"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_job_outbox: {
        Row: {
          aggregate_id: string | null
          aggregate_type: string
          attempt_count: number
          created_at: string
          event_type: string
          id: string
          last_error: string | null
          payload: Json
          run_after: string
          status: string
          updated_at: string
        }
        Insert: {
          aggregate_id?: string | null
          aggregate_type: string
          attempt_count?: number
          created_at?: string
          event_type: string
          id?: string
          last_error?: string | null
          payload?: Json
          run_after?: string
          status?: string
          updated_at?: string
        }
        Update: {
          aggregate_id?: string | null
          aggregate_type?: string
          attempt_count?: number
          created_at?: string
          event_type?: string
          id?: string
          last_error?: string | null
          payload?: Json
          run_after?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      backup_order_items: {
        Row: {
          created_at: string | null
          extras_json: Json | null
          extras_raw: string | null
          id: number
          item_id: number
          kds_finished: boolean
          order_id: number
          qty: number
          updated_at: string | null
          variant_name: string
          variant_price: number | null
          vat: number | null
          vatvalue: number | null
        }
        Insert: {
          created_at?: string | null
          extras_json?: Json | null
          extras_raw?: string | null
          id?: number
          item_id: number
          kds_finished?: boolean
          order_id: number
          qty?: number
          updated_at?: string | null
          variant_name?: string
          variant_price?: number | null
          vat?: number | null
          vatvalue?: number | null
        }
        Update: {
          created_at?: string | null
          extras_json?: Json | null
          extras_raw?: string | null
          id?: number
          item_id?: number
          kds_finished?: boolean
          order_id?: number
          qty?: number
          updated_at?: string | null
          variant_name?: string
          variant_price?: number | null
          vat?: number | null
          vatvalue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "backup_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "backup_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_company_view"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_order_status_history: {
        Row: {
          comment: string
          created_at: string | null
          id: number
          order_id: number
          status_id: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          comment?: string
          created_at?: string | null
          id?: number
          order_id: number
          status_id: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: number
          order_id?: number
          status_id?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "backup_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_company_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "backup_order_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_order_statuses: {
        Row: {
          alias: string
          id: number
          name: string
        }
        Insert: {
          alias: string
          id?: number
          name: string
        }
        Update: {
          alias?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      backup_orders: {
        Row: {
          address_id: number | null
          client_id: number | null
          comment: string
          coupon: string | null
          created_at: string | null
          deleted_at: string | null
          delivery_method: number
          delivery_pickup_interval: string
          delivery_price: number
          discount: number
          driver_id: number | null
          employee_id: number | null
          fee: number
          fee_value: number
          id: number
          id_per_vendor: string | null
          kds_finished: boolean
          lat: string | null
          lng: string | null
          md: string
          order_price: number
          payment_link: string
          payment_method: string | null
          payment_processor_fee: number
          payment_status: string | null
          phone: string | null
          restorant_id: number
          static_fee: number
          stripe_payment_id: string | null
          table_id: number | null
          time_to_prepare: number | null
          tip: number
          updated_at: string | null
          vatvalue: number | null
          whatsapp_address: string | null
        }
        Insert: {
          address_id?: number | null
          client_id?: number | null
          comment?: string
          coupon?: string | null
          created_at?: string | null
          deleted_at?: string | null
          delivery_method?: number
          delivery_pickup_interval?: string
          delivery_price?: number
          discount?: number
          driver_id?: number | null
          employee_id?: number | null
          fee?: number
          fee_value?: number
          id?: number
          id_per_vendor?: string | null
          kds_finished?: boolean
          lat?: string | null
          lng?: string | null
          md?: string
          order_price?: number
          payment_link?: string
          payment_method?: string | null
          payment_processor_fee?: number
          payment_status?: string | null
          phone?: string | null
          restorant_id: number
          static_fee?: number
          stripe_payment_id?: string | null
          table_id?: number | null
          time_to_prepare?: number | null
          tip?: number
          updated_at?: string | null
          vatvalue?: number | null
          whatsapp_address?: string | null
        }
        Update: {
          address_id?: number | null
          client_id?: number | null
          comment?: string
          coupon?: string | null
          created_at?: string | null
          deleted_at?: string | null
          delivery_method?: number
          delivery_pickup_interval?: string
          delivery_price?: number
          discount?: number
          driver_id?: number | null
          employee_id?: number | null
          fee?: number
          fee_value?: number
          id?: number
          id_per_vendor?: string | null
          kds_finished?: boolean
          lat?: string | null
          lng?: string | null
          md?: string
          order_price?: number
          payment_link?: string
          payment_method?: string | null
          payment_processor_fee?: number
          payment_status?: string | null
          phone?: string | null
          restorant_id?: number
          static_fee?: number
          stripe_payment_id?: string | null
          table_id?: number | null
          time_to_prepare?: number | null
          tip?: number
          updated_at?: string | null
          vatvalue?: number | null
          whatsapp_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restorant_id_fkey"
            columns: ["restorant_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "backup_company_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_payment_attempts: {
        Row: {
          amount: number
          company_id: number
          created_at: string
          currency: string
          error_message: string | null
          id: number
          order_id: number
          payload: Json
          provider: string
          provider_payment_id: string | null
          redirect_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          company_id: number
          created_at?: string
          currency?: string
          error_message?: string | null
          id?: number
          order_id: number
          payload?: Json
          provider: string
          provider_payment_id?: string | null
          redirect_url?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          company_id?: number
          created_at?: string
          currency?: string
          error_message?: string | null
          id?: number
          order_id?: number
          payload?: Json
          provider?: string
          provider_payment_id?: string | null
          redirect_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_attempts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_attempts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "backup_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_attempts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_company_view"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_profiles: {
        Row: {
          auth_user_id: string
          avatar_url: string | null
          created_at: string
          display_name: string
          legacy_user_id: number | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          legacy_user_id?: number | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          legacy_user_id?: number | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_legacy_user_id_fkey"
            columns: ["legacy_user_id"]
            isOneToOne: true
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_system_settings: {
        Row: {
          created_at: string
          description: string
          id: number
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string
          id?: number
          is_public?: boolean
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      backup_table_visits: {
        Row: {
          company_id: number
          created_at: string | null
          created_by_owner: boolean
          deleted_at: string | null
          email: string | null
          id: number
          name: string
          note: string | null
          phone_number: string | null
          table_id: number | null
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          created_by_owner?: boolean
          deleted_at?: string | null
          email?: string | null
          id?: number
          name: string
          note?: string | null
          phone_number?: string | null
          table_id?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          created_by_owner?: boolean
          deleted_at?: string | null
          email?: string | null
          id?: number
          name?: string
          note?: string | null
          phone_number?: string | null
          table_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_visits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_visits_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "backup_company_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_variant_extras: {
        Row: {
          created_at: string | null
          extra_id: number
          id: number
          updated_at: string | null
          variant_id: number
        }
        Insert: {
          created_at?: string | null
          extra_id: number
          id?: number
          updated_at?: string | null
          variant_id: number
        }
        Update: {
          created_at?: string | null
          extra_id?: number
          id?: number
          updated_at?: string | null
          variant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "variant_extras_extra_id_fkey"
            columns: ["extra_id"]
            isOneToOne: false
            referencedRelation: "backup_item_extras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_extras_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "backup_item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          active_from: string
          active_to: string
          company_id: number | null
          created_at: string | null
          id: number
          img: string
          name: string
          page_id: number | null
          type: number
          updated_at: string | null
        }
        Insert: {
          active_from: string
          active_to: string
          company_id?: number | null
          created_at?: string | null
          id?: number
          img?: string
          name: string
          page_id?: number | null
          type?: number
          updated_at?: string | null
        }
        Update: {
          active_from?: string
          active_to?: string
          company_id?: number | null
          created_at?: string | null
          id?: number
          img?: string
          name?: string
          page_id?: number | null
          type?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banners_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "banners_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      call_waiter_events: {
        Row: {
          company_id: number
          created_at: string
          id: number
          note: string
          requested_by_user_id: number | null
          resolved_at: string | null
          resolved_by_user_id: number | null
          status: string
          table_id: number | null
          updated_at: string
          visit_id: number | null
        }
        Insert: {
          company_id: number
          created_at?: string
          id?: number
          note?: string
          requested_by_user_id?: number | null
          resolved_at?: string | null
          resolved_by_user_id?: number | null
          status?: string
          table_id?: number | null
          updated_at?: string
          visit_id?: number | null
        }
        Update: {
          company_id?: number
          created_at?: string
          id?: number
          note?: string
          requested_by_user_id?: number | null
          resolved_at?: string | null
          resolved_by_user_id?: number | null
          status?: string
          table_id?: number | null
          updated_at?: string
          visit_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "call_waiter_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_waiter_events_requested_by_user_id_fkey"
            columns: ["requested_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_waiter_events_resolved_by_user_id_fkey"
            columns: ["resolved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_waiter_events_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "backup_company_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_waiter_events_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "backup_table_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_session_id: string
          company_id: string
          created_at: string
          extras_snapshot: Json
          id: string
          item_id: string
          line_total: number
          notes: string | null
          quantity: number
          unit_price: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          cart_session_id: string
          company_id: string
          created_at?: string
          extras_snapshot?: Json
          id?: string
          item_id: string
          line_total?: number
          notes?: string | null
          quantity: number
          unit_price?: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          cart_session_id?: string
          company_id?: string
          created_at?: string
          extras_snapshot?: Json
          id?: string
          item_id?: string
          line_total?: number
          notes?: string | null
          quantity?: number
          unit_price?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_session_id_fkey"
            columns: ["cart_session_id"]
            isOneToOne: false
            referencedRelation: "cart_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_sessions: {
        Row: {
          client_user_id: string | null
          company_id: string
          created_at: string
          currency: string
          id: string
          status: string
          table_id: string | null
          token: string | null
          updated_at: string
        }
        Insert: {
          client_user_id?: string | null
          company_id: string
          created_at?: string
          currency?: string
          id?: string
          status?: string
          table_id?: string | null
          token?: string | null
          updated_at?: string
        }
        Update: {
          client_user_id?: string | null
          company_id?: string
          created_at?: string
          currency?: string
          id?: string
          status?: string
          table_id?: string | null
          token?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_sessions_client_user_id_fkey"
            columns: ["client_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_sessions_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "company_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_storage: {
        Row: {
          cart_data: Json | null
          cart_data_raw: string | null
          company_id: number | null
          created_at: string | null
          id: string
          kds_finished: boolean
          receipt_number: string
          type: number
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          cart_data?: Json | null
          cart_data_raw?: string | null
          company_id?: number | null
          created_at?: string | null
          id: string
          kds_finished?: boolean
          receipt_number: string
          type: number
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          cart_data?: Json | null
          cart_data_raw?: string | null
          company_id?: number | null
          created_at?: string | null
          id?: string
          kds_finished?: boolean
          receipt_number?: string
          type?: number
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_storage_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_storage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          company_id: string
          created_at: string
          deleted_at: string | null
          description: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          deleted_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          deleted_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_company_id_fkey1"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      category_discovery_categories: {
        Row: {
          category_id: string
          created_at: string
          discovery_category_id: string
          id: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          discovery_category_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          discovery_category_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_discovery_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_discovery_categories_discovery_category_id_fkey"
            columns: ["discovery_category_id"]
            isOneToOne: false
            referencedRelation: "discovery_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          alias: string
          created_at: string | null
          deleted_at: string | null
          header_subtitle: string
          header_title: string
          id: number
          image: string
          name: string
          updated_at: string | null
        }
        Insert: {
          alias: string
          created_at?: string | null
          deleted_at?: string | null
          header_subtitle: string
          header_title: string
          id?: number
          image: string
          name: string
          updated_at?: string | null
        }
        Update: {
          alias?: string
          created_at?: string | null
          deleted_at?: string | null
          header_subtitle?: string
          header_title?: string
          id?: number
          image?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string
          cover_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string
          geo_location: unknown
          id: string
          is_featured: boolean
          lat: number | null
          lng: number | null
          logo_url: string | null
          name: string
          owner_user_id: string | null
          phone: string | null
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          address?: string
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string
          geo_location?: unknown
          id?: string
          is_featured?: boolean
          lat?: number | null
          lng?: number | null
          logo_url?: string | null
          name: string
          owner_user_id?: string | null
          phone?: string | null
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string
          geo_location?: unknown
          id?: string
          is_featured?: boolean
          lat?: number | null
          lng?: number | null
          logo_url?: string | null
          name?: string
          owner_user_id?: string | null
          phone?: string | null
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_areas: {
        Row: {
          company_id: string
          created_at: string
          id: string
          name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          name: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_areas_company_id_fkey1"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_banners: {
        Row: {
          active_from: string | null
          active_to: string | null
          company_id: string
          created_at: string
          id: string
          image_url: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          active_from?: string | null
          active_to?: string | null
          company_id: string
          created_at?: string
          id?: string
          image_url: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Update: {
          active_from?: string | null
          active_to?: string | null
          company_id?: string
          created_at?: string
          id?: string
          image_url?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_banners_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_categories: {
        Row: {
          category_id: number | null
          company_id: number | null
          created_at: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          company_id?: number | null
          created_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          company_id?: number | null
          created_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_discovery_categories: {
        Row: {
          company_id: string
          created_at: string
          discovery_category_id: string
          id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          discovery_category_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          discovery_category_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_discovery_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_discovery_categories_discovery_category_id_fkey"
            columns: ["discovery_category_id"]
            isOneToOne: false
            referencedRelation: "discovery_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      company_domains: {
        Row: {
          company_id: string
          created_at: string | null
          domain: string
          id: string
          is_primary: boolean
          updated_at: string | null
          verified_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          domain: string
          id?: string
          is_primary?: boolean
          updated_at?: string | null
          verified_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          domain?: string
          id?: string
          is_primary?: boolean
          updated_at?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_domains_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_hours: {
        Row: {
          close_time: string | null
          company_id: string
          created_at: string
          day_of_week: number
          id: string
          is_closed: boolean
          open_time: string | null
          shift_no: number
          updated_at: string
        }
        Insert: {
          close_time?: string | null
          company_id: string
          created_at?: string
          day_of_week: number
          id?: string
          is_closed?: boolean
          open_time?: string | null
          shift_no?: number
          updated_at?: string
        }
        Update: {
          close_time?: string | null
          company_id?: string
          created_at?: string
          day_of_week?: number
          id?: string
          is_closed?: boolean
          open_time?: string | null
          shift_no?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_hours_company_id_fkey1"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_memberships: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_memberships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_modules_enabled: {
        Row: {
          company_id: number
          config: Json
          created_at: string
          enabled: boolean
          id: number
          module_id: number
          updated_at: string
        }
        Insert: {
          company_id: number
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: number
          module_id: number
          updated_at?: string
        }
        Update: {
          company_id?: number
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: number
          module_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_modules_enabled_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_modules_enabled_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      company_payment_routing: {
        Row: {
          accepts_cash: boolean
          accepts_online: boolean
          company_id: string
          created_at: string
          funds_routing_mode: string
          payment_provider: string
          provider_account_ref: string | null
          provider_config: Json
          updated_at: string
        }
        Insert: {
          accepts_cash?: boolean
          accepts_online?: boolean
          company_id: string
          created_at?: string
          funds_routing_mode: string
          payment_provider: string
          provider_account_ref?: string | null
          provider_config?: Json
          updated_at?: string
        }
        Update: {
          accepts_cash?: boolean
          accepts_online?: boolean
          company_id?: string
          created_at?: string
          funds_routing_mode?: string
          payment_provider?: string
          provider_account_ref?: string | null
          provider_config?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_payment_routing_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_photo_albums: {
        Row: {
          company_id: string
          created_at: string
          id: string
          name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          name: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_photo_albums_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_photos: {
        Row: {
          album_id: string | null
          company_id: string
          created_at: string
          id: string
          order_index: number
          photo_url: string
          title: string | null
          updated_at: string
        }
        Insert: {
          album_id?: string | null
          company_id: string
          created_at?: string
          id?: string
          order_index?: number
          photo_url: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          album_id?: string | null
          company_id?: string
          created_at?: string
          id?: string
          order_index?: number
          photo_url?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_photos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "company_photo_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_photos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_plan_subscriptions: {
        Row: {
          canceled_at: string | null
          company_id: string
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          provider: string | null
          provider_customer_id: string | null
          provider_subscription_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          canceled_at?: string | null
          company_id: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          provider?: string | null
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          canceled_at?: string | null
          company_id?: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          provider?: string | null
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_plan_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_plan_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          company_id: string
          created_at: string
          currency: string
          disable_callwaiter: boolean
          disable_continues_ordering: boolean
          disable_ordering: boolean
          extra: Json
          require_pickup_vehicle: boolean
          settings_schema_version: number
          timezone: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          currency?: string
          disable_callwaiter?: boolean
          disable_continues_ordering?: boolean
          disable_ordering?: boolean
          extra?: Json
          require_pickup_vehicle?: boolean
          settings_schema_version?: number
          timezone?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          currency?: string
          disable_callwaiter?: boolean
          disable_continues_ordering?: boolean
          disable_ordering?: boolean
          extra?: Json
          require_pickup_vehicle?: boolean
          settings_schema_version?: number
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_tables: {
        Row: {
          area_id: string | null
          code: string | null
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          seats: number | null
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          code?: string | null
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          seats?: number | null
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          code?: string | null
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          seats?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_tables_area_id_fkey1"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "company_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_tables_company_id_fkey1"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          id: string
          order_id: string | null
          redeemed_at: string
          user_id: string | null
        }
        Insert: {
          coupon_id: string
          id?: string
          order_id?: string | null
          redeemed_at?: string
          user_id?: string | null
        }
        Update: {
          coupon_id?: string
          id?: string
          order_id?: string | null
          redeemed_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          company_id: string
          created_at: string
          discount_type: string
          discount_value: number
          ends_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          starts_at: string | null
          updated_at: string
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string
          discount_type: string
          discount_value: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          starts_at?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          starts_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupons_company_id_fkey1"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_areas: {
        Row: {
          center_lat: number | null
          center_lng: number | null
          company_id: string | null
          cost: number
          created_at: string | null
          geo_center: unknown
          id: number
          is_active: boolean
          min_order: number
          name: string
          phone: string
          radius_km: number
          updated_at: string | null
        }
        Insert: {
          center_lat?: number | null
          center_lng?: number | null
          company_id?: string | null
          cost: number
          created_at?: string | null
          geo_center?: unknown
          id?: number
          is_active?: boolean
          min_order?: number
          name: string
          phone?: string
          radius_km?: number
          updated_at?: string | null
        }
        Update: {
          center_lat?: number | null
          center_lng?: number | null
          company_id?: string | null
          cost?: number
          created_at?: string | null
          geo_center?: unknown
          id?: number
          is_active?: boolean
          min_order?: number
          name?: string
          phone?: string
          radius_km?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_areas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_categories: {
        Row: {
          created_at: string
          icon_key: string | null
          id: string
          is_active: boolean
          name: string
          order_index: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon_key?: string | null
          id?: string
          is_active?: boolean
          name: string
          order_index?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon_key?: string | null
          id?: string
          is_active?: boolean
          name?: string
          order_index?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      driver_delivery_areas: {
        Row: {
          company_id: string
          created_at: string | null
          delivery_area_id: number
          driver_id: string
          id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          delivery_area_id: number
          driver_id: string
          id?: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          delivery_area_id?: number
          driver_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_delivery_areas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_delivery_areas_delivery_area_id_fkey"
            columns: ["delivery_area_id"]
            isOneToOne: false
            referencedRelation: "delivery_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_invites: {
        Row: {
          claimed_at: string | null
          claimed_user_id: string | null
          company_id: string | null
          created_at: string
          created_by_user_id: string | null
          email: string
          expires_at: string | null
          full_name: string | null
          id: string
          invite_token: string
          scope: string
          status: string
          updated_at: string
        }
        Insert: {
          claimed_at?: string | null
          claimed_user_id?: string | null
          company_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          email: string
          expires_at?: string | null
          full_name?: string | null
          id?: string
          invite_token: string
          scope: string
          status?: string
          updated_at?: string
        }
        Update: {
          claimed_at?: string | null
          claimed_user_id?: string | null
          company_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          email?: string
          expires_at?: string | null
          full_name?: string | null
          id?: string
          invite_token?: string
          scope?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_invites_claimed_user_id_fkey"
            columns: ["claimed_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_invites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_invites_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_locations: {
        Row: {
          latitude: number
          longitude: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          latitude: number
          longitude: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          latitude?: number
          longitude?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      driver_profiles: {
        Row: {
          approval_status: string
          created_at: string
          is_online: boolean
          last_seen_at: string | null
          scope: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approval_status?: string
          created_at?: string
          is_online?: boolean
          last_seen_at?: string | null
          scope: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approval_status?: string
          created_at?: string
          is_online?: boolean
          last_seen_at?: string | null
          scope?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_configs: {
        Row: {
          created_at: string | null
          id: number
          key: string
          model_id: number
          model_type: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          key: string
          model_id: number
          model_type: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          key?: string
          model_id?: number
          model_type?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      expedition_matrix: {
        Row: {
          company_id: number | null
          created_at: string
          id: number
          is_enabled: boolean
          mode_code: string
          payment_method: string
          service_method: number
          updated_at: string
        }
        Insert: {
          company_id?: number | null
          created_at?: string
          id?: number
          is_enabled?: boolean
          mode_code: string
          payment_method: string
          service_method: number
          updated_at?: string
        }
        Update: {
          company_id?: number | null
          created_at?: string
          id?: number
          is_enabled?: boolean
          mode_code?: string
          payment_method?: string
          service_method?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expedition_matrix_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          code: string
          company_id: string | null
          created_at: string | null
          deleted_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_vendors: {
        Row: {
          code: string
          company_id: string | null
          created_at: string | null
          deleted_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_vendors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          company_id: string | null
          created_at: string | null
          date: string
          deleted_at: string | null
          description: string
          expense_category_id: number | null
          expense_vendor_id: number | null
          id: number
          reference: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          company_id?: string | null
          created_at?: string | null
          date: string
          deleted_at?: string | null
          description: string
          expense_category_id?: number | null
          expense_vendor_id?: number | null
          id?: number
          reference: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          company_id?: string | null
          created_at?: string | null
          date?: string
          deleted_at?: string | null
          description?: string
          expense_category_id?: number | null
          expense_vendor_id?: number | null
          id?: number
          reference?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_expense_vendor_id_fkey"
            columns: ["expense_vendor_id"]
            isOneToOne: false
            referencedRelation: "expense_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_rules: {
        Row: {
          company_id: string | null
          created_at: string
          ends_at: string | null
          flat_amount: number
          id: string
          is_active: boolean
          name: string
          percent_amount: number
          rule_type: string
          starts_at: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          ends_at?: string | null
          flat_amount?: number
          id?: string
          is_active?: boolean
          name: string
          percent_amount?: number
          rule_type: string
          starts_at?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          ends_at?: string | null
          flat_amount?: number
          id?: string
          is_active?: boolean
          name?: string
          percent_amount?: number
          rule_type?: string
          starts_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      idempotency_keys: {
        Row: {
          actor_user_id: string | null
          created_at: string
          expires_at: string | null
          key: string
          operation: string
          request_hash: string | null
          response: Json
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          expires_at?: string | null
          key: string
          operation: string
          request_hash?: string | null
          response?: Json
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          expires_at?: string | null
          key?: string
          operation?: string
          request_hash?: string | null
          response?: Json
        }
        Relationships: []
      }
      impersonation_sessions: {
        Row: {
          actor_role: string
          actor_user_id: string
          created_at: string
          ended_at: string | null
          id: string
          reason: string | null
          started_at: string
          target_company_id: string
          target_user_id: string | null
          updated_at: string
        }
        Insert: {
          actor_role: string
          actor_user_id: string
          created_at?: string
          ended_at?: string | null
          id?: string
          reason?: string | null
          started_at?: string
          target_company_id: string
          target_user_id?: string | null
          updated_at?: string
        }
        Update: {
          actor_role?: string
          actor_user_id?: string
          created_at?: string
          ended_at?: string | null
          id?: string
          reason?: string | null
          started_at?: string
          target_company_id?: string
          target_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "impersonation_sessions_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "impersonation_sessions_target_company_id_fkey"
            columns: ["target_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "impersonation_sessions_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          company_id: string
          created_at: string
          currency: string
          due_at: string | null
          id: string
          invoice_number: string
          issued_at: string | null
          meta: Json
          paid_at: string | null
          status: string
          subscription_id: string | null
          subtotal: number
          tax_total: number
          total: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          currency?: string
          due_at?: string | null
          id?: string
          invoice_number: string
          issued_at?: string | null
          meta?: Json
          paid_at?: string | null
          status: string
          subscription_id?: string | null
          subtotal?: number
          tax_total?: number
          total?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          currency?: string
          due_at?: string | null
          id?: string
          invoice_number?: string
          issued_at?: string | null
          meta?: Json
          paid_at?: string | null
          status?: string
          subscription_id?: string | null
          subtotal?: number
          tax_total?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "company_plan_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      item_allergens: {
        Row: {
          allergen_id: string
          created_at: string
          item_id: string
        }
        Insert: {
          allergen_id: string
          created_at?: string
          item_id: string
        }
        Update: {
          allergen_id?: string
          created_at?: string
          item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_allergens_allergen_id_fkey1"
            columns: ["allergen_id"]
            isOneToOne: false
            referencedRelation: "allergens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_allergens_item_id_fkey1"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      item_extras: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          item_id: string
          name: string
          order_index: number
          price: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          item_id: string
          name: string
          order_index?: number
          price?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          item_id?: string
          name?: string
          order_index?: number
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_extras_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_extras_item_id_fkey1"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      item_options: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_required: boolean
          item_id: string
          max_select: number | null
          min_select: number
          name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_required?: boolean
          item_id: string
          max_select?: number | null
          min_select?: number
          name: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_required?: boolean
          item_id?: string
          max_select?: number | null
          min_select?: number
          name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_options_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_options_item_id_fkey1"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      item_variants: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_default: boolean
          item_id: string
          name: string
          option_id: string | null
          order_index: number
          price_delta: number
          qty: number | null
          qty_management: boolean
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_default?: boolean
          item_id: string
          name: string
          option_id?: string | null
          order_index?: number
          price_delta?: number
          qty?: number | null
          qty_management?: boolean
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_default?: boolean
          item_id?: string
          name?: string
          option_id?: string | null
          order_index?: number
          price_delta?: number
          qty?: number | null
          qty_management?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_variants_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_variants_item_id_fkey1"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_variants_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "item_options"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          category_id: string
          company_id: string
          created_at: string
          deleted_at: string | null
          description: string
          discount_price: number | null
          has_variants: boolean
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          order_index: number
          price: number
          qty: number | null
          qty_management: boolean
          sku: string | null
          updated_at: string
        }
        Insert: {
          category_id: string
          company_id: string
          created_at?: string
          deleted_at?: string | null
          description?: string
          discount_price?: number | null
          has_variants?: boolean
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          order_index?: number
          price?: number
          qty?: number | null
          qty_management?: boolean
          sku?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          company_id?: string
          created_at?: string
          deleted_at?: string | null
          description?: string
          discount_price?: number | null
          has_variants?: boolean
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          order_index?: number
          price?: number
          qty?: number | null
          qty_management?: boolean
          sku?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey1"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      job_outbox: {
        Row: {
          aggregate_id: string | null
          aggregate_type: string
          attempt_count: number
          created_at: string
          event_type: string
          id: string
          last_error: string | null
          payload: Json
          run_after: string
          status: string
          updated_at: string
        }
        Insert: {
          aggregate_id?: string | null
          aggregate_type: string
          attempt_count?: number
          created_at?: string
          event_type: string
          id?: string
          last_error?: string | null
          payload?: Json
          run_after?: string
          status?: string
          updated_at?: string
        }
        Update: {
          aggregate_id?: string | null
          aggregate_type?: string
          attempt_count?: number
          created_at?: string
          event_type?: string
          id?: string
          last_error?: string | null
          payload?: Json
          run_after?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          created_at: string | null
          id: number
          language: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          language: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          language?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          currency: string
          description: string | null
          direction: string
          entry_type: string
          id: number
          invoice_id: string | null
          meta: Json
          order_id: string | null
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          currency?: string
          description?: string | null
          direction: string
          entry_type: string
          id?: number
          invoice_id?: string | null
          meta?: Json
          order_id?: string | null
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          currency?: string
          description?: string | null
          direction?: string
          entry_type?: string
          id?: number
          invoice_id?: string | null
          meta?: Json
          order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      local_menus: {
        Row: {
          company_id: number
          created_at: string | null
          id: number
          is_default: boolean
          language_code: string
          language_name: string
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          id?: number
          is_default?: boolean
          language_code: string
          language_name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          id?: number
          is_default?: boolean
          language_code?: string
          language_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "local_menus_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      manager_companies: {
        Row: {
          company_id: number
          created_at: string
          manager_user_id: number
        }
        Insert: {
          company_id: number
          created_at?: string
          manager_user_id: number
        }
        Update: {
          company_id?: number
          created_at?: string
          manager_user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "manager_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manager_companies_manager_user_id_fkey"
            columns: ["manager_user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      modules_catalog: {
        Row: {
          code: string
          created_at: string
          description: string
          id: number
          is_core: boolean
          name: string
          scope: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string
          id?: number
          is_core?: boolean
          name: string
          scope?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          id?: number
          is_core?: boolean
          name?: string
          scope?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications_legacy: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          notifiable_id: number
          notifiable_type: string
          read_at: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          id: string
          notifiable_id: number
          notifiable_type: string
          read_at?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          notifiable_id?: number
          notifiable_type?: string
          read_at?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          base_unit_price: number
          company_id: string
          created_at: string
          extras_snapshot: Json
          extras_total: number
          id: string
          item_id: string | null
          item_name: string
          kds_done: boolean
          kds_done_at: string | null
          line_total: number
          meta: Json
          order_id: string
          quantity: number
          unit_price: number
          updated_at: string
          variant_id: string | null
          variant_name: string | null
        }
        Insert: {
          base_unit_price?: number
          company_id: string
          created_at?: string
          extras_snapshot?: Json
          extras_total?: number
          id?: string
          item_id?: string | null
          item_name: string
          kds_done?: boolean
          kds_done_at?: string | null
          line_total?: number
          meta?: Json
          order_id: string
          quantity: number
          unit_price?: number
          updated_at?: string
          variant_id?: string | null
          variant_name?: string | null
        }
        Update: {
          base_unit_price?: number
          company_id?: string
          created_at?: string
          extras_snapshot?: Json
          extras_total?: number
          id?: string
          item_id?: string | null
          item_name?: string
          kds_done?: boolean
          kds_done_at?: string | null
          line_total?: number
          meta?: Json
          order_id?: string
          quantity?: number
          unit_price?: number
          updated_at?: string
          variant_id?: string | null
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_item_id_fkey1"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey1"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_reviews: {
        Row: {
          comment: string | null
          company_id: string
          created_at: string
          id: string
          order_id: string
          rating: number
          reviewer_user_id: string | null
          updated_at: string
        }
        Insert: {
          comment?: string | null
          company_id: string
          created_at?: string
          id?: string
          order_id: string
          rating: number
          reviewer_user_id?: string | null
          updated_at?: string
        }
        Update: {
          comment?: string | null
          company_id?: string
          created_at?: string
          id?: string
          order_id?: string
          rating?: number
          reviewer_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_reviews_reviewer_user_id_fkey"
            columns: ["reviewer_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_alias_rules: {
        Row: {
          created_at: string
          from_status_id: number
          id: number
          role_name: string
          to_status_id: number
        }
        Insert: {
          created_at?: string
          from_status_id: number
          id?: number
          role_name: string
          to_status_id: number
        }
        Update: {
          created_at?: string
          from_status_id?: number
          id?: number
          role_name?: string
          to_status_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_status_alias_rules_from_status_id_fkey"
            columns: ["from_status_id"]
            isOneToOne: false
            referencedRelation: "backup_order_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_alias_rules_to_status_id_fkey"
            columns: ["to_status_id"]
            isOneToOne: false
            referencedRelation: "backup_order_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by_user_id: string | null
          comment: string | null
          company_id: string
          created_at: string
          id: number
          new_alias: string
          old_alias: string | null
          order_id: string
        }
        Insert: {
          changed_by_user_id?: string | null
          comment?: string | null
          company_id: string
          created_at?: string
          id?: number
          new_alias: string
          old_alias?: string | null
          order_id: string
        }
        Update: {
          changed_by_user_id?: string | null
          comment?: string | null
          company_id?: string
          created_at?: string
          id?: number
          new_alias?: string
          old_alias?: string | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_changed_by_user_id_fkey"
            columns: ["changed_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_new_alias_fkey"
            columns: ["new_alias"]
            isOneToOne: false
            referencedRelation: "order_statuses"
            referencedColumns: ["alias"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey1"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_statuses: {
        Row: {
          alias: string
          created_at: string
          is_terminal: boolean
          position: number
          title: string
        }
        Insert: {
          alias: string
          created_at?: string
          is_terminal?: boolean
          position?: number
          title: string
        }
        Update: {
          alias?: string
          created_at?: string
          is_terminal?: boolean
          position?: number
          title?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          ai_notes: string | null
          cart_session_id: string | null
          client_user_id: string | null
          company_id: string
          created_at: string
          currency: string
          deleted_at: string | null
          delivery_fee: number
          discount_total: number
          driver_user_id: string | null
          expedition_type: string
          funds_routing_mode: string | null
          grand_total: number
          id: string
          metadata: Json
          notes: string | null
          payment_method: string
          payment_provider: string | null
          payment_route_snapshot: Json
          payment_status: string
          pickup_color: string | null
          pickup_make: string | null
          pickup_model: string | null
          pickup_plate: string | null
          pickup_vehicle: Json
          pickup_vehicle_source: string | null
          scheduled_for: string | null
          source: string
          status_alias: string
          subtotal: number
          table_id: string | null
          tax_total: number
          tip_total: number
          updated_at: string
          vendor_order_number: number | null
          visit_id: string | null
        }
        Insert: {
          ai_notes?: string | null
          cart_session_id?: string | null
          client_user_id?: string | null
          company_id: string
          created_at?: string
          currency?: string
          deleted_at?: string | null
          delivery_fee?: number
          discount_total?: number
          driver_user_id?: string | null
          expedition_type: string
          funds_routing_mode?: string | null
          grand_total?: number
          id?: string
          metadata?: Json
          notes?: string | null
          payment_method?: string
          payment_provider?: string | null
          payment_route_snapshot?: Json
          payment_status?: string
          pickup_color?: string | null
          pickup_make?: string | null
          pickup_model?: string | null
          pickup_plate?: string | null
          pickup_vehicle?: Json
          pickup_vehicle_source?: string | null
          scheduled_for?: string | null
          source?: string
          status_alias: string
          subtotal?: number
          table_id?: string | null
          tax_total?: number
          tip_total?: number
          updated_at?: string
          vendor_order_number?: number | null
          visit_id?: string | null
        }
        Update: {
          ai_notes?: string | null
          cart_session_id?: string | null
          client_user_id?: string | null
          company_id?: string
          created_at?: string
          currency?: string
          deleted_at?: string | null
          delivery_fee?: number
          discount_total?: number
          driver_user_id?: string | null
          expedition_type?: string
          funds_routing_mode?: string | null
          grand_total?: number
          id?: string
          metadata?: Json
          notes?: string | null
          payment_method?: string
          payment_provider?: string | null
          payment_route_snapshot?: Json
          payment_status?: string
          pickup_color?: string | null
          pickup_make?: string | null
          pickup_model?: string | null
          pickup_plate?: string | null
          pickup_vehicle?: Json
          pickup_vehicle_source?: string | null
          scheduled_for?: string | null
          source?: string
          status_alias?: string
          subtotal?: number
          table_id?: string | null
          tax_total?: number
          tip_total?: number
          updated_at?: string
          vendor_order_number?: number | null
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_user_id_fkey"
            columns: ["client_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_driver_user_id_fkey"
            columns: ["driver_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_status_alias_fkey"
            columns: ["status_alias"]
            isOneToOne: false
            referencedRelation: "order_statuses"
            referencedColumns: ["alias"]
          },
          {
            foreignKeyName: "orders_table_id_fkey1"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "company_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "table_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string
          created_at: string | null
          id: number
          show_as_link: boolean
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          show_as_link?: boolean
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          show_as_link?: boolean
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      password_resets_legacy: {
        Row: {
          created_at: string | null
          email: string
          token: string
        }
        Insert: {
          created_at?: string | null
          email: string
          token: string
        }
        Update: {
          created_at?: string | null
          email?: string
          token?: string
        }
        Relationships: []
      }
      payment_attempts: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          currency: string
          error_message: string | null
          id: string
          idempotency_key: string | null
          method: string
          order_id: string
          payload: Json
          provider: string
          provider_reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          currency?: string
          error_message?: string | null
          id?: string
          idempotency_key?: string | null
          method: string
          order_id: string
          payload?: Json
          provider: string
          provider_reference?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          currency?: string
          error_message?: string | null
          id?: string
          idempotency_key?: string | null
          method?: string
          order_id?: string
          payload?: Json
          provider?: string
          provider_reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_attempts_company_id_fkey1"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_attempts_order_id_fkey1"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          currency: string
          id: string
          payment_attempt_id: string
          provider_payload: Json
          provider_transaction_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          currency?: string
          id?: string
          payment_attempt_id: string
          provider_payload?: Json
          provider_transaction_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          currency?: string
          id?: string
          payment_attempt_id?: string
          provider_payload?: Json
          provider_transaction_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_payment_attempt_id_fkey"
            columns: ["payment_attempt_id"]
            isOneToOne: false
            referencedRelation: "payment_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          country: string
          created_at: string | null
          currency: string
          id: number
          name: string
          provider: string
          stripe_id: string | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          amount: number
          country: string
          created_at?: string | null
          currency: string
          id?: number
          name: string
          provider: string
          stripe_id?: string | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          amount?: number
          country?: string
          created_at?: string | null
          currency?: string
          id?: number
          name?: string
          provider?: string
          stripe_id?: string | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          currency: string
          id: string
          period_end: string | null
          period_start: string | null
          provider: string | null
          provider_payout_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          currency?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          provider?: string | null
          provider_payout_id?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          currency?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          provider?: string | null
          provider_payout_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string | null
          guard_name: string
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          guard_name?: string
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          guard_name?: string
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pickup_colors: {
        Row: {
          hex: string
          id: number
          name: string
        }
        Insert: {
          hex: string
          id?: number
          name: string
        }
        Update: {
          hex?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      plan_catalog: {
        Row: {
          code: string
          created_at: string
          currency: string
          features: Json
          id: string
          is_active: boolean
          name: string
          period: string
          price: number
          trial_days: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          is_active?: boolean
          name: string
          period: string
          price?: number
          trial_days?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          period?: string
          price?: number
          trial_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string
          enable_ordering: number
          features: string
          id: number
          limit_items: number
          limit_orders: number
          limit_views: number
          mollie_id: string | null
          name: string
          paddle_id: string
          paypal_id: string | null
          paystack_id: string | null
          period: number
          price: number
          stripe_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          enable_ordering?: number
          features?: string
          id?: number
          limit_items?: number
          limit_orders?: number
          limit_views?: number
          mollie_id?: string | null
          name: string
          paddle_id?: string
          paypal_id?: string | null
          paystack_id?: string | null
          period?: number
          price?: number
          stripe_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          enable_ordering?: number
          features?: string
          id?: number
          limit_items?: number
          limit_orders?: number
          limit_views?: number
          mollie_id?: string | null
          name?: string
          paddle_id?: string
          paypal_id?: string | null
          paystack_id?: string | null
          period?: number
          price?: number
          stripe_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pos_call_waiter_events: {
        Row: {
          company_id: string
          created_at: string
          id: string
          note: string
          resolved_at: string | null
          resolved_by_user_id: string | null
          status: string
          table_id: string
          updated_at: string
          visit_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          note?: string
          resolved_at?: string | null
          resolved_by_user_id?: string | null
          status?: string
          table_id: string
          updated_at?: string
          visit_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          note?: string
          resolved_at?: string | null
          resolved_by_user_id?: string | null
          status?: string
          table_id?: string
          updated_at?: string
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_call_waiter_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_call_waiter_events_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "company_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_call_waiter_events_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "table_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          image: string | null
          link: string | null
          link_name: string | null
          post_type: string | null
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          link?: string | null
          link_name?: string | null
          post_type?: string | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          link?: string | null
          link_name?: string | null
          post_type?: string | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          system_role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          phone?: string | null
          system_role?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          system_role?: string
          updated_at?: string
        }
        Relationships: []
      }
      public_rpc_rate_limits: {
        Row: {
          created_at: string
          hits: number
          id: number
          key_hash: string
          rpc_name: string
          updated_at: string
          window_start: string
        }
        Insert: {
          created_at?: string
          hits?: number
          id?: number
          key_hash: string
          rpc_name: string
          updated_at?: string
          window_start: string
        }
        Update: {
          created_at?: string
          hits?: number
          id?: number
          key_hash?: string
          rpc_name?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string
          created_at: string | null
          id: number
          order_id: number
          rateable_id: number
          rateable_type: string
          rating: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          comment?: string
          created_at?: string | null
          id?: number
          order_id: number
          rateable_id: number
          rateable_type: string
          rating: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: number
          order_id?: number
          rateable_id?: number
          rateable_type?: string
          rating?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "backup_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_company_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          order_id: string
          payment_transaction_id: string | null
          reason: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          order_id: string
          payment_transaction_id?: string | null
          reason?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          order_id?: string
          payment_transaction_id?: string | null
          reason?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_payment_transaction_id_fkey"
            columns: ["payment_transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          from_status: string | null
          id: string
          note: string | null
          reservation_id: string
          to_status: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          from_status?: string | null
          id?: string
          note?: string | null
          reservation_id: string
          to_status: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          from_status?: string | null
          id?: string
          note?: string | null
          reservation_id?: string
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_status_history_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          customer_name: string
          customer_phone: string | null
          guest_count: number
          id: string
          meta: Json
          notes: string | null
          reservation_at: string
          source: string
          status: string
          table_id: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          customer_name: string
          customer_phone?: string | null
          guest_count: number
          id?: string
          meta?: Json
          notes?: string | null
          reservation_at: string
          source?: string
          status?: string
          table_id?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          customer_name?: string
          customer_phone?: string | null
          guest_count?: number
          id?: string
          meta?: Json
          notes?: string | null
          reservation_at?: string
          source?: string
          status?: string
          table_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "company_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          permission_id: number
          role_id: number
        }
        Insert: {
          created_at?: string | null
          permission_id: number
          role_id: number
        }
        Update: {
          created_at?: string | null
          permission_id?: number
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          guard_name: string
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          guard_name?: string
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          guard_name?: string
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sms_verifications: {
        Row: {
          code: string
          contact_number: string
          created_at: string | null
          id: number
          status: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          code: string
          contact_number: string
          created_at?: string | null
          id?: number
          status?: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          code?: string
          contact_number?: string
          created_at?: string | null
          id?: number
          status?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sms_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      stg_items_import: {
        Row: {
          category_name: string
          company_id: number
          created_at: string
          created_by_user_id: number | null
          description: string
          discounted_price: number | null
          id: number
          import_message: string
          import_status: string
          item_name: string
          price: number | null
          raw_row: Json
          row_num: number
          updated_at: string
          upload_id: string
          vat: number | null
        }
        Insert: {
          category_name: string
          company_id: number
          created_at?: string
          created_by_user_id?: number | null
          description?: string
          discounted_price?: number | null
          id?: number
          import_message?: string
          import_status?: string
          item_name: string
          price?: number | null
          raw_row?: Json
          row_num: number
          updated_at?: string
          upload_id?: string
          vat?: number | null
        }
        Update: {
          category_name?: string
          company_id?: number
          created_at?: string
          created_by_user_id?: number | null
          description?: string
          discounted_price?: number | null
          id?: number
          import_message?: string
          import_status?: string
          item_name?: string
          price?: number | null
          raw_row?: Json
          row_num?: number
          updated_at?: string
          upload_id?: string
          vat?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stg_items_import_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stg_items_import_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_items: {
        Row: {
          created_at: string | null
          id: number
          quantity: number
          stripe_id: string
          stripe_plan: string
          stripe_price: string
          stripe_product: string
          subscription_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          quantity?: number
          stripe_id: string
          stripe_plan: string
          stripe_price?: string
          stripe_product?: string
          subscription_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          quantity?: number
          stripe_id?: string
          stripe_plan?: string
          stripe_price?: string
          stripe_product?: string
          subscription_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_items_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          ends_at: string | null
          id: number
          name: string
          quantity: number
          stripe_id: string
          stripe_plan: string
          stripe_price: string | null
          stripe_status: string
          trial_ends_at: string | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          id?: number
          name: string
          quantity?: number
          stripe_id: string
          stripe_plan: string
          stripe_price?: string | null
          stripe_status: string
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          id?: number
          name?: string
          quantity?: number
          stripe_id?: string
          stripe_plan?: string
          stripe_price?: string | null
          stripe_status?: string
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      system_modules_enabled: {
        Row: {
          config: Json
          created_at: string
          enabled: boolean
          id: number
          module_id: number
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: number
          module_id: number
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: number
          module_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_modules_enabled_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: true
            referencedRelation: "modules_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          is_public?: boolean
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      table_visits: {
        Row: {
          closed_at: string | null
          company_id: string
          created_at: string
          guest_count: number | null
          id: string
          meta: Json
          reservation_id: string | null
          status: string
          table_id: string | null
          visit_token: string | null
        }
        Insert: {
          closed_at?: string | null
          company_id: string
          created_at?: string
          guest_count?: number | null
          id?: string
          meta?: Json
          reservation_id?: string | null
          status?: string
          table_id?: string | null
          visit_token?: string | null
        }
        Update: {
          closed_at?: string | null
          company_id?: string
          created_at?: string
          guest_count?: number | null
          id?: string
          meta?: Json
          reservation_id?: string | null
          status?: string
          table_id?: string | null
          visit_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_visits_company_id_fkey1"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_visits_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_visits_table_id_fkey1"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "company_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invites: {
        Row: {
          claimed_at: string | null
          claimed_user_id: string | null
          company_id: string | null
          created_at: string
          created_by_user_id: string | null
          email: string
          expires_at: string | null
          full_name: string | null
          id: string
          invite_token: string
          role: string
          scope: string
          status: string
          updated_at: string
        }
        Insert: {
          claimed_at?: string | null
          claimed_user_id?: string | null
          company_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          email: string
          expires_at?: string | null
          full_name?: string | null
          id?: string
          invite_token: string
          role: string
          scope: string
          status?: string
          updated_at?: string
        }
        Update: {
          claimed_at?: string | null
          claimed_user_id?: string | null
          company_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          email?: string
          expires_at?: string | null
          full_name?: string | null
          id?: string
          invite_token?: string
          role?: string
          scope?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invites_claimed_user_id_fkey"
            columns: ["claimed_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invites_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          created_at: string | null
          group_name: string | null
          id: number
          key: string
          language_id: number
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          group_name?: string | null
          id?: number
          key: string
          language_id: number
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          group_name?: string | null
          id?: number
          key?: string
          language_id?: number
          updated_at?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_addresses: {
        Row: {
          active: boolean
          address: string
          apartment: string | null
          created_at: string | null
          entry: string | null
          floor: string | null
          id: number
          intercom: string | null
          lat: string
          lng: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          active?: boolean
          address: string
          apartment?: string | null
          created_at?: string | null
          entry?: string | null
          floor?: string | null
          id?: number
          intercom?: string | null
          lat: string
          lng: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          active?: boolean
          address?: string
          apartment?: string | null
          created_at?: string | null
          entry?: string | null
          floor?: string | null
          id?: number
          intercom?: string | null
          lat?: string
          lng?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      user_categories: {
        Row: {
          category_id: number | null
          created_at: string | null
          id: number
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          id?: number
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          id?: number
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      user_paths: {
        Row: {
          created_at: string | null
          id: number
          lat: string | null
          lng: string | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          lat?: string | null
          lng?: string | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          lat?: string | null
          lng?: string | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_paths_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          created_at: string | null
          permission_id: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          permission_id: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          permission_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          role_id: number
          user_id: number
        }
        Insert: {
          created_at?: string | null
          role_id: number
          user_id: number
        }
        Update: {
          created_at?: string | null
          role_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      users_legacy: {
        Row: {
          active: boolean
          api_token: string | null
          birth_date: string
          cancel_url: string
          card_brand: string | null
          card_last_four: string | null
          checkout_id: string
          created_at: string | null
          deleted_at: string | null
          email: string
          email_normalized: string | null
          email_verified_at: string | null
          expotoken: string | null
          extra_billing_information: string | null
          fb_id: string | null
          google_id: string | null
          id: number
          lat: string | null
          lng: string | null
          mollie_customer_id: string | null
          mollie_mandate_id: string | null
          mollie_subscribtion_id: string | null
          name: string
          numorders: number
          onorder: number | null
          password: string | null
          paypal_subscribtion_id: string | null
          paystack_subscribtion_id: string | null
          paystack_trans_id: string | null
          phone: string | null
          phone_verified_at: string | null
          plan_id: number | null
          plan_status: string
          pm_last_four: string | null
          pm_type: string | null
          rejectedorders: number
          remember_token: string | null
          restaurant_id: number | null
          stripe_account: string
          stripe_id: string | null
          subscription_plan_id: string
          tax_percentage: number
          trial_ends_at: string | null
          update_url: string
          updated_at: string | null
          verification_code: string | null
          working: number
        }
        Insert: {
          active?: boolean
          api_token?: string | null
          birth_date?: string
          cancel_url?: string
          card_brand?: string | null
          card_last_four?: string | null
          checkout_id?: string
          created_at?: string | null
          deleted_at?: string | null
          email: string
          email_normalized?: string | null
          email_verified_at?: string | null
          expotoken?: string | null
          extra_billing_information?: string | null
          fb_id?: string | null
          google_id?: string | null
          id?: number
          lat?: string | null
          lng?: string | null
          mollie_customer_id?: string | null
          mollie_mandate_id?: string | null
          mollie_subscribtion_id?: string | null
          name: string
          numorders?: number
          onorder?: number | null
          password?: string | null
          paypal_subscribtion_id?: string | null
          paystack_subscribtion_id?: string | null
          paystack_trans_id?: string | null
          phone?: string | null
          phone_verified_at?: string | null
          plan_id?: number | null
          plan_status?: string
          pm_last_four?: string | null
          pm_type?: string | null
          rejectedorders?: number
          remember_token?: string | null
          restaurant_id?: number | null
          stripe_account?: string
          stripe_id?: string | null
          subscription_plan_id?: string
          tax_percentage?: number
          trial_ends_at?: string | null
          update_url?: string
          updated_at?: string | null
          verification_code?: string | null
          working?: number
        }
        Update: {
          active?: boolean
          api_token?: string | null
          birth_date?: string
          cancel_url?: string
          card_brand?: string | null
          card_last_four?: string | null
          checkout_id?: string
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          email_normalized?: string | null
          email_verified_at?: string | null
          expotoken?: string | null
          extra_billing_information?: string | null
          fb_id?: string | null
          google_id?: string | null
          id?: number
          lat?: string | null
          lng?: string | null
          mollie_customer_id?: string | null
          mollie_mandate_id?: string | null
          mollie_subscribtion_id?: string | null
          name?: string
          numorders?: number
          onorder?: number | null
          password?: string | null
          paypal_subscribtion_id?: string | null
          paystack_subscribtion_id?: string | null
          paystack_trans_id?: string | null
          phone?: string | null
          phone_verified_at?: string | null
          plan_id?: number | null
          plan_status?: string
          pm_last_four?: string | null
          pm_type?: string | null
          rejectedorders?: number
          remember_token?: string | null
          restaurant_id?: number | null
          stripe_account?: string
          stripe_id?: string | null
          subscription_plan_id?: string
          tax_percentage?: number
          trial_ends_at?: string | null
          update_url?: string
          updated_at?: string | null
          verification_code?: string | null
          working?: number
        }
        Relationships: [
          {
            foreignKeyName: "users_legacy_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_extras: {
        Row: {
          created_at: string
          extra_id: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          extra_id: string
          variant_id: string
        }
        Update: {
          created_at?: string
          extra_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_extras_extra_id_fkey1"
            columns: ["extra_id"]
            isOneToOne: false
            referencedRelation: "item_extras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_extras_variant_id_fkey1"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_makes: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      vehicle_models: {
        Row: {
          id: number
          make_id: number
          name: string
        }
        Insert: {
          id?: number
          make_id: number
          name: string
        }
        Update: {
          id?: number
          make_id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_models_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "vehicle_makes"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_suggestion_queue: {
        Row: {
          approved_make_id: number | null
          approved_model_id: number | null
          company_id: string | null
          created_at: string
          id: string
          normalized_make: string | null
          normalized_model: string | null
          order_id: string | null
          raw_color: string | null
          raw_make: string
          raw_model: string
          review_note: string | null
          reviewed_by: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_make_id?: number | null
          approved_model_id?: number | null
          company_id?: string | null
          created_at?: string
          id?: string
          normalized_make?: string | null
          normalized_model?: string | null
          order_id?: string | null
          raw_color?: string | null
          raw_make: string
          raw_model: string
          review_note?: string | null
          reviewed_by?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_make_id?: number | null
          approved_model_id?: number | null
          company_id?: string | null
          created_at?: string
          id?: string
          normalized_make?: string | null
          normalized_model?: string | null
          order_id?: string | null
          raw_color?: string | null
          raw_make?: string
          raw_model?: string
          review_note?: string | null
          reviewed_by?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_suggestion_queue_approved_make_id_fkey"
            columns: ["approved_make_id"]
            isOneToOne: false
            referencedRelation: "vehicle_makes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_suggestion_queue_approved_model_id_fkey"
            columns: ["approved_model_id"]
            isOneToOne: false
            referencedRelation: "vehicle_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_suggestion_queue_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_suggestion_queue_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      categories_legacy_view: {
        Row: {
          active: boolean | null
          company_id: number | null
          created_at: string | null
          deleted_at: string | null
          id: number | null
          name: string | null
          order_index: number | null
          restorant_id: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          company_id?: number | null
          created_at?: string | null
          deleted_at?: string | null
          id?: number | null
          name?: string | null
          order_index?: number | null
          restorant_id?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          company_id?: number | null
          created_at?: string | null
          deleted_at?: string | null
          id?: number | null
          name?: string | null
          order_index?: number | null
          restorant_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_company_id_fkey"
            columns: ["restorant_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons_legacy_view: {
        Row: {
          active_from: string | null
          active_to: string | null
          code: string | null
          company_id: number | null
          created_at: string | null
          id: number | null
          limit_to_num_uses: number | null
          name: string | null
          price: number | null
          restaurant_id: number | null
          type: number | null
          updated_at: string | null
          used_count: number | null
        }
        Insert: {
          active_from?: string | null
          active_to?: string | null
          code?: string | null
          company_id?: number | null
          created_at?: string | null
          id?: number | null
          limit_to_num_uses?: number | null
          name?: string | null
          price?: number | null
          restaurant_id?: number | null
          type?: number | null
          updated_at?: string | null
          used_count?: number | null
        }
        Update: {
          active_from?: string | null
          active_to?: string | null
          code?: string | null
          company_id?: number | null
          created_at?: string | null
          id?: number | null
          limit_to_num_uses?: number | null
          name?: string | null
          price?: number | null
          restaurant_id?: number | null
          type?: number | null
          updated_at?: string | null
          used_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_company_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      orders_company_view: {
        Row: {
          address_id: number | null
          client_id: number | null
          comment: string | null
          company_id: number | null
          coupon: string | null
          created_at: string | null
          deleted_at: string | null
          delivery_method: number | null
          delivery_pickup_interval: string | null
          delivery_price: number | null
          discount: number | null
          driver_id: number | null
          employee_id: number | null
          fee: number | null
          fee_value: number | null
          id: number | null
          id_per_vendor: string | null
          kds_finished: boolean | null
          lat: string | null
          lng: string | null
          md: string | null
          order_price: number | null
          payment_link: string | null
          payment_method: string | null
          payment_processor_fee: number | null
          payment_status: string | null
          phone: string | null
          restorant_id: number | null
          static_fee: number | null
          stripe_payment_id: string | null
          table_id: number | null
          time_to_prepare: number | null
          tip: number | null
          updated_at: string | null
          vatvalue: number | null
          whatsapp_address: string | null
        }
        Insert: {
          address_id?: number | null
          client_id?: number | null
          comment?: string | null
          company_id?: number | null
          coupon?: string | null
          created_at?: string | null
          deleted_at?: string | null
          delivery_method?: number | null
          delivery_pickup_interval?: string | null
          delivery_price?: number | null
          discount?: number | null
          driver_id?: number | null
          employee_id?: number | null
          fee?: number | null
          fee_value?: number | null
          id?: number | null
          id_per_vendor?: string | null
          kds_finished?: boolean | null
          lat?: string | null
          lng?: string | null
          md?: string | null
          order_price?: number | null
          payment_link?: string | null
          payment_method?: string | null
          payment_processor_fee?: number | null
          payment_status?: string | null
          phone?: string | null
          restorant_id?: number | null
          static_fee?: number | null
          stripe_payment_id?: string | null
          table_id?: number | null
          time_to_prepare?: number | null
          tip?: number | null
          updated_at?: string | null
          vatvalue?: number | null
          whatsapp_address?: string | null
        }
        Update: {
          address_id?: number | null
          client_id?: number | null
          comment?: string | null
          company_id?: number | null
          coupon?: string | null
          created_at?: string | null
          deleted_at?: string | null
          delivery_method?: number | null
          delivery_pickup_interval?: string | null
          delivery_price?: number | null
          discount?: number | null
          driver_id?: number | null
          employee_id?: number | null
          fee?: number | null
          fee_value?: number | null
          id?: number | null
          id_per_vendor?: string | null
          kds_finished?: boolean | null
          lat?: string | null
          lng?: string | null
          md?: string | null
          order_price?: number | null
          payment_link?: string | null
          payment_method?: string | null
          payment_processor_fee?: number | null
          payment_status?: string | null
          phone?: string | null
          restorant_id?: number | null
          static_fee?: number | null
          stripe_payment_id?: string | null
          table_id?: number | null
          time_to_prepare?: number | null
          tip?: number | null
          updated_at?: string | null
          vatvalue?: number | null
          whatsapp_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restorant_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restorant_id_fkey"
            columns: ["restorant_id"]
            isOneToOne: false
            referencedRelation: "backup_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "backup_company_tables"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      add_cart_item: {
        Args: {
          p_cart_id: string
          p_extras?: string[]
          p_item_id: string
          p_quantity?: number
          p_variant_id?: string
        }
        Returns: string
      }
      add_company_driver: {
        Args: { p_company_id: string; p_email: string; p_full_name?: string }
        Returns: Json
      }
      admin_create_company_with_owner: {
        Args: { payload: Json }
        Returns: Json
      }
      admin_dashboard_summary: {
        Args: { p_from_date?: string; p_to_date?: string }
        Returns: Json
      }
      admin_delete_company_domain: {
        Args: { p_company_id: string; p_domain: string }
        Returns: undefined
      }
      admin_delete_order_review: {
        Args: { p_review_id: string }
        Returns: Json
      }
      admin_finance_kpis: {
        Args: {
          p_company_id?: string
          p_from_date?: string
          p_to_date?: string
        }
        Returns: Json
      }
      admin_finance_transactions: {
        Args: {
          p_company_id?: string
          p_from_date?: string
          p_limit?: number
          p_offset?: number
          p_to_date?: string
        }
        Returns: Json
      }
      admin_get_general_settings: { Args: never; Returns: Json }
      admin_get_mode_resolution_settings: { Args: never; Returns: Json }
      admin_get_payment_routing_defaults: { Args: never; Returns: Json }
      admin_invite_global_driver: {
        Args: { p_email: string; p_full_name?: string }
        Returns: Json
      }
      admin_invite_manager: {
        Args: { p_email: string; p_full_name?: string }
        Returns: Json
      }
      admin_list_company_domains: {
        Args: { p_company_id: string }
        Returns: {
          company_id: string
          created_at: string
          domain: string
          id: string
          is_primary: boolean
          updated_at: string
          verified_at: string
        }[]
      }
      admin_list_discovery_categories: { Args: never; Returns: Json }
      admin_list_global_drivers: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_status?: string
        }
        Returns: Json[]
      }
      admin_list_managers: {
        Args: { p_limit?: number; p_offset?: number; p_search?: string }
        Returns: Json[]
      }
      admin_list_order_reviews: {
        Args: {
          p_company_id?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
        }
        Returns: Json
      }
      admin_list_pages: {
        Args: never
        Returns: {
          content: string
          created_at: string | null
          id: number
          show_as_link: boolean
          title: string
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "pages"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_list_plan_catalog: {
        Args: never
        Returns: {
          code: string
          created_at: string
          currency: string
          features: Json
          id: string
          is_active: boolean
          name: string
          period: string
          price: number
          trial_days: number
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "plan_catalog"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_list_translations: {
        Args: { p_group_name?: string; p_language_id?: number }
        Returns: {
          created_at: string | null
          group_name: string | null
          id: number
          key: string
          language_id: number
          updated_at: string | null
          value: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "translations"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_list_vehicle_suggestions: {
        Args: { p_status?: string }
        Returns: {
          approved_make_id: number | null
          approved_model_id: number | null
          company_id: string | null
          created_at: string
          id: string
          normalized_make: string | null
          normalized_model: string | null
          order_id: string | null
          raw_color: string | null
          raw_make: string
          raw_model: string
          review_note: string | null
          reviewed_by: string | null
          source: string
          status: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "vehicle_suggestion_queue"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_reorder_discovery_categories: {
        Args: { p_category_ids?: string[] }
        Returns: Json
      }
      admin_review_pickup_vehicle_suggestion: {
        Args: { p_action: string; p_note?: string; p_suggestion_id: string }
        Returns: Json
      }
      admin_set_global_driver_status: {
        Args: { p_status: string; p_user_id: string }
        Returns: Json
      }
      admin_set_manager_companies: {
        Args: { p_company_ids?: string[]; p_manager_user_id: string }
        Returns: Json
      }
      admin_toggle_discovery_category: {
        Args: { p_id: string; p_is_active: boolean }
        Returns: Json
      }
      admin_toggle_plan_catalog: {
        Args: { p_is_active: boolean; p_plan_id: string }
        Returns: Json
      }
      admin_update_general_settings: {
        Args: { p_settings: Json }
        Returns: Json
      }
      admin_update_mode_resolution_settings: {
        Args: { p_settings: Json }
        Returns: undefined
      }
      admin_update_payment_routing_defaults: {
        Args: { p_settings: Json }
        Returns: undefined
      }
      admin_upsert_company_domain: {
        Args: {
          p_company_id: string
          p_domain: string
          p_is_primary: boolean
          p_mark_verified?: boolean
        }
        Returns: string
      }
      admin_upsert_discovery_category: {
        Args: {
          p_icon_key?: string
          p_id?: string
          p_is_active?: boolean
          p_name?: string
          p_slug?: string
        }
        Returns: Json
      }
      admin_upsert_page: {
        Args: {
          p_content?: string
          p_id?: number
          p_show_as_link?: boolean
          p_title?: string
        }
        Returns: Json
      }
      admin_upsert_plan_catalog: { Args: { p_payload: Json }; Returns: Json }
      admin_upsert_translation: {
        Args: {
          p_group_name?: string
          p_id?: number
          p_key?: string
          p_language_id?: number
          p_value?: string
        }
        Returns: Json
      }
      admin_upsert_vehicle_make: { Args: { p_name: string }; Returns: Json }
      admin_upsert_vehicle_model: {
        Args: { p_make_id: number; p_name: string }
        Returns: Json
      }
      api_v2_client_create_address: {
        Args: { p_address: string; p_lat: number; p_lng: number }
        Returns: Json
      }
      api_v2_client_create_order: { Args: { p_payload: Json }; Returns: Json }
      api_v2_client_delete_address: {
        Args: { p_address_id: string }
        Returns: Json
      }
      api_v2_client_get_addresses: { Args: never; Returns: Json[] }
      api_v2_client_get_delivery_fee: {
        Args: { p_address_id: string; p_company_id: string }
        Returns: Json
      }
      api_v2_client_get_orders: { Args: never; Returns: Json[] }
      api_v2_client_get_vendor_hours: {
        Args: { p_company_id: string }
        Returns: Json[]
      }
      api_v2_client_get_vendor_items: {
        Args: { p_company_id: string }
        Returns: Json[]
      }
      api_v2_client_get_vendors: { Args: never; Returns: Json[] }
      api_v2_client_read_notifications: { Args: never; Returns: Json }
      api_v2_driver_accept_order: {
        Args: { p_order_id: string }
        Returns: Json
      }
      api_v2_driver_get_earnings: { Args: never; Returns: Json }
      api_v2_driver_get_history: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: Json
      }
      api_v2_driver_get_order: { Args: { p_order_id: string }; Returns: Json }
      api_v2_driver_get_orders: { Args: never; Returns: Json[] }
      api_v2_driver_get_orders_nearby: {
        Args: { p_lat: number; p_lng: number }
        Returns: Json[]
      }
      api_v2_driver_get_profile: { Args: never; Returns: Json }
      api_v2_driver_reject_order: {
        Args: { p_order_id: string }
        Returns: Json
      }
      api_v2_driver_set_delivery_price: {
        Args: { p_order_id: string; p_price: number }
        Returns: Json
      }
      api_v2_driver_set_online: {
        Args: { p_is_online: boolean }
        Returns: Json
      }
      api_v2_driver_update_location: {
        Args: { p_lat: number; p_lng: number }
        Returns: Json
      }
      api_v2_driver_update_order_status: {
        Args: { p_order_id: string; p_status_alias: string }
        Returns: Json
      }
      api_v2_is_driver: { Args: never; Returns: boolean }
      api_v2_vendor_accept_order: {
        Args: { p_order_id: string }
        Returns: Json
      }
      api_v2_vendor_get_earnings: {
        Args: { p_company_id: string }
        Returns: Json
      }
      api_v2_vendor_get_order: { Args: { p_order_id: string }; Returns: Json }
      api_v2_vendor_get_orders: {
        Args: { p_company_id: string }
        Returns: Json[]
      }
      api_v2_vendor_reject_order: {
        Args: { p_order_id: string }
        Returns: Json
      }
      api_v2_vendor_update_order_status: {
        Args: { p_order_id: string; p_status_alias: string }
        Returns: Json
      }
      assign_order_to_driver: { Args: { p_order_id: string }; Returns: Json }
      auth_get_effective_session_context: { Args: never; Returns: Json }
      auth_start_impersonation: {
        Args: { p_reason?: string; p_target_company_id: string }
        Returns: Json
      }
      auth_stop_impersonation: { Args: never; Returns: Json }
      claim_my_driver_invites: { Args: never; Returns: Json }
      claim_my_team_invites: { Args: never; Returns: Json }
      client_list_my_order_reviews: { Args: never; Returns: Json }
      create_cart_session: {
        Args: { p_company_id: string; p_tid?: string }
        Returns: string
      }
      create_order_from_cart: {
        Args: {
          p_cart_session_id: string
          p_customer_name?: string
          p_customer_phone?: string
          p_delivery_address?: string
          p_delivery_fee?: number
          p_delivery_lat?: number
          p_delivery_lng?: number
          p_expedition_type?: string
          p_notes?: string
          p_payment_method?: string
          p_pickup_color?: string
          p_pickup_make?: string
          p_pickup_model?: string
          p_pickup_plate?: string
          p_pickup_vehicle_source?: string
        }
        Returns: Json
      }
      current_auth_email: { Args: never; Returns: string }
      driver_has_active_company_membership: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      driver_has_active_delivery: {
        Args: { p_ignore_order_id?: string; p_user_id: string }
        Returns: boolean
      }
      driver_is_active: { Args: { p_user_id?: string }; Returns: boolean }
      driver_update_order_status: {
        Args: { p_new_status: string; p_order_id: string }
        Returns: Json
      }
      find_nearby_restaurants: {
        Args: { p_lat: number; p_lng: number; p_radius_km?: number }
        Returns: {
          address: string
          cheapest_delivery_fee: number
          cover_url: string
          delivery_min_order: number
          delivery_zone_count: number
          distance_km: number
          has_free_delivery: boolean
          id: string
          logo_url: string
          name: string
          phone: string
          slug: string
          today_close_time: string
          today_is_closed: boolean
          today_open_time: string
          user_covered: boolean
          user_zone_fee: number
          user_zone_min_order: number
          weekly_hours: Json
        }[]
      }
      get_cart: { Args: { p_cart_id: string }; Returns: Json }
      get_company_drivers: { Args: { p_company_id: string }; Returns: Json }
      get_company_drivers_full: {
        Args: { p_company_id: string }
        Returns: Json
      }
      get_delivery_fee: {
        Args: { p_company_id: string; p_lat: number; p_lng: number }
        Returns: {
          delivery_fee: number
          distance_km: number
          min_order: number
          zone_name: string
        }[]
      }
      get_driver_active_order: { Args: never; Returns: Json }
      get_driver_available_orders: { Args: never; Returns: Json }
      get_driver_order_history: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: Json
      }
      get_general_settings_public: { Args: never; Returns: Json }
      get_live_board_orders: { Args: { p_company_id: string }; Returns: Json }
      get_order_details: { Args: { p_order_id: string }; Returns: Json }
      get_pickup_vehicle_checkout_config: { Args: never; Returns: Json }
      get_public_order_details: { Args: { p_order_id: string }; Returns: Json }
      get_storefront_payload: {
        Args: { p_slug: string; p_tid?: string }
        Returns: Json
      }
      get_storefront_payload_for_request: {
        Args: { p_hostname?: string; p_slug?: string; p_tid?: string }
        Returns: Json
      }
      internal_company_setup_status: {
        Args: { p_company_id: string }
        Returns: Json
      }
      internal_resolve_order_payment_routing: {
        Args: { p_company_id: string; p_payment_method: string }
        Returns: Json
      }
      is_admin: { Args: never; Returns: boolean }
      kds_update_item_status: {
        Args: { p_company_id: string; p_is_done: boolean; p_item_id: string }
        Returns: Json
      }
      kds_update_order_status: {
        Args: { p_company_id: string; p_is_done: boolean; p_order_id: string }
        Returns: Json
      }
      manager_list_companies: { Args: never; Returns: Json[] }
      owner_analytics_summary: {
        Args: { p_company_id: string; p_from?: string; p_to?: string }
        Returns: Json
      }
      owner_analytics_timeseries: {
        Args: { p_company_id: string; p_from?: string; p_to?: string }
        Returns: Json
      }
      owner_analytics_top_items: {
        Args: {
          p_company_id: string
          p_from?: string
          p_limit?: number
          p_to?: string
        }
        Returns: Json
      }
      owner_assign_driver: {
        Args: { p_driver_user_id: string; p_order_id: string }
        Returns: Json
      }
      owner_assign_reservation_table: {
        Args: { p_reservation_id: string; p_table_id: string }
        Returns: Json
      }
      owner_complete_setup: { Args: { payload: Json }; Returns: Json }
      owner_create_reservation: {
        Args: {
          p_company_id: string
          p_customer_name: string
          p_customer_phone?: string
          p_guest_count?: number
          p_notes?: string
          p_reservation_at?: string
          p_table_id?: string
        }
        Returns: Json
      }
      owner_dashboard_summary: {
        Args: { p_company_id?: string }
        Returns: Json
      }
      owner_delete_company_banner: {
        Args: { p_banner_id: string; p_company_id: string }
        Returns: Json
      }
      owner_delete_company_photo: {
        Args: { p_company_id: string; p_photo_id: string }
        Returns: Json
      }
      owner_delete_item_extra: {
        Args: { p_company_id: string; p_extra_id: string; p_item_id: string }
        Returns: Json
      }
      owner_delete_item_option: {
        Args: { p_company_id: string; p_item_id: string; p_option_id: string }
        Returns: Json
      }
      owner_delete_item_variant: {
        Args: { p_company_id: string; p_item_id: string; p_variant_id: string }
        Returns: Json
      }
      owner_delete_photo_album: {
        Args: { p_album_id: string; p_company_id: string }
        Returns: Json
      }
      owner_export_report: {
        Args: {
          p_company_id: string
          p_from?: string
          p_report_type: string
          p_to?: string
        }
        Returns: Json
      }
      owner_get_company_discovery_categories: {
        Args: { p_company_id: string }
        Returns: Json
      }
      owner_get_company_payment_routing: {
        Args: { p_company_id: string }
        Returns: Json
      }
      owner_get_item_builder_payload: {
        Args: { p_company_id: string; p_item_id?: string }
        Returns: Json
      }
      owner_get_qr_payload: { Args: { p_company_id: string }; Returns: Json }
      owner_get_reservation: {
        Args: { p_reservation_id: string }
        Returns: Json
      }
      owner_get_setup_status: { Args: { p_company_id?: string }; Returns: Json }
      owner_get_storefront_presentation: {
        Args: { p_company_id: string }
        Returns: Json
      }
      owner_import_items_bulk: {
        Args: { p_company_id: string; p_rows: Json }
        Returns: Json
      }
      owner_invite_company_driver: {
        Args: { p_company_id: string; p_email: string; p_full_name?: string }
        Returns: Json
      }
      owner_invite_staff: {
        Args: { p_company_id: string; p_email: string; p_full_name?: string }
        Returns: Json
      }
      owner_list_assignable_drivers: {
        Args: { p_company_id: string }
        Returns: Json[]
      }
      owner_list_categories_with_discovery: {
        Args: { p_company_id: string }
        Returns: Json
      }
      owner_list_company_drivers: {
        Args: { p_company_id: string }
        Returns: Json[]
      }
      owner_list_order_reviews: {
        Args: {
          p_company_id: string
          p_from?: string
          p_limit?: number
          p_offset?: number
          p_to?: string
        }
        Returns: Json
      }
      owner_list_reservations: {
        Args: {
          p_company_id: string
          p_from?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_status?: string
          p_to?: string
        }
        Returns: Json
      }
      owner_list_staff: { Args: { p_company_id: string }; Returns: Json[] }
      owner_pos_close_visit: { Args: { p_visit_id: string }; Returns: Json }
      owner_pos_create_order: {
        Args: {
          p_company_id: string
          p_items: Json
          p_notes?: string
          p_visit_id: string
        }
        Returns: Json
      }
      owner_pos_floor_snapshot: {
        Args: { p_company_id: string }
        Returns: Json
      }
      owner_pos_move_visit: {
        Args: { p_new_table_id: string; p_visit_id: string }
        Returns: Json
      }
      owner_pos_open_visit: {
        Args: {
          p_company_id: string
          p_guest_count?: number
          p_name: string
          p_phone?: string
          p_table_id: string
        }
        Returns: Json
      }
      owner_pos_resolve_call_waiter: {
        Args: { p_call_id: string; p_status?: string }
        Returns: Json
      }
      owner_recent_orders: {
        Args: { p_company_id?: string; p_limit?: number }
        Returns: {
          created_at: string
          grand_total: number
          id: string
          status_alias: string
          vendor_order_number: number
        }[]
      }
      owner_remove_company_driver: {
        Args: { p_company_id: string; p_user_id: string }
        Returns: Json
      }
      owner_remove_staff: {
        Args: { p_company_id: string; p_user_id: string }
        Returns: Json
      }
      owner_reorder_categories: {
        Args: { p_category_ids: string[]; p_company_id: string }
        Returns: Json
      }
      owner_reorder_company_banners: {
        Args: { p_banner_ids: string[]; p_company_id: string }
        Returns: Json
      }
      owner_reorder_company_photos: {
        Args: { p_company_id: string; p_photo_ids: string[] }
        Returns: Json
      }
      owner_reorder_items: {
        Args: {
          p_category_id: string
          p_company_id: string
          p_item_ids: string[]
        }
        Returns: Json
      }
      owner_reorder_photo_albums: {
        Args: { p_album_ids: string[]; p_company_id: string }
        Returns: Json
      }
      owner_set_company_discovery_categories: {
        Args: { p_category_ids?: string[]; p_company_id: string }
        Returns: Json
      }
      owner_set_item_allergens: {
        Args: {
          p_allergen_ids?: string[]
          p_company_id: string
          p_item_id: string
        }
        Returns: Json
      }
      owner_set_variant_extras: {
        Args: {
          p_company_id: string
          p_extra_ids?: string[]
          p_item_id: string
          p_variant_id: string
        }
        Returns: Json
      }
      owner_submit_pickup_vehicle_suggestion: {
        Args: { p_company_id: string; p_make: string; p_model: string }
        Returns: Json
      }
      owner_toggle_category_active: {
        Args: {
          p_category_id: string
          p_company_id: string
          p_is_active: boolean
        }
        Returns: Json
      }
      owner_update_company_general_settings: {
        Args: {
          p_address: string
          p_company_id: string
          p_company_name: string
          p_currency: string
          p_phone: string
          p_timezone: string
        }
        Returns: Json
      }
      owner_update_company_payment_routing: {
        Args: {
          p_accepts_cash?: boolean
          p_accepts_online?: boolean
          p_company_id: string
          p_funds_routing_mode: string
          p_payment_provider: string
          p_provider_account_ref?: string
          p_provider_config?: Json
        }
        Returns: undefined
      }
      owner_update_reservation_status: {
        Args: {
          p_new_status: string
          p_note?: string
          p_reservation_id: string
        }
        Returns: Json
      }
      owner_update_storefront_presentation: {
        Args: {
          p_company_id: string
          p_design_key: string
          p_social_links?: Json
        }
        Returns: Json
      }
      owner_upsert_category: {
        Args: {
          p_company_id: string
          p_description?: string
          p_discovery_category_ids?: string[]
          p_id?: string
          p_name?: string
        }
        Returns: Json
      }
      owner_upsert_company_banner: {
        Args: {
          p_active_from?: string
          p_active_to?: string
          p_banner_id?: string
          p_company_id: string
          p_image_url?: string
          p_order_index?: number
          p_title?: string
        }
        Returns: Json
      }
      owner_upsert_company_photo: {
        Args: {
          p_album_id?: string
          p_company_id: string
          p_order_index?: number
          p_photo_id?: string
          p_photo_url?: string
          p_title?: string
        }
        Returns: Json
      }
      owner_upsert_item_extra: {
        Args: {
          p_company_id: string
          p_extra_id?: string
          p_is_active?: boolean
          p_item_id: string
          p_name?: string
          p_price?: number
        }
        Returns: Json
      }
      owner_upsert_item_option: {
        Args: {
          p_company_id: string
          p_item_id: string
          p_name?: string
          p_option_id?: string
        }
        Returns: Json
      }
      owner_upsert_item_variant: {
        Args: {
          p_company_id: string
          p_is_default?: boolean
          p_item_id: string
          p_name?: string
          p_option_id?: string
          p_price_delta?: number
          p_variant_id?: string
        }
        Returns: Json
      }
      owner_upsert_photo_album: {
        Args: {
          p_album_id?: string
          p_company_id: string
          p_name?: string
          p_order_index?: number
        }
        Returns: Json
      }
      payment_router_get_order_for_session: {
        Args: { p_cart_session_id: string; p_order_id: string }
        Returns: Json
      }
      payment_router_get_routing_secrets: {
        Args: { p_order_id: string }
        Returns: Json
      }
      public_call_waiter: {
        Args: {
          p_note?: string
          p_slug: string
          p_tid: string
          p_visit_id?: string
        }
        Returns: Json
      }
      public_create_reservation: {
        Args: {
          p_customer_name: string
          p_customer_phone?: string
          p_guest_count?: number
          p_notes?: string
          p_reservation_at?: string
          p_slug: string
          p_table_id?: string
        }
        Returns: Json
      }
      public_discover_restaurants: {
        Args: {
          p_category_ids?: string[]
          p_lat?: number
          p_limit?: number
          p_lng?: number
          p_offset?: number
          p_query?: string
          p_radius_km?: number
          p_service?: string
        }
        Returns: Json
      }
      public_get_checkout_payment_options: {
        Args: { p_company_id: string }
        Returns: Json
      }
      public_get_driver_invite: { Args: { p_token: string }; Returns: Json }
      public_get_mode_resolution_config: { Args: never; Returns: Json }
      public_get_order_review_state: {
        Args: { p_cart_session_id?: string; p_order_id: string }
        Returns: Json
      }
      public_get_team_invite: {
        Args: { p_role: string; p_token: string }
        Returns: Json
      }
      public_list_discovery_categories: { Args: never; Returns: Json }
      public_submit_order_review: {
        Args: {
          p_cart_session_id?: string
          p_comment?: string
          p_order_id: string
          p_rating: number
        }
        Returns: Json
      }
      remove_cart_item: { Args: { p_cart_item_id: string }; Returns: undefined }
      remove_company_driver: {
        Args: { p_company_id: string; p_user_id: string }
        Returns: Json
      }
      resolve_company_slug_for_request: {
        Args: { p_hostname: string; p_slug?: string }
        Returns: Json
      }
      resolve_order_payment_routing: {
        Args: { p_company_id: string; p_payment_method: string }
        Returns: Json
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      submit_pickup_vehicle_suggestion: {
        Args: { p_order_id: string }
        Returns: Json
      }
      update_cart_item_quantity: {
        Args: { p_cart_item_id: string; p_quantity: number }
        Returns: undefined
      }
      update_order_status: {
        Args: { p_comment?: string; p_new_alias: string; p_order_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
