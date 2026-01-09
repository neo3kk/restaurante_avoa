-- ============================================
-- DIAGNÓSTICO: Ver estructura actual de la tabla
-- ============================================
-- Ejecuta este script primero para ver qué columnas tiene tu tabla

-- Ver todas las columnas de la tabla menu_items
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'menu_items'
ORDER BY ordinal_position;

-- Ver cuántos registros hay
SELECT COUNT(*) as total_registros FROM public.menu_items;

-- Ver qué datos hay actualmente
SELECT * FROM public.menu_items LIMIT 5;
