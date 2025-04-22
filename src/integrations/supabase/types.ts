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
      tire_positions: {
        Row: {
          created_at: string
          id: string
          position: string
          tire_id: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          position: string
          tire_id?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: string
          tire_id?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tire_positions_tire_id_fkey"
            columns: ["tire_id"]
            isOneToOne: false
            referencedRelation: "tires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tire_positions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      tire_wear_calculations: {
        Row: {
          analysis_method: string
          analysis_result: string
          analysis_type: string
          calculation_date: string
          created_at: string
          current_age_days: number
          current_mileage: number
          id: string
          notes: string | null
          predicted_wear_percentage: number
          recommendation: string
          tire_id: string
          tread_depth_mm: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          analysis_method: string
          analysis_result: string
          analysis_type?: string
          calculation_date?: string
          created_at?: string
          current_age_days: number
          current_mileage: number
          id?: string
          notes?: string | null
          predicted_wear_percentage: number
          recommendation: string
          tire_id: string
          tread_depth_mm: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          analysis_method?: string
          analysis_result?: string
          analysis_type?: string
          calculation_date?: string
          created_at?: string
          current_age_days?: number
          current_mileage?: number
          id?: string
          notes?: string | null
          predicted_wear_percentage?: number
          recommendation?: string
          tire_id?: string
          tread_depth_mm?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tire_wear_calculations_tire_id_fkey"
            columns: ["tire_id"]
            isOneToOne: false
            referencedRelation: "tires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tire_wear_calculations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      tires: {
        Row: {
          brand: string
          created_at: string
          id: string
          mileage: number
          model: string
          notes: string | null
          position: string | null
          purchase_date: string
          purchase_price: number
          serial_number: string
          size: string
          status: string
          supplier: string
          tread_depth: number
          type: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          brand: string
          created_at?: string
          id?: string
          mileage?: number
          model: string
          notes?: string | null
          position?: string | null
          purchase_date: string
          purchase_price: number
          serial_number: string
          size: string
          status: string
          supplier: string
          tread_depth: number
          type: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          brand?: string
          created_at?: string
          id?: string
          mileage?: number
          model?: string
          notes?: string | null
          position?: string | null
          purchase_date?: string
          purchase_price?: number
          serial_number?: string
          size?: string
          status?: string
          supplier?: string
          tread_depth?: number
          type?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tires_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string
          created_at: string
          current_mileage: number
          id: string
          model: string
          notes: string | null
          registration_number: string
          type: string
          updated_at: string
          wheel_positions: number
        }
        Insert: {
          brand: string
          created_at?: string
          current_mileage?: number
          id?: string
          model: string
          notes?: string | null
          registration_number: string
          type: string
          updated_at?: string
          wheel_positions: number
        }
        Update: {
          brand?: string
          created_at?: string
          current_mileage?: number
          id?: string
          model?: string
          notes?: string | null
          registration_number?: string
          type?: string
          updated_at?: string
          wheel_positions?: number
        }
        Relationships: []
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
