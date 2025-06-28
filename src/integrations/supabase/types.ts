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
          created_at: string | null
          descripcion: string | null
          id: number
          nombre: string
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre: string
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      destacados: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          publicacion_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          publicacion_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          publicacion_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "destacados_publicacion_id_fkey"
            columns: ["publicacion_id"]
            isOneToOne: false
            referencedRelation: "publicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      estados: {
        Row: {
          codigo: string
          created_at: string | null
          id: number
          nombre: string
        }
        Insert: {
          codigo: string
          created_at?: string | null
          id?: number
          nombre: string
        }
        Update: {
          codigo?: string
          created_at?: string | null
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      limites: {
        Row: {
          created_at: string | null
          id: string
          limite: number
          user_id: string
          vigencia_hasta: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          limite?: number
          user_id: string
          vigencia_hasta?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          limite?: number
          user_id?: string
          vigencia_hasta?: string | null
        }
        Relationships: []
      }
      municipios: {
        Row: {
          codigo: string | null
          created_at: string | null
          estado_id: number | null
          id: number
          nombre: string
        }
        Insert: {
          codigo?: string | null
          created_at?: string | null
          estado_id?: number | null
          id?: number
          nombre: string
        }
        Update: {
          codigo?: string | null
          created_at?: string | null
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
      profiles: {
        Row: {
          apellidos: string | null
          created_at: string
          email: string
          id: string
          nombre: string
          telefono: string | null
          tipo_usuario: string
          updated_at: string
        }
        Insert: {
          apellidos?: string | null
          created_at?: string
          email: string
          id: string
          nombre: string
          telefono?: string | null
          tipo_usuario: string
          updated_at?: string
        }
        Update: {
          apellidos?: string | null
          created_at?: string
          email?: string
          id?: string
          nombre?: string
          telefono?: string | null
          tipo_usuario?: string
          updated_at?: string
        }
        Relationships: []
      }
      propiedades: {
        Row: {
          antiguedad: number | null
          aprobada: boolean | null
          baños: number | null
          caracteristicas: string[] | null
          codigo_postal: string | null
          colonia: string | null
          created_at: string | null
          descripcion: string | null
          destacada: boolean | null
          direccion_completa: string | null
          estado_id: number | null
          habitaciones: number | null
          id: string
          imagenes: string[] | null
          m2_construccion: number | null
          m2_terreno: number | null
          municipio_id: number | null
          precio: number
          servicios: string[] | null
          telefono: string | null
          tipo_operacion: string
          tipo_propiedad_id: number | null
          titulo: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          antiguedad?: number | null
          aprobada?: boolean | null
          baños?: number | null
          caracteristicas?: string[] | null
          codigo_postal?: string | null
          colonia?: string | null
          created_at?: string | null
          descripcion?: string | null
          destacada?: boolean | null
          direccion_completa?: string | null
          estado_id?: number | null
          habitaciones?: number | null
          id?: string
          imagenes?: string[] | null
          m2_construccion?: number | null
          m2_terreno?: number | null
          municipio_id?: number | null
          precio: number
          servicios?: string[] | null
          telefono?: string | null
          tipo_operacion: string
          tipo_propiedad_id?: number | null
          titulo: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          antiguedad?: number | null
          aprobada?: boolean | null
          baños?: number | null
          caracteristicas?: string[] | null
          codigo_postal?: string | null
          colonia?: string | null
          created_at?: string | null
          descripcion?: string | null
          destacada?: boolean | null
          direccion_completa?: string | null
          estado_id?: number | null
          habitaciones?: number | null
          id?: string
          imagenes?: string[] | null
          m2_construccion?: number | null
          m2_terreno?: number | null
          municipio_id?: number | null
          precio?: number
          servicios?: string[] | null
          telefono?: string | null
          tipo_operacion?: string
          tipo_propiedad_id?: number | null
          titulo?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "propiedades_estado_id_fkey"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propiedades_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propiedades_tipo_propiedad_id_fkey"
            columns: ["tipo_propiedad_id"]
            isOneToOne: false
            referencedRelation: "tipos_propiedad"
            referencedColumns: ["id"]
          },
        ]
      }
      publicaciones: {
        Row: {
          aprobada: boolean | null
          categoria_id: number | null
          condicion: string | null
          descripcion: string | null
          destacada: boolean | null
          estado_id: number | null
          fecha_creacion: string | null
          frecuencia_pago: string | null
          id: string
          imagenes: string[] | null
          municipio_id: number | null
          precio: number | null
          telefono: number | null
          tipo_publicacion: string
          titulo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aprobada?: boolean | null
          categoria_id?: number | null
          condicion?: string | null
          descripcion?: string | null
          destacada?: boolean | null
          estado_id?: number | null
          fecha_creacion?: string | null
          frecuencia_pago?: string | null
          id?: string
          imagenes?: string[] | null
          municipio_id?: number | null
          precio?: number | null
          telefono?: number | null
          tipo_publicacion: string
          titulo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aprobada?: boolean | null
          categoria_id?: number | null
          condicion?: string | null
          descripcion?: string | null
          destacada?: boolean | null
          estado_id?: number | null
          fecha_creacion?: string | null
          frecuencia_pago?: string | null
          id?: string
          imagenes?: string[] | null
          municipio_id?: number | null
          precio?: number | null
          telefono?: number | null
          tipo_publicacion?: string
          titulo?: string
          updated_at?: string | null
          user_id?: string
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
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          id: string
          nombre: string | null
          rol: string
          telefono: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nombre?: string | null
          rol?: string
          telefono?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nombre?: string | null
          rol?: string
          telefono?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tipos_propiedad: {
        Row: {
          created_at: string | null
          descripcion: string | null
          id: number
          nombre: string
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre: string
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          telefono: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          telefono?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
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
