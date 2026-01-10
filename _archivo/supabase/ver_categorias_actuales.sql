-- Ver qué categorías existen actualmente en la tabla
SELECT DISTINCT categoria, COUNT(*) as cantidad
FROM public.menu_items
GROUP BY categoria
ORDER BY categoria;
