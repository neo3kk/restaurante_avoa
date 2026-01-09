# ✅ Script SQL Listo para Ejecutar en Supabase

## 📊 Resumen del Script

### **Archivo:** `supabase/paso4_menu_items.sql`

---

## 🎯 Contenido Completo

### **1. Estructura de la Tabla**
- ✅ Tabla `menu_items` con todos los campos necesarios
- ✅ Soporte multiidioma (ES, CA, EN)
- ✅ Campos para precios, categorías, subcategorías
- ✅ Soporte para PSM (Precio Según Mercado)
- ✅ Campo de orden personalizable
- ✅ Disponibilidad on/off

### **2. Datos Iniciales - Platos (32 items)**

| Categoría | Cantidad | Traducciones |
|-----------|----------|--------------|
| **Entrantes** | 13 | ✅ ES/CA/EN |
| **Platos Calientes** | 3 | ✅ ES/CA/EN |
| **Pescados** | 7 | ✅ ES/CA/EN (todos PSM) |
| **Carnes** | 4 | ✅ ES/CA/EN |
| **Postres** | 5 | ✅ ES/CA/EN |

### **3. Datos Iniciales - Vinos (36 items)**

| Categoría | Subcategoría | Cantidad |
|-----------|--------------|----------|
| **Vino Blanco** | Godello | 4 |
| **Vino Blanco** | Albariño | 8 |
| **Vino Blanco** | Verdejo | 2 |
| **Vino Tinto** | - | 15 |
| **Cava/Champagne** | - | 7 |

---

## 🚀 Instrucciones de Ejecución

### **Paso 1: Abrir Supabase Dashboard**

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto: **Restaurante Avoa**
3. En el menú lateral, haz clic en **"SQL Editor"**

### **Paso 2: Cargar el Script**

1. Haz clic en **"New query"**
2. Abre el archivo: `c:\Users\neo3k\Desktop\restaurante_avoa\supabase\paso4_menu_items.sql`
3. Copia **TODO** el contenido del archivo
4. Pégalo en el editor SQL de Supabase

### **Paso 3: Ejecutar**

1. Haz clic en el botón **"Run"** (o presiona `Ctrl + Enter`)
2. Espera a que termine la ejecución
3. Deberías ver mensajes de éxito

### **Paso 4: Verificar**

Ejecuta esta consulta para verificar que todo se cargó correctamente:

```sql
-- Ver resumen por categoría
SELECT 
    categoria,
    subcategoria,
    COUNT(*) as total_items,
    COUNT(CASE WHEN disponible = true THEN 1 END) as disponibles
FROM public.menu_items
GROUP BY categoria, subcategoria
ORDER BY categoria, subcategoria;
```

**Resultado esperado:**
```
categoria          | subcategoria | total_items | disponibles
-------------------|--------------|-------------|-------------
carnes             | NULL         | 4           | 4
cava_champagne     | NULL         | 7           | 7
entrantes          | NULL         | 13          | 13
pescados           | NULL         | 7           | 7
platos_calientes   | NULL         | 3           | 3
postres            | NULL         | 5           | 5
vino_blanco        | Albariño     | 8           | 8
vino_blanco        | Godello      | 4           | 4
vino_blanco        | Verdejo      | 2           | 2
vino_tinto         | NULL         | 15          | 15
```

**Total: 68 items**

---

## ✅ Verificaciones Adicionales

### **Ver todos los platos:**
```sql
SELECT nombre_es, nombre_ca, nombre_en, categoria, precio, precio_mercado
FROM public.menu_items
WHERE categoria IN ('entrantes', 'platos_calientes', 'pescados', 'carnes', 'postres')
ORDER BY categoria, orden;
```

### **Ver todos los vinos:**
```sql
SELECT nombre_es, categoria, subcategoria, precio
FROM public.menu_items
WHERE categoria IN ('vino_blanco', 'vino_tinto', 'cava_champagne')
ORDER BY categoria, subcategoria, orden;
```

### **Ver items con precio según mercado:**
```sql
SELECT nombre_es, categoria
FROM public.menu_items
WHERE precio_mercado = true;
```

**Resultado esperado:**
- Angulas (entrantes)
- Lubina, Rodaballo, Merluza, Lenguado, Gallo, Centolla, Bogavante (pescados)

---

## 🔒 Seguridad (RLS)

El script incluye políticas de seguridad:

- ✅ **Lectura pública**: Cualquiera puede ver el menú
- ✅ **Escritura autenticada**: Solo usuarios autenticados (admin) pueden modificar

---

## 📝 Notas Importantes

### **Características Especiales:**

1. **Angulas**: Precio NULL + `precio_mercado = true`
2. **Buñuelos**: Incluye descripción "(Bacalao / Merluza)" en 3 idiomas
3. **Alubias**: Incluye descripción "con Almejas o Pulpo" en 3 idiomas
4. **Pescados**: Todos marcados como PSM
5. **Postres**: Todos al mismo precio (8€)

### **Campos Multiidioma:**

- `nombre_es`, `nombre_ca`, `nombre_en`
- `descripcion_es`, `descripcion_ca`, `descripcion_en`

### **Campos Especiales:**

- `precio_mercado`: true para items PSM
- `unidad`: 'ud' para items que se venden por unidad
- `orden`: Controla el orden de aparición
- `disponible`: true/false para mostrar/ocultar

---

## 🎨 Próximos Pasos

Una vez ejecutado el script:

1. ✅ **Crear panel de administración** para gestionar items
2. ✅ **Actualizar carta.html** para carga dinámica
3. ✅ **Crear script de carga** para el frontend
4. ✅ **Probar traducciones** en los 3 idiomas

---

## 🆘 Solución de Problemas

### **Error: "relation menu_items already exists"**
```sql
-- Eliminar tabla existente (¡CUIDADO! Esto borra todos los datos)
DROP TABLE IF EXISTS public.menu_items CASCADE;
-- Luego ejecuta el script completo de nuevo
```

### **Error: "duplicate key value"**
```sql
-- Limpiar datos existentes
DELETE FROM public.menu_items;
-- Luego ejecuta solo la parte de INSERT del script
```

### **Verificar permisos RLS:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'menu_items';
```

---

## ✅ Checklist de Ejecución

- [ ] Abrir Supabase Dashboard
- [ ] Ir a SQL Editor
- [ ] Copiar contenido de `paso4_menu_items.sql`
- [ ] Pegar en el editor
- [ ] Ejecutar (Run)
- [ ] Verificar que se crearon 68 items
- [ ] Verificar traducciones
- [ ] Verificar precios
- [ ] Verificar PSM en pescados y angulas

---

**¡Listo para ejecutar!** 🚀

Una vez ejecutado, tendrás toda la carta y bodega cargada en Supabase con traducciones completas en español, catalán e inglés.
