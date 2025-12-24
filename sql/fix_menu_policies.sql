-- ============================================
-- VERIFICAR Y CORREGIR POLÍTICAS RLS
-- ============================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Permitir lectura pública de menu_items" ON menu_items;
DROP POLICY IF EXISTS "Permitir todo a usuarios autenticados" ON menu_items;

-- Crear políticas correctas
CREATE POLICY "Permitir lectura pública de menu_items"
ON menu_items
FOR SELECT
TO public
USING (true);

CREATE POLICY "Permitir INSERT a usuarios autenticados"
ON menu_items
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir UPDATE a usuarios autenticados"
ON menu_items
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir DELETE a usuarios autenticados"
ON menu_items
FOR DELETE
TO authenticated
USING (true);

-- Verificar que RLS esté habilitado
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Mostrar políticas actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'menu_items';
