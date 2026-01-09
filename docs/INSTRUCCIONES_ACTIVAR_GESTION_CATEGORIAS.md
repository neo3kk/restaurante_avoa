# 🚀 Instrucciones para Activar Gestión Completa de Categorías

## ✅ **Archivos Actualizados:**

1. ✅ `admin/categorias.html` - Modales agregados
2. ✅ `js/admin-categorias.js` - Lógica completa implementada
3. ✅ `supabase/paso6_orden_categorias.sql` - Script de orden
4. ✅ `supabase/paso7_subcategorias_vinos.sql` - Script de subcategorías

---

## 📋 **Paso 1: Ejecutar Scripts SQL**

### **A. Agregar Campo de Orden**

1. Abre **Supabase Dashboard** → **SQL Editor**
2. Copia y pega el contenido de: `supabase/paso6_orden_categorias.sql`
3. Ejecuta el script
4. Verifica que aparezcan las 8 categorías ordenadas

### **B. Crear Tabla de Subcategorías** (Opcional)

1. En **SQL Editor**
2. Copia y pega: `supabase/paso7_subcategorias_vinos.sql`
3. Ejecuta el script
4. Verifica que se crearon 3 subcategorías (Godello, Albariño, Verdejo)

---

## 🧪 **Paso 2: Probar Funcionalidades**

### **1. Abrir Panel de Categorías**
```
http://localhost:8000/admin/categorias.html
```

### **2. Probar Crear Categoría**
- Clic en "➕ Nueva Categoría"
- ID: `ensaladas`
- Nombre ES: `Ensaladas`
- Nombre CA: `Amanides`
- Nombre EN: `Salads`
- Clic en "Crear"
- ✅ Debería aparecer la nueva categoría

### **3. Probar Editar Categoría**
- Clic en "✏️ Editar" en cualquier categoría
- Cambiar el nombre
- Cambiar temporada
- Cambiar orden
- Clic en "Guardar"
- ✅ Debería actualizarse

### **4. Probar Ordenar**
- Clic en "↑" para subir una categoría
- Clic en "↓" para bajar una categoría
- ✅ El orden debería cambiar

### **5. Probar Eliminar**
- Clic en "🗑️" en una categoría de prueba
- Confirmar
- ✅ Debería eliminarse

---

## ✨ **Funcionalidades Implementadas:**

| Función | Estado | Descripción |
|---------|--------|-------------|
| **Ver categorías** | ✅ | Lista ordenada con información completa |
| **Crear categoría** | ✅ | Modal con validación de ID único |
| **Editar categoría** | ✅ | Modificar nombre, temporada, orden |
| **Eliminar categoría** | ✅ | Con confirmación y conteo de items |
| **Activar/Desactivar** | ✅ | Toggle inmediato |
| **Ordenar** | ✅ | Botones ↑↓ para reordenar |
| **Traducciones** | ✅ | Soporte ES/CA/EN |
| **Temporadas** | ✅ | Marcar categorías estacionales |

---

## 🎯 **Próximos Pasos (Opcional):**

### **A. Gestión de Subcategorías de Vinos**
Si quieres gestionar las subcategorías (Godello, Albariño, Verdejo, etc.):
- Crear página `admin/subcategorias.html`
- Crear script `js/admin-subcategorias.js`
- Similar al panel de categorías

### **B. Actualizar Carta Dinámica**
La carta ya carga dinámicamente, pero si creas nuevas categorías:
- Actualizar `carta.html` con secciones para nuevas categorías
- Actualizar `menu-loader.js` para cargar nuevas categorías

---

## ⚠️ **Notas Importantes:**

1. **ID de Categoría**: Debe ser único y solo minúsculas con guiones bajos
2. **Eliminar Categoría**: Eliminará TODOS los items asociados (CASCADE)
3. **Orden**: Se actualiza automáticamente al usar ↑↓
4. **Subcategorías**: Solo aplican a vinos (vino_blanco, vino_tinto, cava_champagne)

---

## 🐛 **Solución de Problemas:**

### **Error: "Ya existe una categoría con ese ID"**
- El ID de categoría debe ser único
- Usa otro nombre (ej: `ensaladas_2`)

### **Error al eliminar categoría**
- Verifica que no tenga items asociados
- O confirma que quieres eliminar los items también

### **Los botones no funcionan**
- Recarga la página (Ctrl+F5)
- Verifica que `admin-categorias.js` se cargó correctamente

---

## ✅ **Verificación Final:**

Ejecuta este SQL para verificar que todo está correcto:

```sql
-- Ver todas las categorías ordenadas
SELECT 
    categoria, 
    nombre_es, 
    orden, 
    disponible,
    temporada
FROM public.categorias_disponibilidad 
ORDER BY orden;

-- Contar items por categoría
SELECT 
    c.categoria,
    c.nombre_es,
    COUNT(m.id) as total_items
FROM public.categorias_disponibilidad c
LEFT JOIN public.menu_items m ON c.categoria = m.categoria
GROUP BY c.categoria, c.nombre_es
ORDER BY c.orden;
```

---

**¡Sistema completo de gestión de categorías listo!** 🎉
