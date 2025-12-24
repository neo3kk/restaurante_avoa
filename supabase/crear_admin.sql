-- ============================================
-- CREAR USUARIO ADMINISTRADOR INICIAL
-- ============================================

-- IMPORTANTE: Este script es solo para referencia.
-- La creación de usuarios debe hacerse a través de Supabase Auth.

-- OPCIÓN 1: Crear usuario desde el Dashboard de Supabase
-- --------------------------------------------------------
-- 1. Ve a Authentication → Users
-- 2. Haz clic en "Add user"
-- 3. Email: reservas@restauranteavoa.com
-- 4. Password: [tu contraseña segura]
-- 5. Auto Confirm User: YES
-- 6. Haz clic en "Create user"

-- OPCIÓN 2: Crear usuario desde la consola del navegador
-- --------------------------------------------------------
-- Abre la consola del navegador en /admin/login.html y ejecuta:
/*
await adminAuth.registerAdmin('reservas@restauranteavoa.com', 'TU_CONTRASEÑA_SEGURA');
*/

-- OPCIÓN 3: Usar la API de Supabase (desde terminal)
-- --------------------------------------------------------
-- Necesitas el Service Role Key (NO la Anon Key)
-- curl -X POST 'https://ybvxkxdvtqxqpnhcmgzc.supabase.co/auth/v1/admin/users' \
--   -H "apikey: TU_SERVICE_ROLE_KEY" \
--   -H "Authorization: Bearer TU_SERVICE_ROLE_KEY" \
--   -H "Content-Type: application/json" \
--   -d '{
--     "email": "reservas@restauranteavoa.com",
--     "password": "TU_CONTRASEÑA_SEGURA",
--     "email_confirm": true,
--     "user_metadata": {
--       "role": "admin",
--       "nombre": "Administrador"
--     }
--   }'

-- ============================================
-- VERIFICAR USUARIOS CREADOS
-- ============================================

-- Ver usuarios en la tabla auth.users (solo lectura)
SELECT 
    id,
    email,
    created_at,
    confirmed_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

-- 1. La contraseña debe tener al menos 6 caracteres
-- 2. Se recomienda usar una contraseña segura (letras, números, símbolos)
-- 3. El email debe ser válido y accesible
-- 4. Por seguridad, NO guardes la contraseña en este archivo
-- 5. Guarda la contraseña en un lugar seguro (gestor de contraseñas)

-- ============================================
-- RECOMENDACIÓN DE CONTRASEÑA
-- ============================================

-- Usa un gestor de contraseñas para generar una contraseña segura
-- Ejemplo de formato: Avoa2024!Admin#Secure
-- Mínimo recomendado: 12 caracteres con mayúsculas, minúsculas, números y símbolos
