
-- Actualiza la función del trigger para copiar nombre, telefono y email del nuevo usuario a todas las tablas requeridas.
CREATE OR REPLACE FUNCTION public.handle_new_user_details()
RETURNS trigger AS $$
BEGIN
  -- Insertar o actualizar registro en public.users con nombre, telefono y email desde los metadatos si existen
  INSERT INTO public.users (id, nombre, telefono, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Sin nombre'),
    COALESCE(NEW.raw_user_meta_data->>'telefono', 'Sin teléfono'),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
  SET
    nombre = EXCLUDED.nombre,
    telefono = EXCLUDED.telefono,
    email = EXCLUDED.email;

  -- Insertar límite default
  INSERT INTO public.limites (user_id, email)
  VALUES (NEW.id, NEW.email);

  -- Insertar rol default
  INSERT INTO public.roles (user_id, nombre, telefono, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Sin nombre'),
    COALESCE(NEW.raw_user_meta_data->>'telefono', 'Sin teléfono'),
    'usuario'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reemplaza el trigger para estar seguro de que se usa la nueva función
DROP TRIGGER IF EXISTS trg_insert_user_details ON auth.users;
CREATE TRIGGER trg_insert_user_details
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_details();

