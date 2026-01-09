-- ============================================
-- PASO 1: AGREGAR COLUMNAS FALTANTES
-- ============================================
-- Ejecuta SOLO este bloque primero

ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS nombre_ca TEXT,
ADD COLUMN IF NOT EXISTS nombre_en TEXT,
ADD COLUMN IF NOT EXISTS descripcion_es TEXT,
ADD COLUMN IF NOT EXISTS descripcion_ca TEXT,
ADD COLUMN IF NOT EXISTS descripcion_en TEXT,
ADD COLUMN IF NOT EXISTS subcategoria TEXT,
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS precio_mercado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS unidad TEXT,
ADD COLUMN IF NOT EXISTS destacado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS imagen_url TEXT,
ADD COLUMN IF NOT EXISTS alergenos TEXT[],
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Verificar que se agregaron las columnas
SELECT column_name 
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'menu_items'
ORDER BY ordinal_position;
