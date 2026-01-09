-- ============================================
-- BACKUP DE DATOS - 2026-01-09
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

-- Generar INSERT statements para reservas
SELECT 
    'INSERT INTO reservas (id, nombre, email, telefono, fecha, hora, personas, comentarios, estado, created_at) VALUES (' ||
    quote_literal(id::text) || '::uuid, ' ||
    quote_literal(nombre) || ', ' ||
    quote_literal(email) || ', ' ||
    quote_literal(telefono) || ', ' ||
    quote_literal(fecha::text) || '::date, ' ||
    quote_literal(hora::text) || '::time, ' ||
    personas || ', ' ||
    COALESCE(quote_literal(comentarios), 'NULL') || ', ' ||
    quote_literal(estado) || ', ' ||
    quote_literal(created_at::text) || '::timestamp);'
FROM reservas
ORDER BY created_at DESC;

-- Generar INSERT statements para configuracion
SELECT 
    'INSERT INTO configuracion (id, clave, valor, descripcion) VALUES (' ||
    quote_literal(id::text) || '::uuid, ' ||
    quote_literal(clave) || ', ' ||
    COALESCE(quote_literal(valor), 'NULL') || ', ' ||
    COALESCE(quote_literal(descripcion), 'NULL') || ');'
FROM configuracion
ORDER BY clave;

-- Generar INSERT statements para subcategorias_vinos
SELECT 
    'INSERT INTO subcategorias_vinos (id, nombre, categoria_padre, orden, disponible) VALUES (' ||
    quote_literal(id::text) || '::uuid, ' ||
    quote_literal(nombre) || ', ' ||
    quote_literal(categoria_padre) || ', ' ||
    COALESCE(orden::text, '0') || ', ' ||
    disponible || ');'
FROM subcategorias_vinos
ORDER BY orden;
