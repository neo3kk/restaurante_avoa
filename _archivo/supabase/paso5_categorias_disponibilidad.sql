-- ============================================
-- TABLA DE DISPONIBILIDAD DE CATEGORÍAS
-- ============================================

CREATE TABLE IF NOT EXISTS public.categorias_disponibilidad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria TEXT UNIQUE NOT NULL,
    disponible BOOLEAN DEFAULT true,
    nombre_es TEXT NOT NULL,
    nombre_ca TEXT,
    nombre_en TEXT,
    descripcion TEXT,
    temporada TEXT, -- 'todo_año', 'invierno', 'verano', 'primavera', 'otoño'
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_categorias_disponibilidad_categoria ON public.categorias_disponibilidad(categoria);
CREATE INDEX IF NOT EXISTS idx_categorias_disponibilidad_disponible ON public.categorias_disponibilidad(disponible);

-- Comentarios
COMMENT ON TABLE public.categorias_disponibilidad IS 'Control de disponibilidad de categorías completas del menú';
COMMENT ON COLUMN public.categorias_disponibilidad.temporada IS 'Temporada en la que está disponible: todo_año, invierno, verano, primavera, otoño';

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.categorias_disponibilidad ENABLE ROW LEVEL SECURITY;

-- Lectura pública
DROP POLICY IF EXISTS "Permitir lectura pública categorias_disponibilidad" ON public.categorias_disponibilidad;
CREATE POLICY "Permitir lectura pública categorias_disponibilidad"
    ON public.categorias_disponibilidad
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Escritura autenticada
DROP POLICY IF EXISTS "Permitir escritura autenticada categorias_disponibilidad" ON public.categorias_disponibilidad;
CREATE POLICY "Permitir escritura autenticada categorias_disponibilidad"
    ON public.categorias_disponibilidad
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- TRIGGER PARA UPDATED_AT
-- ============================================

DROP TRIGGER IF EXISTS update_categorias_disponibilidad_updated_at ON public.categorias_disponibilidad;
CREATE TRIGGER update_categorias_disponibilidad_updated_at
    BEFORE UPDATE ON public.categorias_disponibilidad
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES
-- ============================================

INSERT INTO public.categorias_disponibilidad (categoria, nombre_es, nombre_ca, nombre_en, disponible, temporada) VALUES
('entrantes', 'Entrantes', 'Entrants', 'Starters', true, 'todo_año'),
('platos_calientes', 'Platos Calientes', 'Plats Calents', 'Hot Dishes', true, 'todo_año'),
('pescados', 'Pescados', 'Peixos', 'Fish', true, 'todo_año'),
('carnes', 'Carnes', 'Carns', 'Meats', true, 'todo_año'),
('postres', 'Postres', 'Postres', 'Desserts', true, 'todo_año'),
('vino_blanco', 'Vinos Blancos', 'Vins Blancs', 'White Wines', true, 'todo_año'),
('vino_tinto', 'Vinos Tintos', 'Vins Negres', 'Red Wines', true, 'todo_año'),
('cava_champagne', 'Cavas y Champagne', 'Caves i Champagne', 'Cavas & Champagne', true, 'todo_año')
ON CONFLICT (categoria) DO NOTHING;

-- ============================================
-- FUNCIÓN PARA OBTENER ITEMS DISPONIBLES
-- ============================================

CREATE OR REPLACE FUNCTION get_menu_items_disponibles()
RETURNS TABLE (
    id UUID,
    nombre_es TEXT,
    nombre_ca TEXT,
    nombre_en TEXT,
    descripcion_es TEXT,
    descripcion_ca TEXT,
    descripcion_en TEXT,
    categoria TEXT,
    subcategoria TEXT,
    precio DECIMAL(10,2),
    precio_mercado BOOLEAN,
    unidad TEXT,
    orden INTEGER,
    disponible BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mi.id,
        mi.nombre_es,
        mi.nombre_ca,
        mi.nombre_en,
        mi.descripcion_es,
        mi.descripcion_ca,
        mi.descripcion_en,
        mi.categoria,
        mi.subcategoria,
        mi.precio,
        mi.precio_mercado,
        mi.unidad,
        mi.orden,
        mi.disponible
    FROM public.menu_items mi
    INNER JOIN public.categorias_disponibilidad cd ON mi.categoria = cd.categoria
    WHERE mi.disponible = true 
      AND cd.disponible = true
    ORDER BY mi.categoria, mi.subcategoria, mi.orden, mi.nombre_es;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_menu_items_disponibles() IS 'Obtiene solo los items cuya categoría y el item mismo están disponibles';

-- ============================================
-- VERIFICACIÓN
-- ============================================

SELECT * FROM public.categorias_disponibilidad ORDER BY categoria;
