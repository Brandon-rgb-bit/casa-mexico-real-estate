
-- Agrega la columna 'frecuencia_pago' (ej: mensual, semanal, diario, etc.)
ALTER TABLE public.publicaciones
  ADD COLUMN IF NOT EXISTS frecuencia_pago TEXT;

-- Agrega la columna 'condicion' (nuevo, usado, reparado, etc.)
ALTER TABLE public.publicaciones
  ADD COLUMN IF NOT EXISTS condicion TEXT;
