
-- 1. Crear la tabla roles que necesita useSupabaseSession
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rol TEXT NOT NULL DEFAULT 'usuario',
  nombre TEXT,
  telefono TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- 2. Cambiar el límite por defecto a 2 publicaciones
ALTER TABLE public.limites ALTER COLUMN limite SET DEFAULT 2;

-- 3. Crear el bucket de storage para imágenes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('imagenes', 'imagenes', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- 4. Crear políticas para el storage bucket (solo si no existen)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Usuarios pueden subir imágenes'
    ) THEN
        CREATE POLICY "Usuarios pueden subir imágenes" ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (bucket_id = 'imagenes');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Imágenes son públicas para lectura'
    ) THEN
        CREATE POLICY "Imágenes son públicas para lectura" ON storage.objects
        FOR SELECT TO public
        USING (bucket_id = 'imagenes');
    END IF;
END $$;

-- 5. Habilitar RLS en todas las tablas principales
ALTER TABLE public.publicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.limites ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas RLS para publicaciones (solo si no existen)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'publicaciones' 
        AND policyname = 'Todos pueden ver publicaciones aprobadas'
    ) THEN
        CREATE POLICY "Todos pueden ver publicaciones aprobadas" ON public.publicaciones
        FOR SELECT TO public
        USING (aprobada = true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'publicaciones' 
        AND policyname = 'Usuarios pueden crear publicaciones'
    ) THEN
        CREATE POLICY "Usuarios pueden crear publicaciones" ON public.publicaciones
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 7. Políticas RLS para roles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'roles' 
        AND policyname = 'Usuarios pueden ver su propio rol'
    ) THEN
        CREATE POLICY "Usuarios pueden ver su propio rol" ON public.roles
        FOR SELECT TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- 8. Políticas RLS para límites
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'limites' 
        AND policyname = 'Usuarios pueden ver sus propios límites'
    ) THEN
        CREATE POLICY "Usuarios pueden ver sus propios límites" ON public.limites
        FOR SELECT TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- 9. Políticas RLS para perfiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Usuarios pueden ver su propio perfil'
    ) THEN
        CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.profiles
        FOR SELECT TO authenticated
        USING (auth.uid() = id);
    END IF;
END $$;

-- 10. Permitir lectura pública de catálogos
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.municipios ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categorias' 
        AND policyname = 'Todos pueden leer categorías'
    ) THEN
        CREATE POLICY "Todos pueden leer categorías" ON public.categorias FOR SELECT TO public USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'estados' 
        AND policyname = 'Todos pueden leer estados'
    ) THEN
        CREATE POLICY "Todos pueden leer estados" ON public.estados FOR SELECT TO public USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'municipios' 
        AND policyname = 'Todos pueden leer municipios'
    ) THEN
        CREATE POLICY "Todos pueden leer municipios" ON public.municipios FOR SELECT TO public USING (true);
    END IF;
END $$;

-- 11. Corregir la función handle_new_user_details para que funcione con el código actual
CREATE OR REPLACE FUNCTION public.handle_new_user_details()
RETURNS trigger AS $$
BEGIN
  -- Insertar límite default: 2 publicaciones, vigente un mes desde registro, con email guardado
  INSERT INTO public.limites (user_id, limite, vigencia_hasta)
  VALUES (
    NEW.id,
    2,
    now() + interval '1 month'
  );

  -- Insertar rol por defecto con nombre y teléfono
  INSERT INTO public.roles (user_id, rol, nombre, telefono)
  VALUES (
    NEW.id,
    'usuario',
    COALESCE(NEW.nombre, 'Sin nombre'),
    COALESCE(NEW.telefono, 'Sin teléfono')
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Asegurar que el trigger esté conectado a la tabla users
DROP TRIGGER IF EXISTS trg_insert_user_details ON public.users;
CREATE TRIGGER trg_insert_user_details
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_details();

-- 13. Insertar algunas categorías básicas
INSERT INTO public.categorias (nombre, descripcion) 
SELECT 'Casa', 'Casas familiares'
WHERE NOT EXISTS (SELECT 1 FROM public.categorias WHERE nombre = 'Casa');

INSERT INTO public.categorias (nombre, descripcion) 
SELECT 'Departamento', 'Departamentos y condominios'
WHERE NOT EXISTS (SELECT 1 FROM public.categorias WHERE nombre = 'Departamento');

INSERT INTO public.categorias (nombre, descripcion) 
SELECT 'Terreno', 'Terrenos y lotes'
WHERE NOT EXISTS (SELECT 1 FROM public.categorias WHERE nombre = 'Terreno');

INSERT INTO public.categorias (nombre, descripcion) 
SELECT 'Local Comercial', 'Locales para negocios'
WHERE NOT EXISTS (SELECT 1 FROM public.categorias WHERE nombre = 'Local Comercial');

INSERT INTO public.categorias (nombre, descripcion) 
SELECT 'Oficina', 'Espacios de oficina'
WHERE NOT EXISTS (SELECT 1 FROM public.categorias WHERE nombre = 'Oficina');

-- 14. Insertar algunos estados básicos
INSERT INTO public.estados (codigo, nombre) 
SELECT 'CDMX', 'Ciudad de México'
WHERE NOT EXISTS (SELECT 1 FROM public.estados WHERE codigo = 'CDMX');

INSERT INTO public.estados (codigo, nombre) 
SELECT 'JAL', 'Jalisco'
WHERE NOT EXISTS (SELECT 1 FROM public.estados WHERE codigo = 'JAL');

INSERT INTO public.estados (codigo, nombre) 
SELECT 'NL', 'Nuevo León'
WHERE NOT EXISTS (SELECT 1 FROM public.estados WHERE codigo = 'NL');

INSERT INTO public.estados (codigo, nombre) 
SELECT 'MEX', 'México'
WHERE NOT EXISTS (SELECT 1 FROM public.estados WHERE codigo = 'MEX');

-- 15. Insertar algunos municipios básicos
INSERT INTO public.municipios (nombre, codigo, estado_id) 
SELECT 'Guadalajara', '039', (SELECT id FROM public.estados WHERE codigo = 'JAL')
WHERE NOT EXISTS (SELECT 1 FROM public.municipios WHERE nombre = 'Guadalajara' AND estado_id = (SELECT id FROM public.estados WHERE codigo = 'JAL'));

INSERT INTO public.municipios (nombre, codigo, estado_id) 
SELECT 'Zapopan', '120', (SELECT id FROM public.estados WHERE codigo = 'JAL')
WHERE NOT EXISTS (SELECT 1 FROM public.municipios WHERE nombre = 'Zapopan' AND estado_id = (SELECT id FROM public.estados WHERE codigo = 'JAL'));

INSERT INTO public.municipios (nombre, codigo, estado_id) 
SELECT 'Monterrey', '039', (SELECT id FROM public.estados WHERE codigo = 'NL')
WHERE NOT EXISTS (SELECT 1 FROM public.municipios WHERE nombre = 'Monterrey' AND estado_id = (SELECT id FROM public.estados WHERE codigo = 'NL'));

INSERT INTO public.municipios (nombre, codigo, estado_id) 
SELECT 'Benito Juárez', '014', (SELECT id FROM public.estados WHERE codigo = 'CDMX')
WHERE NOT EXISTS (SELECT 1 FROM public.municipios WHERE nombre = 'Benito Juárez' AND estado_id = (SELECT id FROM public.estados WHERE codigo = 'CDMX'));
