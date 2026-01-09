-- ============================================
-- BACKUP COMPLETO DEL PROYECTO SUPABASE
-- ============================================
-- Este script genera un backup completo incluyendo:
-- - Estructura de tablas
-- - Funciones SQL
-- - Triggers
-- - Políticas RLS
-- - Datos
-- ============================================

-- ============================================
-- PARTE 1: ESTRUCTURA DE TABLAS
-- ============================================

-- Tabla: reservas
CREATE TABLE IF NOT EXISTS public.reservas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    num_personas INTEGER NOT NULL CHECK (num_personas > 0),
    comentarios TEXT,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: email_logs
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID REFERENCES public.reservas(id),
    tipo_email TEXT NOT NULL,
    destinatario TEXT NOT NULL,
    asunto TEXT NOT NULL,
    enviado_exitosamente BOOLEAN DEFAULT false,
    error_mensaje TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: configuracion
CREATE TABLE IF NOT EXISTS public.configuracion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clave TEXT UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: menu_items
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_es TEXT NOT NULL,
    nombre_ca TEXT,
    nombre_en TEXT,
    descripcion_es TEXT,
    descripcion_ca TEXT,
    descripcion_en TEXT,
    categoria TEXT NOT NULL,
    subcategoria TEXT,
    precio DECIMAL(10,2),
    precio_mercado BOOLEAN DEFAULT false,
    unidad TEXT,
    orden INTEGER DEFAULT 0,
    disponible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: categorias_disponibilidad
CREATE TABLE IF NOT EXISTS public.categorias_disponibilidad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria TEXT UNIQUE NOT NULL,
    disponible BOOLEAN DEFAULT true,
    nombre_es TEXT NOT NULL,
    nombre_ca TEXT,
    nombre_en TEXT,
    descripcion TEXT,
    temporada TEXT,
    orden INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: subcategorias_vinos
CREATE TABLE IF NOT EXISTS public.subcategorias_vinos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT UNIQUE NOT NULL,
    categoria_vino TEXT NOT NULL,
    descripcion TEXT,
    orden INTEGER DEFAULT 0,
    disponible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PARTE 2: ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON public.reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON public.reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_email ON public.reservas(email);
CREATE INDEX IF NOT EXISTS idx_email_logs_reserva_id ON public.email_logs(reserva_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_categoria ON public.menu_items(categoria);
CREATE INDEX IF NOT EXISTS idx_menu_items_disponible ON public.menu_items(disponible);
CREATE INDEX IF NOT EXISTS idx_categorias_disponibilidad_categoria ON public.categorias_disponibilidad(categoria);
CREATE INDEX IF NOT EXISTS idx_categorias_disponibilidad_disponible ON public.categorias_disponibilidad(disponible);

-- ============================================
-- PARTE 3: FUNCIONES
-- ============================================

-- Función: update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función: get_menu_items_disponibles
CREATE OR REPLACE FUNCTION get_menu_items_disponibles()
RETURNS TABLE (
    id UUID,
    nombre_es TEXT,
    nombre_ca TEXT,
    nombre_en TEXT,
    descripcion_es TEXT,
    descripcion_ca TEXT,
    descripcion_en TEXT,
    categoria TEXT,
    subcategoria TEXT,
    precio DECIMAL(10,2),
    precio_mercado BOOLEAN,
    unidad TEXT,
    orden INTEGER,
    disponible BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mi.id,
        mi.nombre_es,
        mi.nombre_ca,
        mi.nombre_en,
        mi.descripcion_es,
        mi.descripcion_ca,
        mi.descripcion_en,
        mi.categoria,
        mi.subcategoria,
        mi.precio,
        mi.precio_mercado,
        mi.unidad,
        mi.orden,
        mi.disponible
    FROM public.menu_items mi
    INNER JOIN public.categorias_disponibilidad cd ON mi.categoria = cd.categoria
    WHERE mi.disponible = true 
      AND cd.disponible = true
    ORDER BY mi.categoria, mi.subcategoria, mi.orden, mi.nombre_es;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PARTE 4: TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS update_reservas_updated_at ON public.reservas;
CREATE TRIGGER update_reservas_updated_at
    BEFORE UPDATE ON public.reservas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_configuracion_updated_at ON public.configuracion;
CREATE TRIGGER update_configuracion_updated_at
    BEFORE UPDATE ON public.configuracion
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categorias_disponibilidad_updated_at ON public.categorias_disponibilidad;
CREATE TRIGGER update_categorias_disponibilidad_updated_at
    BEFORE UPDATE ON public.categorias_disponibilidad
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subcategorias_vinos_updated_at ON public.subcategorias_vinos;
CREATE TRIGGER update_subcategorias_vinos_updated_at
    BEFORE UPDATE ON public.subcategorias_vinos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PARTE 5: ROW LEVEL SECURITY (RLS)
-- ============================================

-- Reservas
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura autenticada reservas" ON public.reservas;
CREATE POLICY "Permitir lectura autenticada reservas"
    ON public.reservas FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir escritura autenticada reservas" ON public.reservas;
CREATE POLICY "Permitir escritura autenticada reservas"
    ON public.reservas FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir inserción anónima reservas" ON public.reservas;
CREATE POLICY "Permitir inserción anónima reservas"
    ON public.reservas FOR INSERT
    TO anon
    WITH CHECK (true);

-- Email Logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura autenticada email_logs" ON public.email_logs;
CREATE POLICY "Permitir lectura autenticada email_logs"
    ON public.email_logs FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir escritura autenticada email_logs" ON public.email_logs;
CREATE POLICY "Permitir escritura autenticada email_logs"
    ON public.email_logs FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Configuración
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura pública configuracion" ON public.configuracion;
CREATE POLICY "Permitir lectura pública configuracion"
    ON public.configuracion FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir escritura autenticada configuracion" ON public.configuracion;
CREATE POLICY "Permitir escritura autenticada configuracion"
    ON public.configuracion FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Menu Items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura pública menu_items" ON public.menu_items;
CREATE POLICY "Permitir lectura pública menu_items"
    ON public.menu_items FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir escritura autenticada menu_items" ON public.menu_items;
CREATE POLICY "Permitir escritura autenticada menu_items"
    ON public.menu_items FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Categorías Disponibilidad
ALTER TABLE public.categorias_disponibilidad ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura pública categorias_disponibilidad" ON public.categorias_disponibilidad;
CREATE POLICY "Permitir lectura pública categorias_disponibilidad"
    ON public.categorias_disponibilidad FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir escritura autenticada categorias_disponibilidad" ON public.categorias_disponibilidad;
CREATE POLICY "Permitir escritura autenticada categorias_disponibilidad"
    ON public.categorias_disponibilidad FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Subcategorías Vinos
ALTER TABLE public.subcategorias_vinos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura pública subcategorias_vinos" ON public.subcategorias_vinos;
CREATE POLICY "Permitir lectura pública subcategorias_vinos"
    ON public.subcategorias_vinos FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir escritura autenticada subcategorias_vinos" ON public.subcategorias_vinos;
CREATE POLICY "Permitir escritura autenticada subcategorias_vinos"
    ON public.subcategorias_vinos FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- PARTE 6: DATOS
-- ============================================
-- NOTA: Ejecuta el script backup_manual.sql después de este
-- para exportar los datos actuales
-- ============================================
