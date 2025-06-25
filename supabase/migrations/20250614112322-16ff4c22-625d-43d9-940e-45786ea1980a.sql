
-- 1. Agregar la columna 'email' a la tabla limites si no existe aún
ALTER TABLE public.limites
  ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Modificar la función handle_new_user_details para poblar el campo email de limites desde el registro.
CREATE OR REPLACE FUNCTION public.handle_new_user_details()
RETURNS trigger AS $$
BEGIN
  -- Insertar límite default: 1 publicación, vigente un mes desde registro, con email guardado
  INSERT INTO public.limites (user_id, limite, vigencia_hasta, email)
  VALUES (
    NEW.id,
    1,
    now() + interval '1 month',
    COALESCE(NEW.email, NULL)
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

-- 3. Asegúrate que el trigger esté conectado a la tabla users
DROP TRIGGER IF EXISTS trg_insert_user_details ON public.users;
CREATE TRIGGER trg_insert_user_details
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_details();

