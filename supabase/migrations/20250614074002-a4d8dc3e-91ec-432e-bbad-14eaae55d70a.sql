
-- Tabla de usuarios adicional (en Supabase existe auth.users, aquí solo añadimos detalles)
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT,
  telefono TEXT
);

-- Catálogo oficial de Estados
CREATE TABLE public.estados (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL
);

-- Catálogo oficial de Municipios (relacionados a estados)
CREATE TABLE public.municipios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  estado_id INTEGER REFERENCES public.estados(id) ON DELETE CASCADE
);

-- Tabla de categorías de maquinaria
CREATE TABLE public.categorias (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL
);

-- Tabla de publicaciones
CREATE TABLE public.publicaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  imagenes TEXT[], -- se pueden almacenar URLs
  precio NUMERIC,
  tipo_publicacion TEXT CHECK (tipo_publicacion IN ('renta', 'venta')),
  estado_id INTEGER REFERENCES public.estados(id),
  municipio_id INTEGER REFERENCES public.municipios(id),
  categoria_id INTEGER REFERENCES public.categorias(id),
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT now(),
  aprobada BOOLEAN DEFAULT FALSE
);

-- Tabla para límite personalizado de publicaciones por usuario
CREATE TABLE public.limites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  limite INTEGER DEFAULT 1,
  vigencia_hasta TIMESTAMP WITH TIME ZONE,
  motivo TEXT
);

-- Tabla de roles (simple: admin y usuario)
CREATE TYPE public.rol AS ENUM ('admin', 'usuario');

CREATE TABLE public.roles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rol public.rol DEFAULT 'usuario'
);

-- Políticas de RLS:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.limites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Un usuario puede ver/modificar solo su info (excepto admin)
CREATE POLICY "Usuario ve su propio perfil" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuario modifica su propio perfil" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Un usuario puede ver, modificar, eliminar solo sus publicaciones (excepto admin)
CREATE POLICY "Usuario ve sus propias publicaciones" ON public.publicaciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuario modifica sus propias publicaciones" ON public.publicaciones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuario elimina sus propias publicaciones" ON public.publicaciones FOR DELETE USING (auth.uid() = user_id);

-- Políticas para límites y roles igual (pueden ver solo su propio registro)
CREATE POLICY "Usuario ve/modifica su propio límite" ON public.limites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuario ve/modifica su propio rol" ON public.roles FOR ALL USING (auth.uid() = user_id);

-- El administrador podrá acceder a todo desde el dashboard de Supabase (gestión manual).

-- Inserta todos los estados de la República (abridado, ejemplo corto, el script real incluirá todos)
INSERT INTO public.estados (nombre) VALUES
('Aguascalientes'), ('Baja California'), ('Baja California Sur'), ('Campeche'),
('Chiapas'), ('Chihuahua'), ('Ciudad de México'), ('Coahuila'), ('Colima'),
('Durango'), ('Estado de México'), ('Guanajuato'), ('Guerrero'), ('Hidalgo'),
('Jalisco'), ('Michoacán'), ('Morelos'), ('Nayarit'), ('Nuevo León'), ('Oaxaca'),
('Puebla'), ('Querétaro'), ('Quintana Roo'), ('San Luis Potosí'), ('Sinaloa'),
('Sonora'), ('Tabasco'), ('Tamaulipas'), ('Tlaxcala'), ('Veracruz'), ('Yucatán'), ('Zacatecas');
-- IMPORTANTE: Para municipios, recomendación: usar un archivo CSV y cargarlo con el importador de Supabase, para no saturar este script.

