-- ============================================
-- REINSERTAR TODOS LOS DATOS (MÉTODO SEGURO)
-- ============================================

-- Limpiar todo primero
DELETE FROM public.menu_items;

-- ============================================
-- ENTRANTES (uno por uno para evitar errores)
-- ============================================

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible)
VALUES ('Empanada Gallega', 'Empanada Gallega', 'Galician Empanada', 'entrantes', 7.00, NULL, 1, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible)
VALUES ('Ensalada Bonito', 'Amanida de Bonítol', 'Bonito Salad', 'entrantes', 21.00, NULL, 2, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible)
VALUES ('Pulpo a Feira', 'Pop a Feira', 'Galician-Style Octopus', 'entrantes', 28.00, NULL, 3, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible)
VALUES ('Anchoas 00', 'Anxoves 00', 'Premium Anchovies 00', 'entrantes', 4.00, 'ud', 4, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible)
VALUES ('Zamburiñas', 'Zamburiñas', 'Queen Scallops', 'entrantes', 28.00, NULL, 5, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible)
VALUES ('Jamón Ibérico', 'Pernil Ibèric', 'Iberian Ham', 'entrantes', 35.00, NULL, 6, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible)
VALUES ('Tirabeques', 'Pèsols Tendres', 'Snow Peas', 'entrantes', 14.00, NULL, 7, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible)
VALUES ('Queso con Anchoas', 'Formatge amb Anxoves', 'Cheese with Anchovies', 'entrantes', 5.00, 'ud', 8, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible)
VALUES ('Croquetas de Ibérico', 'Croquetes d''Ibèric', 'Iberian Croquettes', 'entrantes', 4.00, 'ud', 9, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible, descripcion_es, descripcion_ca, descripcion_en)
VALUES ('Buñuelos', 'Bunyols', 'Fritters', 'entrantes', 4.00, 'ud', 10, true, '(Bacalao / Merluza)', '(Bacallà / Lluç)', '(Cod / Hake)');

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible)
VALUES ('Calamar de Potera', 'Calamar de Potera', 'Squid', 'entrantes', 30.00, NULL, 11, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible)
VALUES ('Alcachofas', 'Carxofes', 'Artichokes', 'entrantes', 9.00, NULL, 12, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden, disponible, precio_mercado)
VALUES ('Angulas', 'Angules', 'Baby Eels', 'entrantes', NULL, NULL, 13, true, true);

-- ============================================
-- PLATOS CALIENTES
-- ============================================

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, descripcion_es, descripcion_ca, descripcion_en, categoria, precio, orden, disponible)
VALUES ('Alubias', 'Mongetes', 'White Beans', 'con Almejas o Pulpo', 'amb Cloïsses o Pop', 'with Clams or Octopus', 'platos_calientes', 30.00, 1, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible)
VALUES ('Caldo Gallego', 'Brou Gallec', 'Galician Broth', 'platos_calientes', 7.00, 2, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible)
VALUES ('Callos', 'Callos', 'Tripe Stew', 'platos_calientes', 16.00, 3, true);

-- ============================================
-- PESCADOS (Precio Según Mercado)
-- ============================================

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio_mercado, orden, disponible)
VALUES ('Lubina', 'Llobarro', 'Sea Bass', 'pescados', true, 1, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio_mercado, orden, disponible)
VALUES ('Rodaballo', 'Rèmol', 'Turbot', 'pescados', true, 2, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio_mercado, orden, disponible)
VALUES ('Merluza', 'Lluç', 'Hake', 'pescados', true, 3, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio_mercado, orden, disponible)
VALUES ('Lenguado', 'Llenguado', 'Sole', 'pescados', true, 4, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio_mercado, orden, disponible)
VALUES ('Gallo', 'Gall', 'Megrim', 'pescados', true, 5, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio_mercado, orden, disponible)
VALUES ('Centolla', 'Centolla', 'Spider Crab', 'pescados', true, 6, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio_mercado, orden, disponible)
VALUES ('Bogavante', 'Llagosta', 'Lobster', 'pescados', true, 7, true);

-- ============================================
-- CARNES
-- ============================================

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible)
VALUES ('Zorza con Patatas', 'Zorza amb Patates', 'Zorza with Potatoes', 'carnes', 20.00, 1, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible)
VALUES ('Solomillo Ternera Blanca', 'Filet de Vedella Blanca', 'White Veal Tenderloin', 'carnes', 29.00, 2, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible)
VALUES ('Chuleton Madurado', 'Txuleton Madurat', 'Aged T-Bone Steak', 'carnes', 104.00, 3, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible)
VALUES ('Entrecot Madurado', 'Entrecot Madurat', 'Aged Ribeye', 'carnes', 35.00, 4, true);

-- ============================================
-- POSTRES
-- ============================================

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible)
VALUES ('Filloas', 'Filloas', 'Filloas (Galician Crepes)', 'postres', 8.00, 1, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible)
VALUES ('Cañitas', 'Canyetes', 'Cañitas', 'postres', 8.00, 2, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible)
VALUES ('Queso Arzua con Membrillo', 'Formatge Arzua amb Codony', 'Arzua Cheese with Quince', 'postres', 8.00, 3, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible)
VALUES ('Tarta de Santiago', 'Pastís de Santiago', 'Santiago Cake', 'postres', 8.00, 4, true);

INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible)
VALUES ('Tarta de Queso', 'Pastís de Formatge', 'Cheesecake', 'postres', 8.00, 5, true);

-- ============================================
-- VINOS BLANCOS - Godello
-- ============================================

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('Merayo', 'vino_blanco', 'Godello', 17.00, 1, true);

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('Polvorete', 'vino_blanco', 'Godello', 25.00, 2, true);

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('La Gineta', 'vino_blanco', 'Godello', 30.00, 3, true);

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('La Revelia', 'vino_blanco', 'Godello', 61.00, 4, true);

-- ============================================
-- VINOS BLANCOS - Albariño
-- ============================================

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('Pazo Serantellos', 'vino_blanco', 'Albariño', 17.00, 5, true);

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('Pazo Cilleiro', 'vino_blanco', 'Albariño', 21.00, 6, true);

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('Viña Almirante', 'vino_blanco', 'Albariño', 22.00, 7, true);

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('Pazo Baion', 'vino_blanco', 'Albariño', 35.00, 8, true);

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('Terras Vellas', 'vino_blanco', 'Albariño', 36.00, 9, true);

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('Santiago Roma', 'vino_blanco', 'Albariño', 30.00, 10, true);

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('Pazo Señorans', 'vino_blanco', 'Albariño', 40.00, 11, true);

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('Pazo de Rubianes', 'vino_blanco', 'Albariño', 46.00, 12, true);

-- ============================================
-- VINOS BLANCOS - Verdejo
-- ============================================

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('Castillo de la Mota', 'vino_blanco', 'Verdejo', 12.00, 13, true);

INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden, disponible)
VALUES ('Dominio de la Granadilla', 'vino_blanco', 'Verdejo', 21.00, 14, true);

-- ============================================
-- VINOS TINTOS
-- ============================================

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Pujanza', 'vino_tinto', 29.00, 1, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Ponte da Boga', 'vino_tinto', 31.00, 2, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Emilio Moro 50cl', 'vino_tinto', 34.00, 3, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Viña Sastre', 'vino_tinto', 65.00, 4, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Torre Albéniz', 'vino_tinto', 65.00, 5, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Tomás Postigo', 'vino_tinto', 78.00, 6, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Torremilanos', 'vino_tinto', 65.00, 7, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Arzuaga Crianza', 'vino_tinto', 53.00, 8, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Marques de Vargas', 'vino_tinto', 40.00, 9, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Pago de Carraovejas', 'vino_tinto', 78.00, 10, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('La Rioja Alta 904', 'vino_tinto', 130.00, 11, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Pintia Vega Sicilia', 'vino_tinto', 95.00, 12, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Alion Vega Sicilia', 'vino_tinto', 150.00, 13, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Valbuena 5º 2019', 'vino_tinto', 180.00, 14, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Vega Sicilia Único', 'vino_tinto', 450.00, 15, true);

-- ============================================
-- CAVAS Y CHAMPAGNE
-- ============================================

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Marqués de la Concordia', 'cava_champagne', 22.00, 1, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Juve & Camps', 'cava_champagne', 52.00, 2, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Moet Chandon', 'cava_champagne', 85.00, 3, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('La Vinya del Refugi', 'cava_champagne', 94.00, 4, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Taittinger', 'cava_champagne', 125.00, 5, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Louis Roederer', 'cava_champagne', 125.00, 6, true);

INSERT INTO public.menu_items (nombre_es, categoria, precio, orden, disponible)
VALUES ('Bollinger', 'cava_champagne', 120.00, 7, true);

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

SELECT 
    categoria,
    subcategoria,
    COUNT(*) as total_items
FROM public.menu_items
GROUP BY categoria, subcategoria
ORDER BY categoria, subcategoria;

SELECT COUNT(*) as total_general FROM public.menu_items;
