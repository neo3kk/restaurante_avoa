-- ============================================
-- DIAGNÓSTICO: Ver qué se insertó
-- ============================================

-- Ver cuántos items hay por categoría
SELECT categoria, COUNT(*) as cantidad
FROM public.menu_items
GROUP BY categoria
ORDER BY categoria;

-- Ver todos los items actuales
SELECT id, nombre_es, categoria, subcategoria, precio, disponible
FROM public.menu_items
ORDER BY categoria, orden;

-- Ver si hay errores en los INSERT (verificar estructura)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'menu_items'
ORDER BY ordinal_position;
