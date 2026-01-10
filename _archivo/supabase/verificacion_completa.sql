-- ============================================
-- VERIFICACIÓN COMPLETA DEL MENÚ
-- ============================================

-- 1. Resumen por categoría
SELECT 
    categoria,
    subcategoria,
    COUNT(*) as total_items,
    COUNT(CASE WHEN disponible = true THEN 1 END) as disponibles,
    COUNT(CASE WHEN precio_mercado = true THEN 1 END) as precio_mercado
FROM public.menu_items
GROUP BY categoria, subcategoria
ORDER BY categoria, subcategoria;

-- 2. Total general
SELECT COUNT(*) as total_items FROM public.menu_items;

-- 3. Ver algunos platos de ejemplo
SELECT nombre_es, nombre_ca, nombre_en, categoria, precio, precio_mercado
FROM public.menu_items
WHERE categoria = 'entrantes'
ORDER BY orden
LIMIT 5;

-- 4. Ver algunos vinos de ejemplo
SELECT nombre_es, categoria, subcategoria, precio
FROM public.menu_items
WHERE categoria = 'vino_blanco'
ORDER BY subcategoria, orden
LIMIT 5;

-- 5. Verificar items con PSM
SELECT nombre_es, categoria
FROM public.menu_items
WHERE precio_mercado = true
ORDER BY categoria, orden;
