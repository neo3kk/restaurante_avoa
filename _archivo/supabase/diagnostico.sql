-- ============================================
-- SCRIPT SIMPLIFICADO - SOLO LO ESENCIAL
-- ============================================
-- Ejecuta este script primero para verificar el estado actual

-- Ver qué tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Ver estructura de la tabla configuracion si existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'configuracion'
ORDER BY ordinal_position;
