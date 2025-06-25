
-- 1. Asegúrate de que la columna "limite" exista y sea editable:
ALTER TABLE public.limites
  ALTER COLUMN limite SET DEFAULT 1;

-- 2. Crea o reemplaza la función para acciones al insertar un usuario nuevo:
CREATE OR REPLACE FUNCTION public.handle_new_user_details()
RETURNS trigger AS $$
BEGIN
  -- Insertar límite default (1 publicación)
  INSERT INTO public.limites (user_id, limite)
  VALUES (NEW.id, 1);
  
  -- Insertar rol default ('usuario')
  INSERT INTO public.roles (user_id, rol)
  VALUES (NEW.id, 'usuario');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crea el trigger para ejecutar la función en la tabla public.users
DROP TRIGGER IF EXISTS trg_insert_user_details ON public.users;

CREATE TRIGGER trg_insert_user_details
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_details();
