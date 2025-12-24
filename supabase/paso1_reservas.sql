-- ============================================
-- PASO 1: ACTUALIZAR TABLA RESERVAS
-- ============================================

-- Añadir nuevas columnas a la tabla existente
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS hora TIME,
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'pendiente',
ADD COLUMN IF NOT EXISTS token_confirmacion TEXT,
ADD COLUMN IF NOT EXISTS confirmada_en TIMESTAMP,
ADD COLUMN IF NOT EXISTS recordatorio_enviado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cancelada_en TIMESTAMP,
ADD COLUMN IF NOT EXISTS notas_admin TEXT;

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON public.reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON public.reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_email ON public.reservas(email);
CREATE INDEX IF NOT EXISTS idx_reservas_token ON public.reservas(token_confirmacion);

-- Verificar
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY ordinal_position;
