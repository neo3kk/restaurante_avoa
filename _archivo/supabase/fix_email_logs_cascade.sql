-- ============================================
-- MODIFICAR TABLA EMAIL_LOGS
-- Cambiar ON DELETE CASCADE a ON DELETE SET NULL
-- ============================================

-- Primero, eliminar la constraint existente
ALTER TABLE public.email_logs 
DROP CONSTRAINT IF EXISTS email_logs_reserva_id_fkey;

-- Recrear la constraint con SET NULL
ALTER TABLE public.email_logs
ADD CONSTRAINT email_logs_reserva_id_fkey
FOREIGN KEY (reserva_id)
REFERENCES public.reservas(id)
ON DELETE SET NULL;

-- Verificar
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'email_logs'
    AND tc.constraint_type = 'FOREIGN KEY';
