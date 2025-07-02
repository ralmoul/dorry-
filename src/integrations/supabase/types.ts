export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          session_token: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          session_token: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          session_token?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_reports: {
        Row: {
          audit_date: string
          audit_period_end: string
          audit_period_start: string
          compliance_score: number
          consents_given: number
          consents_refused: number
          created_at: string
          generated_by: string | null
          id: string
          issues_found: Json
          recommendations: Json
          total_consents: number
          updated_at: string
        }
        Insert: {
          audit_date: string
          audit_period_end: string
          audit_period_start: string
          compliance_score?: number
          consents_given?: number
          consents_refused?: number
          created_at?: string
          generated_by?: string | null
          id?: string
          issues_found?: Json
          recommendations?: Json
          total_consents?: number
          updated_at?: string
        }
        Update: {
          audit_date?: string
          audit_period_end?: string
          audit_period_start?: string
          compliance_score?: number
          consents_given?: number
          consents_refused?: number
          created_at?: string
          generated_by?: string | null
          id?: string
          issues_found?: Json
          recommendations?: Json
          total_consents?: number
          updated_at?: string
        }
        Relationships: []
      }
      cleanup_history: {
        Row: {
          created_at: string | null
          error_message: string | null
          execution_date: string | null
          execution_duration_ms: number | null
          id: string
          records_cleaned: Json | null
          status: string
          triggered_by: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          execution_date?: string | null
          execution_duration_ms?: number | null
          id?: string
          records_cleaned?: Json | null
          status: string
          triggered_by?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          execution_date?: string | null
          execution_duration_ms?: number | null
          id?: string
          records_cleaned?: Json | null
          status?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      consent_logs: {
        Row: {
          consent_given: boolean
          consent_type: string
          created_at: string
          device_info: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          consent_given: boolean
          consent_type?: string
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          consent_given?: boolean
          consent_type?: string
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      conversations_v2: {
        Row: {
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          blocked_until: string | null
          created_at: string | null
          email: string
          failed_attempts: number | null
          id: string
          ip_address: unknown
          last_attempt_at: string | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string | null
          email: string
          failed_attempts?: number | null
          id?: string
          ip_address: unknown
          last_attempt_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          blocked_until?: string | null
          created_at?: string | null
          email?: string
          failed_attempts?: number | null
          id?: string
          ip_address?: unknown
          last_attempt_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      messages_v2: {
        Row: {
          audio_data: string | null
          content: string | null
          conversation_id: string | null
          created_at: string | null
          duration: string | null
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          audio_data?: string | null
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          duration?: string | null
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          audio_data?: string | null
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          duration?: string | null
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_v2_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          purpose: string
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          purpose: string
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          purpose?: string
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string
          created_at: string
          email: string
          first_name: string
          id: string
          is_approved: boolean
          last_name: string
          personnalite: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          first_name: string
          id: string
          is_approved?: boolean
          last_name: string
          personnalite?: string | null
          phone: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_approved?: boolean
          last_name?: string
          personnalite?: string | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles_v2: {
        Row: {
          analytics_consent: boolean | null
          company: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          marketing_consent: boolean | null
          phone: string | null
          plan_type: string | null
          plan_updated_at: string | null
          updated_at: string | null
        }
        Insert: {
          analytics_consent?: boolean | null
          company?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          marketing_consent?: boolean | null
          phone?: string | null
          plan_type?: string | null
          plan_updated_at?: string | null
          updated_at?: string | null
        }
        Update: {
          analytics_consent?: boolean | null
          company?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          marketing_consent?: boolean | null
          phone?: string | null
          plan_type?: string | null
          plan_updated_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recordings: {
        Row: {
          audio_url: string | null
          created_at: string | null
          duration: number | null
          id: string
          title: string
          transcript: string | null
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          title: string
          transcript?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          title?: string
          transcript?: string | null
          user_id?: string
        }
        Relationships: []
      }
      recordings_v2: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          duration: number | null
          file_url: string | null
          id: string
          title: string
          transcript: string | null
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          duration?: number | null
          file_url?: string | null
          id?: string
          title: string
          transcript?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          duration?: number | null
          file_url?: string | null
          id?: string
          title?: string
          transcript?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recordings_v2_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_mfa_settings: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          mfa_enabled: boolean | null
          mfa_method: string | null
          phone_number: string | null
          totp_secret: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          mfa_enabled?: boolean | null
          mfa_method?: string | null
          phone_number?: string | null
          totp_secret?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          mfa_enabled?: boolean | null
          mfa_method?: string | null
          phone_number?: string | null
          totp_secret?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          analytics_consent: boolean | null
          company: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          marketing_consent: boolean | null
          phone: string | null
          plan_expires_at: string | null
          selected_plan: string | null
          updated_at: string | null
        }
        Insert: {
          analytics_consent?: boolean | null
          company?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          marketing_consent?: boolean | null
          phone?: string | null
          plan_expires_at?: string | null
          selected_plan?: string | null
          updated_at?: string | null
        }
        Update: {
          analytics_consent?: boolean | null
          company?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          marketing_consent?: boolean | null
          phone?: string | null
          plan_expires_at?: string | null
          selected_plan?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_stats_v2: {
        Row: {
          id: string
          messages_count: number | null
          recordings_count: number | null
          seconds_used: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          messages_count?: number | null
          recordings_count?: number | null
          seconds_used?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          messages_count?: number | null
          recordings_count?: number | null
          seconds_used?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_v2_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      users_v2: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          plan: string | null
          profile_photo: string | null
          stats: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          plan?: string | null
          profile_photo?: string | null
          stats?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          plan?: string | null
          profile_photo?: string | null
          stats?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      v2_activity_logs: {
        Row: {
          action: string
          country_code: string | null
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          country_code?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          country_code?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "v2_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v2_users"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_calendar_events: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          description: string | null
          detected_entities: Json | null
          end_time: string | null
          external_event_id: string | null
          id: string
          location: string | null
          provider: string | null
          recording_id: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          description?: string | null
          detected_entities?: Json | null
          end_time?: string | null
          external_event_id?: string | null
          id?: string
          location?: string | null
          provider?: string | null
          recording_id?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          description?: string | null
          detected_entities?: Json | null
          end_time?: string | null
          external_event_id?: string | null
          id?: string
          location?: string | null
          provider?: string | null
          recording_id?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "v2_calendar_events_recording_id_fkey"
            columns: ["recording_id"]
            isOneToOne: false
            referencedRelation: "v2_recordings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "v2_calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v2_users"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_calendar_integrations: {
        Row: {
          access_token: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          provider: string
          provider_email: string | null
          provider_user_id: string | null
          refresh_token: string | null
          scope: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          provider: string
          provider_email?: string | null
          provider_user_id?: string | null
          refresh_token?: string | null
          scope?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          provider?: string
          provider_email?: string | null
          provider_user_id?: string | null
          refresh_token?: string | null
          scope?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "v2_calendar_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v2_users"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_daily_analytics: {
        Row: {
          active_minutes: number | null
          created_at: string | null
          date: string
          id: string
          recordings_count: number | null
          session_duration: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_minutes?: number | null
          created_at?: string | null
          date: string
          id?: string
          recordings_count?: number | null
          session_duration?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_minutes?: number | null
          created_at?: string | null
          date?: string
          id?: string
          recordings_count?: number | null
          session_duration?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "v2_daily_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v2_users"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_gdpr_requests: {
        Row: {
          created_at: string | null
          id: string
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          request_type: string
          response_data: Json | null
          specific_data: Json | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          request_type: string
          response_data?: Json | null
          specific_data?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          request_type?: string
          response_data?: Json | null
          specific_data?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "v2_gdpr_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v2_users"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          read_at: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          read_at?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          read_at?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "v2_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v2_users"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_recordings: {
        Row: {
          ai_analysis: Json | null
          consent_for_analysis: boolean | null
          created_at: string | null
          device_info: Json | null
          duration: number
          entities: Json | null
          file_size: number | null
          file_url: string | null
          id: string
          is_archived: boolean | null
          is_deleted: boolean | null
          keywords: string[] | null
          quality_score: number | null
          recorded_ip: unknown | null
          summary: string | null
          transcript: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          consent_for_analysis?: boolean | null
          created_at?: string | null
          device_info?: Json | null
          duration: number
          entities?: Json | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_archived?: boolean | null
          is_deleted?: boolean | null
          keywords?: string[] | null
          quality_score?: number | null
          recorded_ip?: unknown | null
          summary?: string | null
          transcript?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          consent_for_analysis?: boolean | null
          created_at?: string | null
          device_info?: Json | null
          duration?: number
          entities?: Json | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_archived?: boolean | null
          is_deleted?: boolean | null
          keywords?: string[] | null
          quality_score?: number | null
          recorded_ip?: unknown | null
          summary?: string | null
          transcript?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "v2_recordings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v2_users"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          next_billing_date: string | null
          plan: string
          plan_name: string
          quota_limit: number
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          next_billing_date?: string | null
          plan: string
          plan_name: string
          quota_limit: number
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          next_billing_date?: string | null
          plan?: string
          plan_name?: string
          quota_limit?: number
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "v2_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v2_users"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_user_sessions: {
        Row: {
          country_code: string | null
          created_at: string | null
          device_fingerprint: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          country_code?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "v2_user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v2_users"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_user_stats: {
        Row: {
          created_at: string | null
          current_month: number
          current_year: number
          id: string
          last_activity: string | null
          last_reset: string | null
          recordings_count: number | null
          seconds_used: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_month: number
          current_year: number
          id?: string
          last_activity?: string | null
          last_reset?: string | null
          recordings_count?: number | null
          seconds_used?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_month?: number
          current_year?: number
          id?: string
          last_activity?: string | null
          last_reset?: string | null
          recordings_count?: number | null
          seconds_used?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "v2_user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v2_users"
            referencedColumns: ["id"]
          },
        ]
      }
      v2_users: {
        Row: {
          account_status: string | null
          calendar_connections: Json | null
          cookies_consent: boolean | null
          country_code: string | null
          created_at: string | null
          data_processing_consent: boolean | null
          email: string
          email_verified: boolean | null
          gdpr_consent_date: string | null
          id: string
          last_activity: string | null
          last_login: string | null
          marketing_consent: boolean | null
          nom: string
          password_hash: string
          plan: string | null
          prenom: string
          quota_limit: number | null
          quota_used: number | null
          registration_ip: unknown | null
          sync_date: string | null
          synced_from_site: string | null
          telephone: string | null
          updated_at: string | null
        }
        Insert: {
          account_status?: string | null
          calendar_connections?: Json | null
          cookies_consent?: boolean | null
          country_code?: string | null
          created_at?: string | null
          data_processing_consent?: boolean | null
          email: string
          email_verified?: boolean | null
          gdpr_consent_date?: string | null
          id?: string
          last_activity?: string | null
          last_login?: string | null
          marketing_consent?: boolean | null
          nom: string
          password_hash: string
          plan?: string | null
          prenom: string
          quota_limit?: number | null
          quota_used?: number | null
          registration_ip?: unknown | null
          sync_date?: string | null
          synced_from_site?: string | null
          telephone?: string | null
          updated_at?: string | null
        }
        Update: {
          account_status?: string | null
          calendar_connections?: Json | null
          cookies_consent?: boolean | null
          country_code?: string | null
          created_at?: string | null
          data_processing_consent?: boolean | null
          email?: string
          email_verified?: boolean | null
          gdpr_consent_date?: string | null
          id?: string
          last_activity?: string | null
          last_login?: string | null
          marketing_consent?: boolean | null
          nom?: string
          password_hash?: string
          plan?: string | null
          prenom?: string
          quota_limit?: number | null
          quota_used?: number | null
          registration_ip?: unknown | null
          sync_date?: string | null
          synced_from_site?: string | null
          telephone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      voice_recordings: {
        Row: {
          blob_data: string
          blob_type: string
          created_at: string
          duration: number
          id: string
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          blob_data: string
          blob_type: string
          created_at?: string
          duration: number
          id?: string
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          blob_data?: string
          blob_type?: string
          created_at?: string
          duration?: number
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_user_profile: {
        Args: { user_id: string }
        Returns: undefined
      }
      cleanup_expired_security_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_admin_session: {
        Args: { password_input: string; client_user_agent?: string }
        Returns: {
          success: boolean
          session_token: string
          expires_at: string
        }[]
      }
      get_audit_history: {
        Args: { limit_count?: number; offset_count?: number }
        Returns: {
          id: string
          audit_date: string
          total_consents: number
          consents_given: number
          consents_refused: number
          compliance_score: number
          issues_found: Json
          recommendations: Json
          audit_period_start: string
          audit_period_end: string
          created_at: string
        }[]
      }
      get_cleanup_history: {
        Args: { limit_count?: number }
        Returns: {
          id: string
          execution_date: string
          status: string
          records_cleaned: Json
          error_message: string
          execution_duration_ms: number
          triggered_by: string
        }[]
      }
      invalidate_admin_session: {
        Args: { token: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      reject_user_profile: {
        Args: { user_id: string }
        Returns: undefined
      }
      rgpd_delete_user_complete: {
        Args: {
          target_user_id: string
          target_user_email: string
          admin_ip?: unknown
          admin_user_agent?: string
          export_json?: Json
        }
        Returns: undefined
      }
      verify_admin_password: {
        Args: { password_input: string }
        Returns: boolean
      }
      verify_admin_session: {
        Args: { token: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
