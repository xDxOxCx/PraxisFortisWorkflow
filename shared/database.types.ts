export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          first_name: string | null
          last_name: string | null
          profile_image_url: string | null
          subscription_status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          monthly_workflows: number
          total_workflows: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          subscription_status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          monthly_workflows?: number
          total_workflows?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          subscription_status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          monthly_workflows?: number
          total_workflows?: number
          created_at?: string
          updated_at?: string
        }
      }
      workflows: {
        Row: {
          id: number
          user_id: string
          name: string
          description: string | null
          flow_data: Json
          ai_analysis: Json | null
          mermaid_code: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          name: string
          description?: string | null
          flow_data: Json
          ai_analysis?: Json | null
          mermaid_code?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          name?: string
          description?: string | null
          flow_data?: Json
          ai_analysis?: Json | null
          mermaid_code?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: number
          name: string
          description: string
          category: string
          flow_data: Json
          icon: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          category: string
          flow_data: Json
          icon: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          category?: string
          flow_data?: Json
          icon?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}