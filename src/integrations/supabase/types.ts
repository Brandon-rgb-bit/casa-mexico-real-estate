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
      categorias: {
        Row: {
          id: number
          nombre: string
        }
        Insert: {
          id?: number
          nombre: string
        }
        Update: {
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      destacados: {
        Row: {
          fecha_destacada: string | null
          id: number
          is_active: boolean
          publicacion_id: string
        }
        Insert: {
          fecha_destacada?: string | null
          id?: number
          is_active?: boolean
          publicacion_id: string
        }
        Update: {
          fecha_destacada?: string | null
          id?: number
          is_active?: boolean
          publicacion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "destacados_publicacion_id_fkey"
            columns: ["publicacion_id"]
            isOneToOne: true
            referencedRelation: "publicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      estados: {
        Row: {
          id: number
          nombre: string
        }
        Insert: {
          id?: number
          nombre: string
        }
        Update: {
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      limites: {
        Row: {
          email: string | null
          id: number
          limite: number | null
          motivo: string | null
          user_id: string | null
          vigencia_hasta: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          limite?: number | null
          motivo?: string | null
          user_id?: string | null
          vigencia_hasta?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          limite?: number | null
          motivo?: string | null
          user_id?: string | null
          vigencia_hasta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "limites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      municipios: {
        Row: {
          estado_id: number | null
          id: number
          nombre: string
        }
        Insert: {
          estado_id?: number | null
          id?: number
          nombre: string
        }
        Update: {
          estado_id?: number | null
          id?: number
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "municipios_estado_id_fkey"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados"
            referencedColumns: ["id"]
          },
        ]
      }
      publicaciones: {
        Row: {
          aprobada: boolean | null
          categoria_id: number | null
          condicion: string | null
          descripcion: string
          estado_id: number | null
          fecha_creacion: string | null
          frecuencia_pago: string | null
          id: string
          imagenes: string[] | null
          municipio_id: number | null
          precio: number | null
          telefono: number | null
          tipo_publicacion: string | null
          titulo: string
          user_id: string | null
        }
        Insert: {
          aprobada?: boolean | null
          categoria_id?: number | null
          condicion?: string | null
          descripcion: string
          estado_id?: number | null
          fecha_creacion?: string | null
          frecuencia_pago?: string | null
          id?: string
          imagenes?: string[] | null
          municipio_id?: number | null
          precio?: number | null
          telefono?: number | null
          tipo_publicacion?: string | null
          titulo: string
          user_id?: string | null
        }
        Update: {
          aprobada?: boolean | null
          categoria_id?: number | null
          condicion?: string | null
          descripcion?: string
          estado_id?: number | null
          fecha_creacion?: string | null
          frecuencia_pago?: string | null
          id?: string
          imagenes?: string[] | null
          municipio_id?: number | null
          precio?: number | null
          telefono?: number | null
          tipo_publicacion?: string | null
          titulo?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publicaciones_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publicaciones_estado_id_fkey"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publicaciones_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publicaciones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          nombre: string | null
          rol: Database["public"]["Enums"]["rol"] | null
          telefono: string | null
          user_id: string | null
        }
        Insert: {
          id?: number
          nombre?: string | null
          rol?: Database["public"]["Enums"]["rol"] | null
          telefono?: string | null
          user_id?: string | null
        }
        Update: {
          id?: number
          nombre?: string | null
          rol?: Database["public"]["Enums"]["rol"] | null
          telefono?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string | null
          id: string
          nombre: string | null
          telefono: string | null
        }
        Insert: {
          email?: string | null
          id: string
          nombre?: string | null
          telefono?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          nombre?: string | null
          telefono?: string | null
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
      rol: "admin" | "usuario"
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
    Enums: {
      rol: ["admin", "usuario"],
    },
  },
} as const
