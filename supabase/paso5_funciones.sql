-- ============================================
-- PASO 5: FUNCIONES ÚTILES
-- ============================================

-- Función para generar token de confirmación único
CREATE OR REPLACE FUNCTION generate_confirmation_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Función para obtener reservas que necesitan recordatorio
-- ============================================
CREATE OR REPLACE FUNCTION get_reservas_para_recordatorio()
RETURNS TABLE (
    id UUID,
    nombre TEXT,
    email TEXT,
    telefono TEXT,
    fecha DATE,
    hora TIME,
    personas INTEGER,
    comentarios TEXT
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
        r.personas,
        r.comentarios
    FROM public.reservas r
    WHERE r.estado = 'confirmada'
        AND r.recordatorio_enviado = false
        AND r.fecha >= CURRENT_DATE
        AND (r.fecha + COALESCE(r.hora, '00:00:00'::TIME)) BETWEEN 
            NOW() + (horas_antes || ' hours')::INTERVAL 
            AND NOW() + ((horas_antes + 1) || ' hours')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Función para obtener estadísticas del dashboard
-- ============================================
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
        ),
        'total_reservas_mes', (
            SELECT COUNT(*)
            FROM public.reservas
            WHERE DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE)
                AND estado != 'cancelada'
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Función para confirmar una reserva
-- ============================================
CREATE OR REPLACE FUNCTION confirmar_reserva(token_confirmacion_param TEXT)
RETURNS JSON AS $$
DECLARE
    reserva_id UUID;
    result JSON;
BEGIN
    -- Buscar la reserva por token
    SELECT id INTO reserva_id
    FROM public.reservas
    WHERE token_confirmacion = token_confirmacion_param
        AND estado = 'pendiente';
    
    IF reserva_id IS NULL THEN
        -- Token no válido o reserva ya confirmada
        SELECT json_build_object(
            'success', false,
            'message', 'Token no válido o reserva ya confirmada'
        ) INTO result;
    ELSE
        -- Actualizar estado a confirmada
        UPDATE public.reservas
        SET estado = 'confirmada',
            confirmada_en = NOW()
        WHERE id = reserva_id;
        
        SELECT json_build_object(
            'success', true,
            'message', 'Reserva confirmada exitosamente',
            'reserva_id', reserva_id
        ) INTO result;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar funciones creadas
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_name IN (
        'generate_confirmation_token',
        'get_reservas_para_recordatorio',
        'get_dashboard_stats',
        'confirmar_reserva'
    )
ORDER BY routine_name;
