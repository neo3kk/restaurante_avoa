-- ============================================
-- PASO 2: ACTUALIZAR RESTRICCIONES E ÍNDICES
-- ============================================
-- Ejecuta este bloque DESPUÉS del Paso 1

-- Eliminar la restricción existente (si existe)
ALTER TABLE public.menu_items DROP CONSTRAINT IF EXISTS menu_items_categoria_check;

-- NO agregamos nueva restricción para permitir flexibilidad
-- Las categorías válidas serán: entrantes, platos_calientes, pescados, carnes, postres, vino_blanco, vino_tinto, cava_champagne

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_menu_items_subcategoria ON public.menu_items(subcategoria);

-- Crear trigger para updated_at
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

-- Verificar
SELECT 'Índices y triggers actualizados correctamente' as status;
