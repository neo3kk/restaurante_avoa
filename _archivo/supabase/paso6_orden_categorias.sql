-- ============================================
-- ACTUALIZACIÓN: Agregar campo de orden a categorías
-- ============================================

-- Agregar columna de orden si no existe
ALTER TABLE public.categorias_disponibilidad 
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0;

-- Actualizar orden de categorías existentes
UPDATE public.categorias_disponibilidad SET orden = 1 WHERE categoria = 'entrantes';
UPDATE public.categorias_disponibilidad SET orden = 2 WHERE categoria = 'platos_calientes';
UPDATE public.categorias_disponibilidad SET orden = 3 WHERE categoria = 'pescados';
UPDATE public.categorias_disponibilidad SET orden = 4 WHERE categoria = 'carnes';
UPDATE public.categorias_disponibilidad SET orden = 5 WHERE categoria = 'postres';
UPDATE public.categorias_disponibilidad SET orden = 6 WHERE categoria = 'vino_blanco';
UPDATE public.categorias_disponibilidad SET orden = 7 WHERE categoria = 'vino_tinto';
UPDATE public.categorias_disponibilidad SET orden = 8 WHERE categoria = 'cava_champagne';

-- Crear índice para orden
CREATE INDEX IF NOT EXISTS idx_categorias_orden ON public.categorias_disponibilidad(orden);

-- Verificar
SELECT categoria, nombre_es, orden, disponible FROM public.categorias_disponibilidad ORDER BY orden;
