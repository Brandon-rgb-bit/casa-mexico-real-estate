
-- Agregar columna telefono a publicaciones 
ALTER TABLE publicaciones ADD COLUMN telefono text;

-- Opcional: rellena los existentes con NULL o un valor por defecto si lo deseas
-- UPDATE publicaciones SET telefono = NULL WHERE telefono IS NULL;
