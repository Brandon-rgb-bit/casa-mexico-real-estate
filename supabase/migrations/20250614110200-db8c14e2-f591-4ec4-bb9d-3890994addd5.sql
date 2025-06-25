
-- 1. Agregar las columnas nombre y telefono en la tabla roles
ALTER TABLE public.roles
  ADD COLUMN IF NOT EXISTS nombre TEXT,
  ADD COLUMN IF NOT EXISTS telefono TEXT;

-- 2. Actualizar función y trigger para que guarde también nombre y telefono en roles,
-- y asigne el limite y vigencia correctamente.
CREATE OR REPLACE FUNCTION public.handle_new_user_details()
RETURNS trigger AS $$
BEGIN
  -- Insertar límite default: 1 publicación, vigente un mes desde registro
  INSERT INTO public.limites (user_id, limite, vigencia_hasta)
  VALUES (NEW.id, 1, now() + interval '1 month');

  -- Insertar rol por defecto con nombre y telefono
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

DROP TRIGGER IF EXISTS trg_insert_user_details ON public.users;
CREATE TRIGGER trg_insert_user_details
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_details();
