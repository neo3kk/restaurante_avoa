-- ============================================
-- PASO 3: CREAR TABLA CONFIGURACION
-- ============================================

-- Eliminar tabla si existe (para empezar limpio)
DROP TABLE IF EXISTS public.configuracion CASCADE;

-- Crear tabla
CREATE TABLE public.configuracion (
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
    ('enviar_recordatorios', 'true', 'Activar/desactivar envío de recordatorios automáticos');

-- Verificar
SELECT * FROM public.configuracion ORDER BY clave;
