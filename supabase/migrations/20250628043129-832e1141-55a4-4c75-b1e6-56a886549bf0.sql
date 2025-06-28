
-- Corregir la función handle_new_user_details para que funcione con el esquema actual
CREATE OR REPLACE FUNCTION public.handle_new_user_details()
RETURNS trigger AS $$
BEGIN
  -- Insertar límite default: 2 publicaciones, vigente un mes desde registro
  INSERT INTO public.limites (user_id, limite, vigencia_hasta)
  VALUES (
    NEW.id,
    2,
    now() + interval '1 month'
  );

  -- Insertar rol por defecto usando solo campos que existen
  INSERT INTO public.roles (user_id, rol, nombre, telefono)
  VALUES (
    NEW.id,
    'usuario',
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Sin nombre'),
    COALESCE(NEW.raw_user_meta_data->>'telefono', 'Sin teléfono')
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Asegurar que el trigger esté conectado correctamente
DROP TRIGGER IF EXISTS trg_insert_user_details ON auth.users;
CREATE TRIGGER trg_insert_user_details
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_details();
