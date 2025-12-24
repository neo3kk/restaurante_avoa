-- ============================================
-- PASO 6: TRIGGERS
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

-- Verificar triggers creados
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
