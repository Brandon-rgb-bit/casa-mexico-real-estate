
-- Crear el bucket 'imagenes' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('imagenes', 'imagenes', true)
ON CONFLICT (id) DO NOTHING;

-- Crear política para permitir a usuarios autenticados subir archivos
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'imagenes' AND
  auth.role() = 'authenticated'
);

-- Crear política para permitir acceso público de lectura
CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'imagenes');

-- Crear política para permitir a usuarios actualizar sus propios archivos
CREATE POLICY "Allow users to update their own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'imagenes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Crear política para permitir a usuarios eliminar sus propios archivos
CREATE POLICY "Allow users to delete their own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'imagenes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
