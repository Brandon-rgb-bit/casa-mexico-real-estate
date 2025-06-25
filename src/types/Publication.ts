export type Publication = {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  tipo_publicacion: string;
  imagenes: string[];
  frecuencia_pago?: string | null;
  condicion?: string | null;
  fecha_creacion: string;
  estados: { nombre: string };
  municipios: { nombre: string };
  categorias: { nombre: string };
  telefono?: string | null;
  user_id?: string;
};
