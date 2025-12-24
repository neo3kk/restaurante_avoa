-- ============================================
-- SCRIPT DE CREACIÓN DE MENÚ COMPLETO
-- Restaurante Avoa - Carta Actual
-- ============================================

-- PASO 1: Eliminar tabla existente
DROP TABLE IF EXISTS menu_items CASCADE;

-- PASO 2: Crear tabla con estructura correcta
CREATE TABLE menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre_es TEXT NOT NULL,
    nombre_ca TEXT,
    nombre_en TEXT,
    descripcion_es TEXT,
    descripcion_ca TEXT,
    descripcion_en TEXT,
    categoria TEXT NOT NULL,
    precio DECIMAL(10, 2),
    disponible BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 3: Crear índices
CREATE INDEX idx_menu_items_categoria ON menu_items(categoria);
CREATE INDEX idx_menu_items_disponible ON menu_items(disponible);
CREATE INDEX idx_menu_items_orden ON menu_items(orden);

-- PASO 4: Habilitar Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- PASO 5: Crear políticas de seguridad
CREATE POLICY "Permitir lectura pública de menu_items"
ON menu_items FOR SELECT TO public USING (true);

CREATE POLICY "Permitir todo a usuarios autenticados"
ON menu_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PASO 6: Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 7: Trigger para updated_at
CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PASO 8: INSERTAR TODOS LOS PLATOS
-- ============================================

-- ENTRANTES
INSERT INTO menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible) VALUES
('Empanada Gallega', 'Empanada Gallega', 'Galician Empanada', 'entrantes', 7.00, 1, true),
('Ensalada Bonito', 'Amanida de Bonítol', 'Bonito Salad', 'entrantes', 21.00, 2, true),
('Pulpo a Feira', 'Pop a Feira', 'Galician-Style Octopus', 'entrantes', 28.00, 3, true),
('Anchoas 00', 'Anxoves 00', 'Premium Anchovies 00', 'entrantes', 4.00, 4, true),
('Zamburiñas', 'Zamburiñas', 'Queen Scallops', 'entrantes', 28.00, 5, true),
('Jamón Ibérico', 'Pernil Ibèric', 'Iberian Ham', 'entrantes', 35.00, 6, true),
('Tirabeques', 'Pèsols Tendres', 'Snow Peas', 'entrantes', 14.00, 7, true),
('Queso con Anchoas', 'Formatge amb Anxoves', 'Cheese with Anchovies', 'entrantes', 5.00, 8, true),
('Croquetas de Ibérico', 'Croquetes d''Ibèric', 'Iberian Croquettes', 'entrantes', 4.00, 9, true),
('Buñuelos de Bacalao', 'Bunyols de Bacallà', 'Cod Fritters', 'entrantes', 4.00, 10, true),
('Buñuelos de Merluza', 'Bunyols de Lluç', 'Hake Fritters', 'entrantes', 4.00, 11, true),
('Calamar de Potera', 'Calamar de Potera', 'Squid', 'entrantes', 30.00, 12, true),
('Alcachofas', 'Carxofes', 'Artichokes', 'entrantes', 9.00, 13, true),
('Angulas', 'Angules', 'Baby Eels', 'entrantes', NULL, 14, true);

-- PLATOS CALIENTES
INSERT INTO menu_items (nombre_es, nombre_ca, nombre_en, descripcion_es, descripcion_ca, descripcion_en, categoria, precio, orden, disponible) VALUES
('Alubias con Almejas', 'Mongetes amb Cloïsses', 'White Beans with Clams', 'Alubias con almejas frescas', 'Mongetes amb cloïsses fresques', 'White beans with fresh clams', 'entrantes', 30.00, 15, true),
('Alubias con Pulpo', 'Mongetes amb Pop', 'White Beans with Octopus', 'Alubias con pulpo', 'Mongetes amb pop', 'White beans with octopus', 'entrantes', 30.00, 16, true),
('Caldo Gallego', 'Brou Gallec', 'Galician Broth', 'Caldo tradicional gallego', 'Brou tradicional gallec', 'Traditional Galician broth', 'entrantes', 7.00, 17, true),
('Callos', 'Callos', 'Tripe Stew', 'Callos tradicionales', 'Callos tradicionals', 'Traditional tripe stew', 'entrantes', 16.00, 18, true);

-- PESCADOS (Precio según mercado)
INSERT INTO menu_items (nombre_es, nombre_ca, nombre_en, descripcion_es, descripcion_ca, descripcion_en, categoria, precio, orden, disponible) VALUES
('Lubina', 'Llobarro', 'Sea Bass', 'Selección fresca del día', 'Selecció fresca del dia', 'Fresh selection of the day', 'pescados', NULL, 1, true),
('Rodaballo', 'Rèmol', 'Turbot', 'Selección fresca del día', 'Selecció fresca del dia', 'Fresh selection of the day', 'pescados', NULL, 2, true),
('Merluza', 'Lluç', 'Hake', 'Selección fresca del día', 'Selecció fresca del dia', 'Fresh selection of the day', 'pescados', NULL, 3, true),
('Lenguado', 'Llenguado', 'Sole', 'Selección fresca del día', 'Selecció fresca del dia', 'Fresh selection of the day', 'pescados', NULL, 4, true),
('Gallo', 'Gall', 'Megrim', 'Selección fresca del día', 'Selecció fresca del dia', 'Fresh selection of the day', 'pescados', NULL, 5, true);

-- MARISCOS (Precio según mercado)
INSERT INTO menu_items (nombre_es, nombre_ca, nombre_en, descripcion_es, descripcion_ca, descripcion_en, categoria, precio, orden, disponible) VALUES
('Centolla', 'Centolla', 'Spider Crab', 'Selección fresca del día', 'Selecció fresca del dia', 'Fresh selection of the day', 'mariscos', NULL, 1, true),
('Bogavante', 'Llagosta', 'Lobster', 'Selección fresca del día', 'Selecció fresca del dia', 'Fresh selection of the day', 'mariscos', NULL, 2, true);

-- CARNES
INSERT INTO menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible) VALUES
('Zorza con Patatas', 'Zorza amb Patates', 'Zorza with Potatoes', 'carnes', 20.00, 1, true),
('Solomillo Ternera Blanca', 'Filet de Vedella Blanca', 'White Veal Tenderloin', 'carnes', 29.00, 2, true),
('Chuleton Madurado', 'Txuleton Madurat', 'Aged T-Bone Steak', 'carnes', 104.00, 3, true),
('Entrecot Madurado', 'Entrecot Madurat', 'Aged Ribeye', 'carnes', 35.00, 4, true);

-- POSTRES (todos al mismo precio)
INSERT INTO menu_items (nombre_es, nombre_ca, nombre_en, categoria, precio, orden, disponible) VALUES
('Filloas', 'Filloas', 'Filloas (Galician Crepes)', 'postres', 8.00, 1, true),
('Cañitas', 'Canyetes', 'Cañitas', 'postres', 8.00, 2, true),
('Queso Arzua con Membrillo', 'Formatge Arzua amb Codony', 'Arzua Cheese with Quince', 'postres', 8.00, 3, true),
('Tarta de Santiago', 'Pastís de Santiago', 'Santiago Cake', 'postres', 8.00, 4, true),
('Tarta de Queso', 'Pastís de Formatge', 'Cheesecake', 'postres', 8.00, 5, true);

-- ============================================
-- COMENTARIOS FINALES
-- ============================================
COMMENT ON TABLE menu_items IS 'Menú completo del Restaurante Avoa con soporte multiidioma (ES, CA, EN)';
COMMENT ON COLUMN menu_items.precio IS 'Precio en euros. NULL indica precio según mercado';
COMMENT ON COLUMN menu_items.orden IS 'Orden de visualización dentro de cada categoría';
COMMENT ON COLUMN menu_items.categoria IS 'Categorías: entrantes, pescados, mariscos, carnes, postres';
