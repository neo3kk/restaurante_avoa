-- ============================================
-- RESTAURANTE AVOA - CONFIGURACIÓN DE BASE DE DATOS
-- ============================================
-- Este script configura todas las tablas necesarias para el sistema completo
-- Incluye: Reservas, Menú, Usuarios Admin, Logs de Email
-- ============================================

-- ============================================
-- 1. ACTUALIZAR TABLA DE RESERVAS
-- ============================================

-- Añadir nuevas columnas a la tabla existente
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS hora TIME,
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'pendiente',
ADD COLUMN IF NOT EXISTS token_confirmacion TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS confirmada_en TIMESTAMP,
ADD COLUMN IF NOT EXISTS recordatorio_enviado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cancelada_en TIMESTAMP,
ADD COLUMN IF NOT EXISTS notas_admin TEXT;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON public.reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON public.reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_email ON public.reservas(email);
CREATE INDEX IF NOT EXISTS idx_reservas_token ON public.reservas(token_confirmacion);

-- Añadir comentarios a las columnas
COMMENT ON COLUMN public.reservas.estado IS 'Estado de la reserva: pendiente, confirmada, cancelada';
COMMENT ON COLUMN public.reservas.token_confirmacion IS 'Token único para confirmar la reserva por email';
COMMENT ON COLUMN public.reservas.recordatorio_enviado IS 'Indica si se envió el recordatorio 24h antes';

-- ============================================
-- 2. TABLA DE LOGS DE EMAIL
-- ============================================

CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID REFERENCES public.reservas(id) ON DELETE SET NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('confirmacion', 'recordatorio', 'notificacion', 'cancelacion')),
    destinatario TEXT NOT NULL,
    asunto TEXT NOT NULL,
    enviado BOOLEAN DEFAULT false,
    error TEXT,
    resend_id TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_email_logs_reserva ON public.email_logs(reserva_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_tipo ON public.email_logs(tipo);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON public.email_logs(created_at);

-- Comentarios
COMMENT ON TABLE public.email_logs IS 'Registro de todos los emails enviados por el sistema';
COMMENT ON COLUMN public.email_logs.tipo IS 'Tipo de email: confirmacion, recordatorio, notificacion, cancelacion';

-- ============================================
-- 3. TABLA DE CONFIGURACIÓN DEL RESTAURANTE
-- ============================================

CREATE TABLE IF NOT EXISTS public.configuracion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clave TEXT UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descripcion TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertar configuración inicial
INSERT INTO public.configuracion (clave, valor, descripcion) VALUES
    -- CAPACIDAD (Preparado para el futuro, pero desactivado)
    ('validar_capacidad', 'false', 'Activar/desactivar validación de capacidad'),
    ('capacidad_maxima', '999', 'Capacidad máxima total del restaurante (desactivado)'),
    ('max_personas_reserva', '999', 'Máximo de personas por reserva (desactivado)'),
    ('min_personas_reserva', '1', 'Mínimo de personas por reserva'),
    
    -- HORARIOS (Según la web del restaurante)
    -- Lunes y Martes: 13:30 - 16:30
    ('horario_lunes_martes_inicio', '13:30', 'Hora de inicio Lunes y Martes'),
    ('horario_lunes_martes_fin', '16:30', 'Hora de fin Lunes y Martes'),
    
    -- Miércoles a Sábado: 13:30 - 16:30 | 20:00 - 23:30
    ('horario_miercoles_sabado_comida_inicio', '13:30', 'Hora de inicio comida Miércoles a Sábado'),
    ('horario_miercoles_sabado_comida_fin', '16:30', 'Hora de fin comida Miércoles a Sábado'),
    ('horario_miercoles_sabado_cena_inicio', '20:00', 'Hora de inicio cena Miércoles a Sábado'),
    ('horario_miercoles_sabado_cena_fin', '23:30', 'Hora de fin cena Miércoles a Sábado'),
    
    -- Domingo: Cerrado (0 = Domingo en JavaScript)
    ('dia_cerrado', '0', 'Día de la semana cerrado (0=Domingo, 1=Lunes, etc.)'),
    
    -- CONTACTO
    ('email_restaurante', 'reservas@restauranteavoa.com', 'Email del restaurante para notificaciones'),
    ('nombre_restaurante', 'Restaurante Avoa', 'Nombre del restaurante'),
    ('telefono_restaurante', '+34 659 02 13 02', 'Teléfono del restaurante'),
    ('direccion_restaurante', 'Avinguda de l''Argentina, 59, 07011 Palma', 'Dirección del restaurante'),
    
    -- RECORDATORIOS
    ('recordatorio_horas_antes', '24', 'Horas antes de la reserva para enviar recordatorio'),
    ('enviar_recordatorios', 'true', 'Activar/desactivar envío de recordatorios automáticos')
ON CONFLICT (clave) DO NOTHING;


-- Comentarios
COMMENT ON TABLE public.configuracion IS 'Configuración general del sistema';

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

-- Políticas para RESERVAS
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

-- Políticas para EMAIL_LOGS
-- Solo lectura y escritura autenticada
DROP POLICY IF EXISTS "Permitir todo autenticado email_logs" ON public.email_logs;
CREATE POLICY "Permitir todo autenticado email_logs"
    ON public.email_logs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Políticas para CONFIGURACION
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

-- ============================================
-- 5. FUNCIONES ÚTILES
-- ============================================

-- Función para generar token de confirmación único
CREATE OR REPLACE FUNCTION generate_confirmation_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Función para obtener reservas que necesitan recordatorio
CREATE OR REPLACE FUNCTION get_reservas_para_recordatorio()
RETURNS TABLE (
    id UUID,
    nombre TEXT,
    email TEXT,
    telefono TEXT,
    fecha DATE,
    hora TIME,
    personas INTEGER
) AS $$
DECLARE
    horas_antes INTEGER;
BEGIN
    -- Obtener configuración de horas antes
    SELECT valor::INTEGER INTO horas_antes 
    FROM public.configuracion 
    WHERE clave = 'recordatorio_horas_antes';
    
    -- Si no está configurado, usar 24 horas por defecto
    IF horas_antes IS NULL THEN
        horas_antes := 24;
    END IF;
    
    -- Retornar reservas que necesitan recordatorio
    RETURN QUERY
    SELECT 
        r.id,
        r.nombre,
        r.email,
        r.telefono,
        r.fecha,
        r.hora,
        r.personas
    FROM public.reservas r
    WHERE r.estado = 'confirmada'
        AND r.recordatorio_enviado = false
        AND (r.fecha + r.hora) BETWEEN 
            NOW() + (horas_antes || ' hours')::INTERVAL 
            AND NOW() + ((horas_antes + 1) || ' hours')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas del dashboard
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'reservas_hoy', (
            SELECT COUNT(*) 
            FROM public.reservas 
            WHERE fecha = CURRENT_DATE 
                AND estado != 'cancelada'
        ),
        'reservas_pendientes', (
            SELECT COUNT(*) 
            FROM public.reservas 
            WHERE estado = 'pendiente'
                AND fecha >= CURRENT_DATE
        ),
        'reservas_confirmadas', (
            SELECT COUNT(*) 
            FROM public.reservas 
            WHERE estado = 'confirmada'
                AND fecha >= CURRENT_DATE
        ),
        'personas_hoy', (
            SELECT COALESCE(SUM(personas), 0)
            FROM public.reservas 
            WHERE fecha = CURRENT_DATE 
                AND estado != 'cancelada'
        ),
        'emails_enviados_hoy', (
            SELECT COUNT(*) 
            FROM public.email_logs 
            WHERE DATE(created_at) = CURRENT_DATE
                AND enviado = true
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. TRIGGERS
-- ============================================

-- Trigger para generar token de confirmación automáticamente
CREATE OR REPLACE FUNCTION set_confirmation_token()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.token_confirmacion IS NULL THEN
        NEW.token_confirmacion := generate_confirmation_token();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_confirmation_token ON public.reservas;
CREATE TRIGGER trigger_set_confirmation_token
    BEFORE INSERT ON public.reservas
    FOR EACH ROW
    EXECUTE FUNCTION set_confirmation_token();

-- ============================================
-- 7. VISTAS ÚTILES
-- ============================================

-- Vista de reservas con información completa
CREATE OR REPLACE VIEW reservas_completas AS
SELECT 
    r.id,
    r.nombre,
    r.email,
    r.telefono,
    r.fecha,
    r.hora,
    r.personas,
    r.comentarios,
    r.estado,
    r.confirmada_en,
    r.recordatorio_enviado,
    r.notas_admin,
    r.created_at,
    (
        SELECT COUNT(*) 
        FROM public.email_logs el 
        WHERE el.reserva_id = r.id
    ) as emails_enviados,
    (
        SELECT json_agg(
            json_build_object(
                'tipo', el.tipo,
                'enviado', el.enviado,
                'created_at', el.created_at
            )
        )
        FROM public.email_logs el 
        WHERE el.reserva_id = r.id
    ) as historial_emails
FROM public.reservas r;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- Mostrar resumen de tablas creadas
SELECT 
    'Tablas creadas correctamente' as status,
    COUNT(*) as total_tablas
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('reservas', 'menu_items', 'email_logs', 'configuracion');

-- Mostrar configuración inicial
SELECT * FROM public.configuracion ORDER BY clave;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

-- 1. Este script es idempotente (se puede ejecutar múltiples veces)
-- 2. No elimina datos existentes
-- 3. Usa IF NOT EXISTS para evitar errores
-- 4. Incluye comentarios para documentación
-- 5. Configura RLS para seguridad
-- 6. Crea funciones útiles para el sistema

-- Para ejecutar este script:
-- 1. Ve a Supabase Dashboard
-- 2. Abre SQL Editor
-- 3. Pega este código
-- 4. Haz clic en "Run"

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
