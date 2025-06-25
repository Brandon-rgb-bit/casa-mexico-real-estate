
-- Ejemplo: para el estado de "Jalisco" (busca el id correcto en tu tabla; aquí asumo es 14 como en el insert de estados)
-- Agrega municipios de Jalisco. Si el id es diferente, ajústalo:
INSERT INTO public.municipios (nombre, estado_id) VALUES
('Guadalajara', 14),
('Zapopan', 14),
('Tlaquepaque', 14),
('Tonalá', 14),
('El Salto', 14),
('Tlajomulco de Zúñiga', 14),
('Puerto Vallarta', 14);

-- Agrega más municipios según los estados que necesites.

-- Inserta ejemplos de categorías de maquinaria:
INSERT INTO public.categorias (nombre) VALUES
('Tractores'),
('Excavadoras'),
('Cargadores frontales'),
('Retroexcavadoras'),
('Grúas'),
('Bulldozers'),
('Camiones'),
('Mini cargadoras'),
('Montacargas'),
('Otros');
