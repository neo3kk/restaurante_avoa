-- ============================================
-- PASO 2: CREAR TABLA EMAIL_LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID REFERENCES public.reservas(id) ON DELETE CASCADE,
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

-- Verificar
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'email_logs' 
ORDER BY ordinal_position;
