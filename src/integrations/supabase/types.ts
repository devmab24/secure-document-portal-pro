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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          metadata: Json | null
          target_id: string | null
          target_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      department_units: {
        Row: {
          code: string | null
          created_at: string | null
          department_id: string
          description: string | null
          head_user_id: string | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          staff_count: number | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          department_id: string
          description?: string | null
          head_user_id?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          staff_count?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          department_id?: string
          description?: string | null
          head_user_id?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          staff_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "department_units_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_units_head_user_id_fkey"
            columns: ["head_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string | null
          created_at: string | null
          description: string | null
          head_user_id: string | null
          id: string
          is_active: boolean | null
          level: number | null
          location: string | null
          name: string
          parent_id: string | null
          service_type: Database["public"]["Enums"]["service_type"] | null
          staff_count: number | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          head_user_id?: string | null
          id?: string
          is_active?: boolean | null
          level?: number | null
          location?: string | null
          name: string
          parent_id?: string | null
          service_type?: Database["public"]["Enums"]["service_type"] | null
          staff_count?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          head_user_id?: string | null
          id?: string
          is_active?: boolean | null
          level?: number | null
          location?: string | null
          name?: string
          parent_id?: string | null
          service_type?: Database["public"]["Enums"]["service_type"] | null
          staff_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_head_user_id_fkey"
            columns: ["head_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_signatures: {
        Row: {
          document_id: string | null
          id: string
          signature_image: string | null
          signed_at: string | null
          user_id: string | null
        }
        Insert: {
          document_id?: string | null
          id?: string
          signature_image?: string | null
          signed_at?: string | null
          user_id?: string | null
        }
        Update: {
          document_id?: string | null
          id?: string
          signature_image?: string | null
          signed_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_signatures_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "digital_signatures_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_access_log: {
        Row: {
          access_timestamp: string | null
          access_type: string
          document_id: string | null
          id: string
          ip_address: string | null
          notes: string | null
          user_id: string | null
        }
        Insert: {
          access_timestamp?: string | null
          access_type: string
          document_id?: string | null
          id?: string
          ip_address?: string | null
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          access_timestamp?: string | null
          access_type?: string
          document_id?: string | null
          id?: string
          ip_address?: string | null
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_access_log_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_access_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_comments: {
        Row: {
          comment: string
          created_at: string | null
          document_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_requests: {
        Row: {
          access_duration_days: number | null
          approved_at: string | null
          approver_id: string | null
          document_id: string | null
          id: string
          rejection_reason: string | null
          request_reason: string
          request_status: string | null
          requested_at: string | null
          requester_id: string | null
        }
        Insert: {
          access_duration_days?: number | null
          approved_at?: string | null
          approver_id?: string | null
          document_id?: string | null
          id?: string
          rejection_reason?: string | null
          request_reason: string
          request_status?: string | null
          requested_at?: string | null
          requester_id?: string | null
        }
        Update: {
          access_duration_days?: number | null
          approved_at?: string | null
          approver_id?: string | null
          document_id?: string | null
          id?: string
          rejection_reason?: string | null
          request_reason?: string
          request_status?: string | null
          requested_at?: string | null
          requester_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_shares: {
        Row: {
          acknowledged_at: string | null
          document_id: string | null
          feedback: string | null
          from_user_id: string | null
          id: string
          received_at: string | null
          seen_at: string | null
          shared_at: string | null
          status: string | null
          to_department: string | null
          to_user_id: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          document_id?: string | null
          feedback?: string | null
          from_user_id?: string | null
          id?: string
          received_at?: string | null
          seen_at?: string | null
          shared_at?: string | null
          status?: string | null
          to_department?: string | null
          to_user_id?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          document_id?: string | null
          feedback?: string | null
          from_user_id?: string | null
          id?: string
          received_at?: string | null
          seen_at?: string | null
          shared_at?: string | null
          status?: string | null
          to_department?: string | null
          to_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_shares_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_shares_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_shares_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          created_at: string | null
          document_id: string | null
          file_url: string | null
          id: string
          version_number: number | null
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          file_url?: string | null
          id?: string
          version_number?: number | null
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          file_url?: string | null
          id?: string
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          approval_chain: string[] | null
          approval_required: boolean | null
          assigned_to: string | null
          board_restricted: boolean | null
          confidentiality_level: string | null
          created_at: string | null
          created_by: string | null
          current_approver: string | null
          description: string | null
          disposal_status: string | null
          document_category: string | null
          document_type: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          form_data: Json | null
          healthcare_professional: string | null
          id: string
          intended_recipient: string | null
          is_digital_form: boolean | null
          is_locked: boolean | null
          name: string
          patient_name: string | null
          policy_version: string | null
          priority: string | null
          reference_number: string | null
          registration_number: string | null
          requires_signature: boolean | null
          retention_schedule_date: string | null
          status: string | null
          tags: string[] | null
          template_id: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          approval_chain?: string[] | null
          approval_required?: boolean | null
          assigned_to?: string | null
          board_restricted?: boolean | null
          confidentiality_level?: string | null
          created_at?: string | null
          created_by?: string | null
          current_approver?: string | null
          description?: string | null
          disposal_status?: string | null
          document_category?: string | null
          document_type?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          form_data?: Json | null
          healthcare_professional?: string | null
          id?: string
          intended_recipient?: string | null
          is_digital_form?: boolean | null
          is_locked?: boolean | null
          name: string
          patient_name?: string | null
          policy_version?: string | null
          priority?: string | null
          reference_number?: string | null
          registration_number?: string | null
          requires_signature?: boolean | null
          retention_schedule_date?: string | null
          status?: string | null
          tags?: string[] | null
          template_id?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          approval_chain?: string[] | null
          approval_required?: boolean | null
          assigned_to?: string | null
          board_restricted?: boolean | null
          confidentiality_level?: string | null
          created_at?: string | null
          created_by?: string | null
          current_approver?: string | null
          description?: string | null
          disposal_status?: string | null
          document_category?: string | null
          document_type?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          form_data?: Json | null
          healthcare_professional?: string | null
          id?: string
          intended_recipient?: string | null
          is_digital_form?: boolean | null
          is_locked?: boolean | null
          name?: string
          patient_name?: string | null
          policy_version?: string | null
          priority?: string | null
          reference_number?: string | null
          registration_number?: string | null
          requires_signature?: boolean | null
          retention_schedule_date?: string | null
          status?: string | null
          tags?: string[] | null
          template_id?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_current_approver_fkey"
            columns: ["current_approver"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "form_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      form_fields: {
        Row: {
          field_type: string
          id: string
          label: string
          options: string[] | null
          order_index: number | null
          required: boolean | null
          template_id: string | null
        }
        Insert: {
          field_type: string
          id?: string
          label: string
          options?: string[] | null
          order_index?: number | null
          required?: boolean | null
          template_id?: string | null
        }
        Update: {
          field_type?: string
          id?: string
          label?: string
          options?: string[] | null
          order_index?: number | null
          required?: boolean | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_fields_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "form_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          form_data: Json | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          template_id: string | null
          user_id: string | null
        }
        Insert: {
          form_data?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          template_id?: string | null
          user_id?: string | null
        }
        Update: {
          form_data?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          template_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "form_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      form_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inter_department_messages: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          document_id: string | null
          from_user_id: string
          id: string
          message_content: string | null
          message_type: string | null
          metadata: Json | null
          priority: string | null
          read_at: string | null
          requires_response: boolean | null
          response_deadline: string | null
          status: string | null
          subject: string
          to_department: string | null
          to_user_id: string | null
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          document_id?: string | null
          from_user_id: string
          id?: string
          message_content?: string | null
          message_type?: string | null
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          requires_response?: boolean | null
          response_deadline?: string | null
          status?: string | null
          subject: string
          to_department?: string | null
          to_user_id?: string | null
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          document_id?: string | null
          from_user_id?: string
          id?: string
          message_content?: string | null
          message_type?: string | null
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          requires_response?: boolean | null
          response_deadline?: string | null
          status?: string | null
          subject?: string
          to_department?: string | null
          to_user_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      message_attachments: {
        Row: {
          attachment_name: string
          attachment_size: number | null
          attachment_type: string | null
          attachment_url: string
          created_at: string
          id: string
          message_id: string
        }
        Insert: {
          attachment_name: string
          attachment_size?: number | null
          attachment_type?: string | null
          attachment_url: string
          created_at?: string
          id?: string
          message_id: string
        }
        Update: {
          attachment_name?: string
          attachment_size?: number | null
          attachment_type?: string | null
          attachment_url?: string
          created_at?: string
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "inter_department_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_recipients: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          id: string
          message_id: string
          read_at: string | null
          recipient_department: string | null
          recipient_user_id: string
          status: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          id?: string
          message_id: string
          read_at?: string | null
          recipient_department?: string | null
          recipient_user_id: string
          status?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          id?: string
          message_id?: string
          read_at?: string | null
          recipient_department?: string | null
          recipient_user_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_recipients_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "inter_department_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          password_hash: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          password_hash?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          password_hash?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_department_fkey"
            columns: ["department"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Views: {
      document_stats: {
        Row: {
          approved_count: number | null
          created_by: string | null
          pending_count: number | null
          total_documents: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_department_hierarchy: {
        Args: { dept_id: string }
        Returns: {
          id: string
          level: number
          name: string
          path: string[]
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "CMD"
        | "CMAC"
        | "HEAD_OF_NURSING"
        | "REGISTRY"
        | "DIRECTOR_ADMIN"
        | "CHIEF_ACCOUNTANT"
        | "CHIEF_PROCUREMENT_OFFICER"
        | "MEDICAL_RECORDS_OFFICER"
        | "HOD"
        | "STAFF"
        | "ADMIN"
        | "SUPER_ADMIN"
        | "HEAD_OF_UNIT"
      service_type: "clinical" | "non_clinical" | "administrative"
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
      app_role: [
        "CMD",
        "CMAC",
        "HEAD_OF_NURSING",
        "REGISTRY",
        "DIRECTOR_ADMIN",
        "CHIEF_ACCOUNTANT",
        "CHIEF_PROCUREMENT_OFFICER",
        "MEDICAL_RECORDS_OFFICER",
        "HOD",
        "STAFF",
        "ADMIN",
        "SUPER_ADMIN",
        "HEAD_OF_UNIT",
      ],
      service_type: ["clinical", "non_clinical", "administrative"],
    },
  },
} as const
