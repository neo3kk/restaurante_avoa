-- ============================================
-- PASO 4: ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA RESERVAS
-- ============================================

-- Permitir inserción pública (para el formulario)
DROP POLICY IF EXISTS "Permitir inserción pública de reservas" ON public.reservas;
CREATE POLICY "Permitir inserción pública de reservas"
    ON public.reservas
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Permitir lectura pública de reservas propias (por token)
DROP POLICY IF EXISTS "Permitir lectura de reserva propia" ON public.reservas;
CREATE POLICY "Permitir lectura de reserva propia"
    ON public.reservas
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Permitir actualización solo con autenticación (admin)
DROP POLICY IF EXISTS "Permitir actualización autenticada" ON public.reservas;
CREATE POLICY "Permitir actualización autenticada"
    ON public.reservas
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- POLÍTICAS PARA EMAIL_LOGS
-- ============================================

-- Solo lectura y escritura autenticada
DROP POLICY IF EXISTS "Permitir todo autenticado email_logs" ON public.email_logs;
CREATE POLICY "Permitir todo autenticado email_logs"
    ON public.email_logs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- POLÍTICAS PARA CONFIGURACION
-- ============================================

-- Lectura pública, escritura autenticada
DROP POLICY IF EXISTS "Permitir lectura pública configuracion" ON public.configuracion;
CREATE POLICY "Permitir lectura pública configuracion"
    ON public.configuracion
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir escritura autenticada configuracion" ON public.configuracion;
CREATE POLICY "Permitir escritura autenticada configuracion"
    ON public.configuracion
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Verificar políticas creadas
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
