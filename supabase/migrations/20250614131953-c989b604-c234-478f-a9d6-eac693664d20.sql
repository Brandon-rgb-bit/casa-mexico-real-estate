
-- Crear tabla de publicaciones destacadas por el administrador con opción de activar/desactivar
CREATE TABLE public.destacados (
  id SERIAL PRIMARY KEY,
  publicacion_id UUID NOT NULL UNIQUE REFERENCES publicaciones(id) ON DELETE CASCADE,
  fecha_destacada TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- (No RLS explícito por ahora, todos podrán leer; solo el admin debería modificar desde el panel)
