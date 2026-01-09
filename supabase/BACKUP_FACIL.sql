-- ============================================
-- BACKUP SIMPLIFICADO - SOLO COPIAR Y EJECUTAR
-- ============================================
-- Instrucciones:
-- 1. Ejecuta este script en Supabase SQL Editor
-- 2. Ve a la pestaña "Results"
-- 3. Copia TODO el contenido de la columna "sql_backup"
-- 4. Pégalo en un archivo .sql
-- ============================================

-- Crear una tabla temporal para almacenar el backup
CREATE TEMP TABLE backup_temp (sql_backup TEXT);

-- Insertar header
INSERT INTO backup_temp VALUES ('-- ============================================');
INSERT INTO backup_temp VALUES ('-- BACKUP DE DATOS - ' || CURRENT_DATE::TEXT);
INSERT INTO backup_temp VALUES ('-- ============================================');
INSERT INTO backup_temp VALUES ('');

-- Backup de categorías
INSERT INTO backup_temp VALUES ('-- CATEGORIAS');
INSERT INTO backup_temp 
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

INSERT INTO backup_temp VALUES ('');
INSERT INTO backup_temp VALUES ('-- MENU ITEMS');

-- Backup de menu_items
INSERT INTO backup_temp 
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

INSERT INTO backup_temp VALUES ('');
INSERT INTO backup_temp VALUES ('-- SUBCATEGORIAS VINOS');

-- Backup de subcategorias_vinos
INSERT INTO backup_temp 
SELECT 
    'INSERT INTO subcategorias_vinos (id, nombre, categoria_padre, orden, disponible) VALUES (' ||
    quote_literal(id::text) || '::uuid, ' ||
    quote_literal(nombre) || ', ' ||
    quote_literal(categoria_padre) || ', ' ||
    COALESCE(orden::text, '0') || ', ' ||
    disponible || ');'
FROM subcategorias_vinos
ORDER BY orden;

-- Mostrar todo el backup
SELECT sql_backup FROM backup_temp;
