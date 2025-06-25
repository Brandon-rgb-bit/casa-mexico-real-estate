
-- Primero verificamos si RLS está habilitado en la tabla publicaciones
ALTER TABLE public.publicaciones ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay para evitar conflictos
DROP POLICY IF EXISTS "Users can create their own publications" ON public.publicaciones;
DROP POLICY IF EXISTS "Anyone can view approved publications" ON public.publicaciones;
DROP POLICY IF EXISTS "Users can view their own publications" ON public.publicaciones;
DROP POLICY IF EXISTS "Users can update their own publications" ON public.publicaciones;
DROP POLICY IF EXISTS "Users can delete their own publications" ON public.publicaciones;

-- Crear nuevas políticas RLS para la tabla publicaciones
-- Permitir a los usuarios autenticados crear sus propias publicaciones
CREATE POLICY "Users can create their own publications" 
ON public.publicaciones 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Permitir a todos ver publicaciones aprobadas (para el catálogo público)
CREATE POLICY "Anyone can view approved publications" 
ON public.publicaciones 
FOR SELECT 
USING (aprobada = true);

-- Permitir a los usuarios ver sus propias publicaciones (aprobadas o no)
CREATE POLICY "Users can view their own publications" 
ON public.publicaciones 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Permitir a los usuarios actualizar sus propias publicaciones
CREATE POLICY "Users can update their own publications" 
ON public.publicaciones 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Permitir a los usuarios eliminar sus propias publicaciones
CREATE POLICY "Users can delete their own publications" 
ON public.publicaciones 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
