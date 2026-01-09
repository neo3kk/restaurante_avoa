-- ============================================
-- TABLA DE MENÚ (PLATOS Y VINOS)
-- ============================================

CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_es TEXT NOT NULL,
    nombre_ca TEXT,
    nombre_en TEXT,
    descripcion_es TEXT,
    descripcion_ca TEXT,
    descripcion_en TEXT,
    precio DECIMAL(10,2),
    categoria TEXT NOT NULL CHECK (categoria IN (
        'entrantes',
        'platos_calientes',
        'pescados',
        'carnes',
        'postres',
        'vino_blanco',
        'vino_tinto',
        'cava_champagne'
    )),
    subcategoria TEXT, -- Para vinos: 'godello', 'albariño', 'verdejo', etc.
    orden INTEGER DEFAULT 0, -- Para ordenar los items dentro de cada categoría
    disponible BOOLEAN DEFAULT true,
    precio_mercado BOOLEAN DEFAULT false, -- Para items con precio según mercado (PSM)
    unidad TEXT, -- Para items que se venden por unidad: 'ud', 'kg', etc.
    destacado BOOLEAN DEFAULT false, -- Para marcar platos destacados
    imagen_url TEXT,
    alergenos TEXT[], -- Array de alérgenos
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_menu_items_categoria ON public.menu_items(categoria);
CREATE INDEX IF NOT EXISTS idx_menu_items_disponible ON public.menu_items(disponible);
CREATE INDEX IF NOT EXISTS idx_menu_items_orden ON public.menu_items(orden);

-- Comentarios
COMMENT ON TABLE public.menu_items IS 'Elementos del menú: platos, pescados, carnes, postres y vinos';
COMMENT ON COLUMN public.menu_items.categoria IS 'Categoría del item: entrantes, platos_calientes, pescados, carnes, postres, vino_blanco, vino_tinto, cava_champagne';
COMMENT ON COLUMN public.menu_items.subcategoria IS 'Subcategoría para vinos: godello, albariño, verdejo, etc.';
COMMENT ON COLUMN public.menu_items.precio_mercado IS 'Si es true, se muestra "Precio según mercado" en lugar del precio';
COMMENT ON COLUMN public.menu_items.orden IS 'Orden de aparición dentro de la categoría (menor número = aparece primero)';

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública (para mostrar el menú)
DROP POLICY IF EXISTS "Permitir lectura pública menu_items" ON public.menu_items;
CREATE POLICY "Permitir lectura pública menu_items"
    ON public.menu_items
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Permitir escritura solo autenticada (admin)
DROP POLICY IF EXISTS "Permitir escritura autenticada menu_items" ON public.menu_items;
CREATE POLICY "Permitir escritura autenticada menu_items"
    ON public.menu_items
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- TRIGGER PARA ACTUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES - PLATOS
-- ============================================

-- ENTRANTES
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, unidad, orden) VALUES
('Empanada Gallega', 'Empanada Gallega', 'Galician Empanada', 'entrantes', 7.00, NULL, 1),
('Ensalada Bonito', 'Amanida de Bonítol', 'Bonito Salad', 'entrantes', 21.00, NULL, 2),
('Pulpo a Feira', 'Pop a Feira', 'Galician-Style Octopus', 'entrantes', 28.00, NULL, 3),
('Anchoas 00', 'Anxoves 00', 'Premium Anchovies 00', 'entrantes', 4.00, 'ud', 4),
('Zamburiñas', 'Zamburiñas', 'Queen Scallops', 'entrantes', 28.00, NULL, 5),
('Jamón Ibérico', 'Pernil Ibèric', 'Iberian Ham', 'entrantes', 35.00, NULL, 6),
('Tirabeques', 'Pèsols Tendres', 'Snow Peas', 'entrantes', 14.00, NULL, 7),
('Queso con Anchoas', 'Formatge amb Anxoves', 'Cheese with Anchovies', 'entrantes', 5.00, 'ud', 8),
('Croquetas de Ibérico', 'Croquetes d''Ibèric', 'Iberian Croquettes', 'entrantes', 4.00, 'ud', 9),
('Buñuelos', 'Bunyols', 'Fritters', 'entrantes', 4.00, 'ud', 10),
('Calamar de Potera', 'Calamar de Potera', 'Squid', 'entrantes', 30.00, NULL, 11),
('Alcachofas', 'Carxofes', 'Artichokes', 'entrantes', 9.00, NULL, 12),
('Angulas', 'Angules', 'Baby Eels', 'entrantes', NULL, NULL, 13);

-- Marcar Angulas como precio según mercado
UPDATE public.menu_items SET precio_mercado = true WHERE nombre_es = 'Angulas';

-- Agregar descripción a Buñuelos
UPDATE public.menu_items 
SET descripcion_es = '(Bacalao / Merluza)',
    descripcion_ca = '(Bacallà / Lluç)',
    descripcion_en = '(Cod / Hake)'
WHERE nombre_es = 'Buñuelos';

-- PLATOS CALIENTES
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, descripcion_es, descripcion_ca, descripcion_en, categoria, precio, orden) VALUES
('Alubias', 'Mongetes', 'White Beans', 'con Almejas o Pulpo', 'amb Cloïsses o Pop', 'with Clams or Octopus', 'platos_calientes', 30.00, 1),
('Caldo Gallego', 'Brou Gallec', 'Galician Broth', NULL, NULL, NULL, 'platos_calientes', 7.00, 2),
('Callos', 'Callos', 'Tripe Stew', NULL, NULL, NULL, 'platos_calientes', 16.00, 3);

-- PESCADOS (Precio Según Mercado)
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio_mercado, orden) VALUES
('Lubina', 'Llobarro', 'Sea Bass', 'pescados', true, 1),
('Rodaballo', 'Rèmol', 'Turbot', 'pescados', true, 2),
('Merluza', 'Lluç', 'Hake', 'pescados', true, 3),
('Lenguado', 'Llenguado', 'Sole', 'pescados', true, 4),
('Gallo', 'Gall', 'Megrim', 'pescados', true, 5),
('Centolla', 'Centolla', 'Spider Crab', 'pescados', true, 6),
('Bogavante', 'Llagosta', 'Lobster', 'pescados', true, 7);

-- CARNES
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden) VALUES
('Zorza con Patatas', 'Zorza amb Patates', 'Zorza with Potatoes', 'carnes', 20.00, 1),
('Solomillo Ternera Blanca', 'Filet de Vedella Blanca', 'White Veal Tenderloin', 'carnes', 29.00, 2),
('Chuleton Madurado', 'Txuleton Madurat', 'Aged T-Bone Steak', 'carnes', 104.00, 3),
('Entrecot Madurado', 'Entrecot Madurat', 'Aged Ribeye', 'carnes', 35.00, 4);

-- POSTRES (todos al mismo precio)
INSERT INTO public.menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden) VALUES
('Filloas', 'Filloas', 'Filloas (Galician Crepes)', 'postres', 8.00, 1),
('Cañitas', 'Canyetes', 'Cañitas', 'postres', 8.00, 2),
('Queso Arzua con Membrillo', 'Formatge Arzua amb Codony', 'Arzua Cheese with Quince', 'postres', 8.00, 3),
('Tarta de Santiago', 'Pastís de Santiago', 'Santiago Cake', 'postres', 8.00, 4),
('Tarta de Queso', 'Pastís de Formatge', 'Cheesecake', 'postres', 8.00, 5);

-- ============================================
-- DATOS INICIALES - VINOS
-- ============================================

-- Insertar vinos blancos - Godello
INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden) VALUES
('Merayo', 'vino_blanco', 'Godello', 17.00, 1),
('Polvorete', 'vino_blanco', 'Godello', 25.00, 2),
('La Gineta', 'vino_blanco', 'Godello', 30.00, 3),
('La Revelia', 'vino_blanco', 'Godello', 61.00, 4);

-- Insertar vinos blancos - Albariño
INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden) VALUES
('Pazo Serantellos', 'vino_blanco', 'Albariño', 17.00, 5),
('Pazo Cilleiro', 'vino_blanco', 'Albariño', 21.00, 6),
('Viña Almirante', 'vino_blanco', 'Albariño', 22.00, 7),
('Pazo Baion', 'vino_blanco', 'Albariño', 35.00, 8),
('Terras Vellas', 'vino_blanco', 'Albariño', 36.00, 9),
('Santiago Roma', 'vino_blanco', 'Albariño', 30.00, 10),
('Pazo Señorans', 'vino_blanco', 'Albariño', 40.00, 11),
('Pazo de Rubianes', 'vino_blanco', 'Albariño', 46.00, 12);

-- Insertar vinos blancos - Verdejo
INSERT INTO public.menu_items (nombre_es, categoria, subcategoria, precio, orden) VALUES
('Castillo de la Mota', 'vino_blanco', 'Verdejo', 12.00, 13),
('Dominio de la Granadilla', 'vino_blanco', 'Verdejo', 21.00, 14);

-- Insertar vinos tintos
INSERT INTO public.menu_items (nombre_es, categoria, precio, orden) VALUES
('Pujanza', 'vino_tinto', 29.00, 1),
('Ponte da Boga', 'vino_tinto', 31.00, 2),
('Emilio Moro 50cl', 'vino_tinto', 34.00, 3),
('Viña Sastre', 'vino_tinto', 65.00, 4),
('Torre Albéniz', 'vino_tinto', 65.00, 5),
('Tomás Postigo', 'vino_tinto', 78.00, 6),
('Torremilanos', 'vino_tinto', 65.00, 7),
('Arzuaga Crianza', 'vino_tinto', 53.00, 8),
('Marques de Vargas', 'vino_tinto', 40.00, 9),
('Pago de Carraovejas', 'vino_tinto', 78.00, 10),
('La Rioja Alta 904', 'vino_tinto', 130.00, 11),
('Pintia Vega Sicilia', 'vino_tinto', 95.00, 12),
('Alion Vega Sicilia', 'vino_tinto', 150.00, 13),
('Valbuena 5º 2019', 'vino_tinto', 180.00, 14),
('Vega Sicilia Único', 'vino_tinto', 450.00, 15);

-- Insertar cavas y champagne
INSERT INTO public.menu_items (nombre_es, categoria, precio, orden) VALUES
('Marqués de la Concordia', 'cava_champagne', 22.00, 1),
('Juve & Camps', 'cava_champagne', 52.00, 2),
('Moet Chandon', 'cava_champagne', 85.00, 3),
('La Vinya del Refugi', 'cava_champagne', 94.00, 4),
('Taittinger', 'cava_champagne', 125.00, 5),
('Louis Roederer', 'cava_champagne', 125.00, 6),
('Bollinger', 'cava_champagne', 120.00, 7);

-- ============================================
-- VERIFICACIÓN
-- ============================================

SELECT 
    categoria,
    subcategoria,
    COUNT(*) as total_items
FROM public.menu_items
GROUP BY categoria, subcategoria
ORDER BY categoria, subcategoria;
