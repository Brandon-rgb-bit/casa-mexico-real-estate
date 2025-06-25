
-- 1. Actualizar tabla users para que nombre y telefono tengan valor por defecto al registrar un usuario
ALTER TABLE public.users
  ALTER COLUMN nombre SET DEFAULT 'Sin nombre',
  ALTER COLUMN telefono SET DEFAULT 'Sin teléfono';

-- 2. Modificar tabla limites: dejar solo los campos necesarios y ajustar el default de vigencia_hasta
ALTER TABLE public.limites
  ALTER COLUMN vigencia_hasta SET DEFAULT (now() + interval '1 month');

-- 3. Modificar función y trigger para registrar usuario, para aprovechar los nuevos defaults en users y limites
CREATE OR REPLACE FUNCTION public.handle_new_user_details()
RETURNS trigger AS $$
BEGIN
  -- Insertar límite default: 1 publicación, vigente un mes desde registro
  INSERT INTO public.limites (user_id)
  VALUES (NEW.id);

  -- Insertar rol por defecto
  INSERT INTO public.roles (user_id, rol)
  VALUES (NEW.id, 'usuario');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_insert_user_details ON public.users;
CREATE TRIGGER trg_insert_user_details
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_details();
