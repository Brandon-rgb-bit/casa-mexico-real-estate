
-- Elimina el trigger conflictivo en la tabla public.users para evitar errores de bucle en el registro.
DROP TRIGGER IF EXISTS trg_insert_user_details ON public.users;
