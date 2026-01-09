-- ============================================
-- TABLA DE SUBCATEGORÍAS DE VINOS
-- ============================================

CREATE TABLE IF NOT EXISTS public.subcategorias_vinos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT UNIQUE NOT NULL,
    categoria_padre TEXT NOT NULL, -- 'vino_blanco', 'vino_tinto', 'cava_champagne'
    orden INTEGER DEFAULT 0,
    disponible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_categoria_padre FOREIGN KEY (categoria_padre) 
        REFERENCES public.categorias_disponibilidad(categoria) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_subcategorias_categoria ON public.subcategorias_vinos(categoria_padre);
CREATE INDEX IF NOT EXISTS idx_subcategorias_orden ON public.subcategorias_vinos(orden);

-- RLS
ALTER TABLE public.subcategorias_vinos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura pública subcategorias_vinos" ON public.subcategorias_vinos;
CREATE POLICY "Permitir lectura pública subcategorias_vinos"
    ON public.subcategorias_vinos
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir escritura autenticada subcategorias_vinos" ON public.subcategorias_vinos;
CREATE POLICY "Permitir escritura autenticada subcategorias_vinos"
    ON public.subcategorias_vinos
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_subcategorias_vinos_updated_at ON public.subcategorias_vinos;
CREATE TRIGGER update_subcategorias_vinos_updated_at
    BEFORE UPDATE ON public.subcategorias_vinos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Datos iniciales
INSERT INTO public.subcategorias_vinos (nombre, categoria_padre, orden) VALUES
('Godello', 'vino_blanco', 1),
('Albariño', 'vino_blanco', 2),
('Verdejo', 'vino_blanco', 3)
ON CONFLICT (nombre) DO NOTHING;

-- Verificar
SELECT * FROM public.subcategorias_vinos ORDER BY categoria_padre, orden;
