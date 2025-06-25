
-- Habilitar RLS en la tabla users si no está habilitado
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Permitir a los usuarios autenticados crear su propio registro
CREATE POLICY "Users can create their own profile" 
ON public.users 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Permitir a los usuarios autenticados ver su propio perfil
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Permitir a los usuarios autenticados actualizar su propio perfil
CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);
