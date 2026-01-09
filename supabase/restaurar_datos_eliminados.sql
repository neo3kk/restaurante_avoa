-- ============================================
-- SCRIPT DE RESTAURACIÓN COMPLETA
-- Restaura categorías y platos eliminados
-- ============================================

-- PASO 1: Restaurar categorías faltantes
INSERT INTO public.categorias_disponibilidad (categoria, nombre_es, nombre_ca, nombre_en, disponible, temporada, orden) VALUES
('entrantes', 'Entrantes', 'Entrants', 'Starters', true, 'todo_año', 1),
('platos_calientes', 'Platos Calientes', 'Plats Calents', 'Hot Dishes', true, 'todo_año', 2),
('pescados', 'Pescados', 'Peixos', 'Fish', true, 'todo_año', 3),
('postres', 'Postres', 'Postres', 'Desserts', true, 'todo_año', 5)
ON CONFLICT (categoria) DO UPDATE SET
    nombre_es = EXCLUDED.nombre_es,
    nombre_ca = EXCLUDED.nombre_ca,
    nombre_en = EXCLUDED.nombre_en,
    disponible = EXCLUDED.disponible,
    temporada = EXCLUDED.temporada,
    orden = EXCLUDED.orden;

-- PASO 2: Restaurar ENTRANTES
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible) VALUES
('Empanada Gallega', 'Empanada Gallega', 'Galician Empanada', 'entrantes', 7.00, NULL, 1, true),
('Ensalada Bonito', 'Amanida de Bonítol', 'Bonito Salad', 'entrantes', 21.00, NULL, 2, true),
('Pulpo a Feira', 'Pop a Feira', 'Galician-Style Octopus', 'entrantes', 28.00, NULL, 3, true),
('Anchoas 00', 'Anxoves 00', 'Premium Anchovies 00', 'entrantes', 4.00, 'ud', 4, true),
('Zamburiñas', 'Zamburiñas', 'Queen Scallops', 'entrantes', 28.00, NULL, 5, true),
('Jamón Ibérico', 'Pernil Ibèric', 'Iberian Ham', 'entrantes', 35.00, NULL, 6, true),
('Tirabeques', 'Pèsols Tendres', 'Snow Peas', 'entrantes', 14.00, NULL, 7, true),
('Queso con Anchoas', 'Formatge amb Anxoves', 'Cheese with Anchovies', 'entrantes', 5.00, 'ud', 8, true),
('Croquetas de Ibérico', 'Croquetes d''Ibèric', 'Iberian Croquettes', 'entrantes', 4.00, 'ud', 9, true),
('Buñuelos', 'Bunyols', 'Fritters', 'entrantes', 4.00, 'ud', 10, true),
('Calamar de Potera', 'Calamar de Potera', 'Squid', 'entrantes', 30.00, NULL, 11, true),
('Alcachofas', 'Carxofes', 'Artichokes', 'entrantes', 9.00, NULL, 12, true),
('Angulas', 'Angules', 'Baby Eels', 'entrantes', NULL, NULL, 13, true);

-- Actualizar Angulas como precio según mercado
UPDATE public.menu_items SET precio_mercado = true WHERE nombre_es = 'Angulas' AND categoria = 'entrantes';

-- Agregar descripción a Buñuelos
UPDATE public.menu_items 
SET descripcion_es = '(Bacalao / Merluza)',
    descripcion_ca = '(Bacallà / Lluç)',
    descripcion_en = '(Cod / Hake)'
WHERE nombre_es = 'Buñuelos' AND categoria = 'entrantes';

-- PASO 3: Restaurar PLATOS CALIENTES
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, descripcion_es, descripcion_ca, descripcion_en, categoria, precio, orden, disponible) VALUES
('Alubias', 'Mongetes', 'White Beans', 'con Almejas o Pulpo', 'amb Cloïsses o Pop', 'with Clams or Octopus', 'platos_calientes', 30.00, 1, true),
('Caldo Gallego', 'Brou Gallec', 'Galician Broth', NULL, NULL, NULL, 'platos_calientes', 7.00, 2, true),
('Callos', 'Callos', 'Tripe Stew', NULL, NULL, NULL, 'platos_calientes', 16.00, 3, true);

-- PASO 4: Restaurar PESCADOS (Precio Según Mercado)
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio_mercado, orden, disponible) VALUES
('Lubina', 'Llobarro', 'Sea Bass', 'pescados', true, 1, true),
('Rodaballo', 'Rèmol', 'Turbot', 'pescados', true, 2, true),
('Merluza', 'Lluç', 'Hake', 'pescados', true, 3, true),
('Lenguado', 'Llenguado', 'Sole', 'pescados', true, 4, true),
('Gallo', 'Gall', 'Megrim', 'pescados', true, 5, true),
('Centolla', 'Centolla', 'Spider Crab', 'pescados', true, 6, true),
('Bogavante', 'Llagosta', 'Lobster', 'pescados', true, 7, true);

-- PASO 5: Restaurar POSTRES
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible) VALUES
('Filloas', 'Filloas', 'Filloas (Galician Crepes)', 'postres', 8.00, 1, true),
('Cañitas', 'Canyetes', 'Cañitas', 'postres', 8.00, 2, true),
('Queso Arzua con Membrillo', 'Formatge Arzua amb Codony', 'Arzua Cheese with Quince', 'postres', 8.00, 3, true),
('Tarta de Santiago', 'Pastís de Santiago', 'Santiago Cake', 'postres', 8.00, 4, true),
('Tarta de Queso', 'Pastís de Formatge', 'Cheesecake', 'postres', 8.00, 5, true);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver categorías restauradas
SELECT categoria, nombre_es, disponible, orden 
FROM public.categorias_disponibilidad 
ORDER BY orden;

-- Ver conteo de items por categoría
SELECT 
    categoria,
    COUNT(*) as total_items,
    COUNT(CASE WHEN disponible = true THEN 1 END) as disponibles
FROM public.menu_items
GROUP BY categoria
ORDER BY categoria;

-- Verificar total
SELECT COUNT(*) as total_categorias FROM public.categorias_disponibilidad;
SELECT COUNT(*) as total_items FROM public.menu_items;
