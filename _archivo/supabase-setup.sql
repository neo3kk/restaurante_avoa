-- ============================================
-- RESTAURANTE AVOA - SUPABASE DATABASE SETUP
-- ============================================

-- Tabla: menu_items (Platos de la carta)
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria VARCHAR(50) NOT NULL, -- 'entrantes', 'platos_calientes', 'pescados', 'carnes', 'postres', 'vinos_blancos', 'vinos_tintos', 'cavas'
  subcategoria VARCHAR(50), -- Para vinos: 'godello', 'albarino', 'verdejo', etc.
  nombre_es VARCHAR(200) NOT NULL,
  nombre_ca VARCHAR(200),
  nombre_en VARCHAR(200),
  descripcion_es TEXT,
  descripcion_ca TEXT,
  descripcion_en TEXT,
  precio DECIMAL(10, 2), -- NULL para "Precio según mercado"
  precio_texto VARCHAR(50), -- Para casos como "PSM", "Precio según mercado"
  unidad VARCHAR(20), -- '/ud', '/kg', etc.
  activo BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false, -- Para mostrar en página principal
  orden INTEGER DEFAULT 0, -- Para ordenar items dentro de categoría
  imagen_url TEXT, -- URL de imagen del plato (opcional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: reservas (Reservas de clientes)
CREATE TABLE reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME,
  personas INTEGER NOT NULL CHECK (personas >= 1 AND personas <= 20),
  comentarios TEXT,
  estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'confirmada', 'cancelada', 'completada'
  idioma VARCHAR(5) DEFAULT 'es', -- Idioma en que se hizo la reserva
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: configuracion (Configuración general del restaurante)
CREATE TABLE configuracion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clave VARCHAR(100) UNIQUE NOT NULL,
  valor_es TEXT,
  valor_ca TEXT,
  valor_en TEXT,
  tipo VARCHAR(20) DEFAULT 'texto', -- 'texto', 'numero', 'booleano', 'json'
  descripcion TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES para mejorar rendimiento
-- ============================================

CREATE INDEX idx_menu_items_categoria ON menu_items(categoria);
CREATE INDEX idx_menu_items_activo ON menu_items(activo);
CREATE INDEX idx_reservas_fecha ON reservas(fecha);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_configuracion_clave ON configuracion(clave);

-- ============================================
-- TRIGGERS para actualizar updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON reservas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracion_updated_at BEFORE UPDATE ON configuracion
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- Políticas para menu_items
-- Lectura pública (cualquiera puede ver el menú)
CREATE POLICY "Permitir lectura pública de menu_items"
  ON menu_items FOR SELECT
  USING (activo = true);

-- Solo usuarios autenticados pueden insertar/actualizar/eliminar
CREATE POLICY "Permitir todo a usuarios autenticados en menu_items"
  ON menu_items FOR ALL
  USING (auth.role() = 'authenticated');

-- Políticas para reservas
-- Inserción pública (cualquiera puede hacer reserva)
CREATE POLICY "Permitir inserción pública de reservas"
  ON reservas FOR INSERT
  WITH CHECK (true);

-- Solo usuarios autenticados pueden ver/actualizar reservas
CREATE POLICY "Permitir lectura a usuarios autenticados en reservas"
  ON reservas FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir actualización a usuarios autenticados en reservas"
  ON reservas FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Políticas para configuracion
-- Lectura pública
CREATE POLICY "Permitir lectura pública de configuracion"
  ON configuracion FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden modificar
CREATE POLICY "Permitir todo a usuarios autenticados en configuracion"
  ON configuracion FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- DATOS INICIALES DE EJEMPLO
-- ============================================

-- Insertar algunos platos de ejemplo (basados en tu carta actual)
INSERT INTO menu_items (categoria, nombre_es, nombre_ca, nombre_en, descripcion_es, precio, orden) VALUES
('entrantes', 'Empanada Gallega', 'Empanada Gallega', 'Galician Pie', NULL, 7.00, 1),
('entrantes', 'Ensalada Bonito', 'Amanida de Bonítol', 'Tuna Salad', NULL, 21.00, 2),
('entrantes', 'Pulpo a Feira', 'Pop a Feira', 'Galician Octopus', 'Pulpo gallego cocido con pimentón, aceite de oliva y sal gruesa.', 28.00, 3),
('entrantes', 'Anchoas 00', 'Anxoves 00', 'Anchovies 00', NULL, 4.00, 4),
('entrantes', 'Zamburiñas', 'Zamburiñas', 'Scallops', NULL, 28.00, 5),
('entrantes', 'Jamón Ibérico', 'Pernil Ibèric', 'Iberian Ham', NULL, 35.00, 6),
('entrantes', 'Calamar de Potera', 'Calamar de Potera', 'Squid', 'Calamar de potera fresco.', 30.00, 7),

('platos_calientes', 'Alubias', 'Mongetes', 'Beans', 'con Almejas o Pulpo', 30.00, 1),
('platos_calientes', 'Caldo Gallego', 'Brou Gallec', 'Galician Broth', NULL, 7.00, 2),
('platos_calientes', 'Callos', 'Callos', 'Tripe', NULL, 16.00, 3),

('pescados', 'Lubina', 'Llobarro', 'Sea Bass', NULL, NULL, 1),
('pescados', 'Rodaballo', 'Rèmol', 'Turbot', NULL, NULL, 2),
('pescados', 'Merluza', 'Lluç', 'Hake', NULL, NULL, 3),
('pescados', 'Bogavante', 'Llagosta', 'Lobster', 'Selección fresca del día.', NULL, 4),

('carnes', 'Zorza con Patatas', 'Zorza amb Patates', 'Zorza with Potatoes', NULL, 20.00, 1),
('carnes', 'Solomillo Ternera Blanca', 'Filet de Vedella Blanca', 'White Veal Sirloin', NULL, 29.00, 2),
('carnes', 'Chuleton Madurado', 'Txuleton Madurat', 'Aged T-Bone Steak', NULL, 104.00, 3),

('postres', 'Filloas', 'Filloas', 'Filloas', NULL, 8.00, 1),
('postres', 'Cañitas', 'Canyetes', 'Cañitas', NULL, 8.00, 2),
('postres', 'Tarta de Santiago', 'Tarta de Santiago', 'Santiago Cake', NULL, 8.00, 3);

-- Insertar configuración inicial
INSERT INTO configuracion (clave, valor_es, valor_ca, valor_en, tipo, descripcion) VALUES
('horario_lunes_martes', 'Lunes y Martes: 13:30 - 16:30', 'Dilluns i Dimarts: 13:30 - 16:30', 'Monday and Tuesday: 1:30 PM - 4:30 PM', 'texto', 'Horario de lunes y martes'),
('horario_miercoles_sabado', 'Miércoles a Sábado: 13:30 - 16:30 | 20:00 - 23:30', 'Dimecres a Dissabte: 13:30 - 16:30 | 20:00 - 23:30', 'Wednesday to Saturday: 1:30 PM - 4:30 PM | 8:00 PM - 11:30 PM', 'texto', 'Horario de miércoles a sábado'),
('horario_domingo', 'Domingo: Cerrado', 'Diumenge: Tancat', 'Sunday: Closed', 'texto', 'Horario de domingo'),
('telefono_1', '+34 659 02 13 02', '+34 659 02 13 02', '+34 659 02 13 02', 'texto', 'Teléfono principal'),
('telefono_2', '+34 971 28 83 60', '+34 971 28 83 60', '+34 971 28 83 60', 'texto', 'Teléfono secundario'),
('email', 'reservas@restauranteavoa.com', 'reservas@restauranteavoa.com', 'reservas@restauranteavoa.com', 'texto', 'Email de contacto');

