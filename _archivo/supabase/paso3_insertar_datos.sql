-- ============================================
-- PASO 3: INSERTAR TODOS LOS DATOS
-- ============================================
-- Ejecuta este bloque DESPUÉS del Paso 2

-- Opcional: Limpiar datos existentes (descomenta si quieres empezar desde cero)
DELETE FROM public.menu_items;

-- ENTRANTES
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
UPDATE public.menu_items SET precio_mercado = true WHERE nombre_es = 'Angulas';

-- Agregar descripción a Buñuelos
UPDATE public.menu_items 
SET descripcion_es = '(Bacalao / Merluza)',
    descripcion_ca = '(Bacallà / Lluç)',
    descripcion_en = '(Cod / Hake)'
WHERE nombre_es = 'Buñuelos';

-- PLATOS CALIENTES
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, descripcion_es, descripcion_ca, descripcion_en, categoria, precio, orden, disponible) VALUES
('Alubias', 'Mongetes', 'White Beans', 'con Almejas o Pulpo', 'amb Cloïsses o Pop', 'with Clams or Octopus', 'platos_calientes', 30.00, 1, true),
('Caldo Gallego', 'Brou Gallec', 'Galician Broth', NULL, NULL, NULL, 'platos_calientes', 7.00, 2, true),
('Callos', 'Callos', 'Tripe Stew', NULL, NULL, NULL, 'platos_calientes', 16.00, 3, true);

-- PESCADOS (Precio Según Mercado)
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio_mercado, orden, disponible) VALUES
('Lubina', 'Llobarro', 'Sea Bass', 'pescados', true, 1, true),
('Rodaballo', 'Rèmol', 'Turbot', 'pescados', true, 2, true),
('Merluza', 'Lluç', 'Hake', 'pescados', true, 3, true),
('Lenguado', 'Llenguado', 'Sole', 'pescados', true, 4, true),
('Gallo', 'Gall', 'Megrim', 'pescados', true, 5, true),
('Centolla', 'Centolla', 'Spider Crab', 'pescados', true, 6, true),
('Bogavante', 'Llagosta', 'Lobster', 'pescados', true, 7, true);

-- CARNES
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible) VALUES
('Zorza con Patatas', 'Zorza amb Patates', 'Zorza with Potatoes', 'carnes', 20.00, 1, true),
('Solomillo Ternera Blanca', 'Filet de Vedella Blanca', 'White Veal Tenderloin', 'carnes', 29.00, 2, true),
('Chuleton Madurado', 'Txuleton Madurat', 'Aged T-Bone Steak', 'carnes', 104.00, 3, true),
('Entrecot Madurado', 'Entrecot Madurat', 'Aged Ribeye', 'carnes', 35.00, 4, true);

-- POSTRES
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible) VALUES
('Filloas', 'Filloas', 'Filloas (Galician Crepes)', 'postres', 8.00, 1, true),
('Cañitas', 'Canyetes', 'Cañitas', 'postres', 8.00, 2, true),
('Queso Arzua con Membrillo', 'Formatge Arzua amb Codony', 'Arzua Cheese with Quince', 'postres', 8.00, 3, true),
('Tarta de Santiago', 'Pastís de Santiago', 'Santiago Cake', 'postres', 8.00, 4, true),
('Tarta de Queso', 'Pastís de Formatge', 'Cheesecake', 'postres', 8.00, 5, true);

-- VINOS BLANCOS - Godello
INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible) VALUES
('Merayo', 'vino_blanco', 'Godello', 17.00, 1, true),
('Polvorete', 'vino_blanco', 'Godello', 25.00, 2, true),
('La Gineta', 'vino_blanco', 'Godello', 30.00, 3, true),
('La Revelia', 'vino_blanco', 'Godello', 61.00, 4, true);

-- VINOS BLANCOS - Albariño
INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible) VALUES
('Pazo Serantellos', 'vino_blanco', 'Albariño', 17.00, 5, true),
('Pazo Cilleiro', 'vino_blanco', 'Albariño', 21.00, 6, true),
('Viña Almirante', 'vino_blanco', 'Albariño', 22.00, 7, true),
('Pazo Baion', 'vino_blanco', 'Albariño', 35.00, 8, true),
('Terras Vellas', 'vino_blanco', 'Albariño', 36.00, 9, true),
('Santiago Roma', 'vino_blanco', 'Albariño', 30.00, 10, true),
('Pazo Señorans', 'vino_blanco', 'Albariño', 40.00, 11, true),
('Pazo de Rubianes', 'vino_blanco', 'Albariño', 46.00, 12, true);

-- VINOS BLANCOS - Verdejo
INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible) VALUES
('Castillo de la Mota', 'vino_blanco', 'Verdejo', 12.00, 13, true),
('Dominio de la Granadilla', 'vino_blanco', 'Verdejo', 21.00, 14, true);

-- VINOS TINTOS
INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible) VALUES
('Pujanza', 'vino_tinto', 29.00, 1, true),
('Ponte da Boga', 'vino_tinto', 31.00, 2, true),
('Emilio Moro 50cl', 'vino_tinto', 34.00, 3, true),
('Viña Sastre', 'vino_tinto', 65.00, 4, true),
('Torre Albéniz', 'vino_tinto', 65.00, 5, true),
('Tomás Postigo', 'vino_tinto', 78.00, 6, true),
('Torremilanos', 'vino_tinto', 65.00, 7, true),
('Arzuaga Crianza', 'vino_tinto', 53.00, 8, true),
('Marques de Vargas', 'vino_tinto', 40.00, 9, true),
('Pago de Carraovejas', 'vino_tinto', 78.00, 10, true),
('La Rioja Alta 904', 'vino_tinto', 130.00, 11, true),
('Pintia Vega Sicilia', 'vino_tinto', 95.00, 12, true),
('Alion Vega Sicilia', 'vino_tinto', 150.00, 13, true),
('Valbuena 5º 2019', 'vino_tinto', 180.00, 14, true),
('Vega Sicilia Único', 'vino_tinto', 450.00, 15, true);

-- CAVAS Y CHAMPAGNE
INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible) VALUES
('Marqués de la Concordia', 'cava_champagne', 22.00, 1, true),
('Juve & Camps', 'cava_champagne', 52.00, 2, true),
('Moet Chandon', 'cava_champagne', 85.00, 3, true),
('La Vinya del Refugi', 'cava_champagne', 94.00, 4, true),
('Taittinger', 'cava_champagne', 125.00, 5, true),
('Louis Roederer', 'cava_champagne', 125.00, 6, true),
('Bollinger', 'cava_champagne', 120.00, 7, true);

-- VERIFICACIÓN
SELECT 
    categoria,
    subcategoria,
    COUNT(*) as total_items,
    COUNT(CASE WHEN disponible = true THEN 1 END) as disponibles
FROM public.menu_items
GROUP BY categoria, subcategoria
ORDER BY categoria, subcategoria;
