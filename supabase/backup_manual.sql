-- ============================================
-- SCRIPT DE BACKUP MANUAL
-- Ejecuta esto en Supabase SQL Editor
-- Copia el resultado y guárdalo como backup
-- ============================================

-- BACKUP DE CATEGORIAS
COPY (
    SELECT * FROM categorias_disponibilidad
) TO STDOUT WITH CSV HEADER;

-- BACKUP DE MENU ITEMS
COPY (
    SELECT * FROM menu_items
) TO STDOUT WITH CSV HEADER;

-- BACKUP DE RESERVAS
COPY (
    SELECT * FROM reservas
) TO STDOUT WITH CSV HEADER;

-- BACKUP DE EMAIL LOGS
COPY (
    SELECT * FROM email_logs
) TO STDOUT WITH CSV HEADER;

-- BACKUP DE CONFIGURACION
COPY (
    SELECT * FROM configuracion
) TO STDOUT WITH CSV HEADER;

-- ============================================
-- ALTERNATIVA: GENERAR INSERTS
-- ============================================

-- Generar INSERT statements para categorías
SELECT 
    'INSERT INTO categorias_disponibilidad (id, categoria, nombre_es, nombre_ca, nombre_en, disponible, temporada, orden) VALUES (' ||
    quote_literal(id::text) || '::uuid, ' ||
    quote_literal(categoria) || ', ' ||
    quote_literal(nombre_es) || ', ' ||
    COALESCE(quote_literal(nombre_ca), 'NULL') || ', ' ||
    COALESCE(quote_literal(nombre_en), 'NULL') || ', ' ||
    disponible || ', ' ||
    COALESCE(quote_literal(temporada), 'NULL') || ', ' ||
    COALESCE(orden::text, 'NULL') || ');'
FROM categorias_disponibilidad
ORDER BY orden;

-- Generar INSERT statements para menu_items
SELECT 
    'INSERT INTO menu_items (id, nombre_es, nombre_ca, nombre_en, categoria, precio, precio_mercado, subcategoria, unidad, orden, descripcion_es, descripcion_ca, descripcion_en, disponible) VALUES (' ||
    quote_literal(id::text) || '::uuid, ' ||
    quote_literal(nombre_es) || ', ' ||
    COALESCE(quote_literal(nombre_ca), 'NULL') || ', ' ||
    COALESCE(quote_literal(nombre_en), 'NULL') || ', ' ||
    quote_literal(categoria) || ', ' ||
    COALESCE(precio::text, 'NULL') || ', ' ||
    COALESCE(precio_mercado::text, 'false') || ', ' ||
    COALESCE(quote_literal(subcategoria), 'NULL') || ', ' ||
    COALESCE(quote_literal(unidad), 'NULL') || ', ' ||
    COALESCE(orden::text, '0') || ', ' ||
    COALESCE(quote_literal(descripcion_es), 'NULL') || ', ' ||
    COALESCE(quote_literal(descripcion_ca), 'NULL') || ', ' ||
    COALESCE(quote_literal(descripcion_en), 'NULL') || ', ' ||
    disponible || ');'
FROM menu_items
ORDER BY categoria, orden;
