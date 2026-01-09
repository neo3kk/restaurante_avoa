# 🍷 Sistema de Gestión de Menú y Vinos - Guía de Implementación

## 📋 Objetivo

Habilitar la gestión completa del menú (platos y vinos) desde el panel de administración, permitiendo:
- ✅ Agregar, editar y eliminar platos
- ✅ Agregar, editar y eliminar vinos
- ✅ Organizar por categorías y subcategorías
- ✅ Activar/desactivar disponibilidad
- ✅ Gestionar precios y traducciones
- ✅ Mostrar dinámicamente en la carta

---

## 🗂️ Estructura de Categorías

### **Platos:**
- `entrantes` - Entrantes
- `platos_calientes` - Platos Calientes
- `pescados` - Pescados (PSM)
- `carnes` - Carnes
- `postres` - Postres

### **Vinos:**
- `vino_blanco` - Vinos Blancos
  - Subcategorías: `Godello`, `Albariño`, `Verdejo`
- `vino_tinto` - Vinos Tintos
- `cava_champagne` - Cavas y Champagne

---

## 🚀 Paso 1: Crear la Tabla en Supabase

### **Ejecutar el Script SQL:**

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Abre el archivo: `supabase/paso4_menu_items.sql`
3. Copia todo el contenido
4. Pégalo en el SQL Editor
5. Haz clic en **"Run"**

### **Verificar:**

```sql
SELECT * FROM public.menu_items ORDER BY categoria, subcategoria, orden;
```

Deberías ver todos los vinos cargados automáticamente.

---

## 📊 Paso 2: Panel de Administración

### **Archivos a Crear/Modificar:**

#### **1. `admin/menu.html`** (Nuevo)
Panel de administración para gestionar el menú completo.

**Características:**
- ✅ Tabla con todos los items del menú
- ✅ Filtros por categoría
- ✅ Búsqueda por nombre
- ✅ Botones para agregar/editar/eliminar
- ✅ Toggle de disponibilidad
- ✅ Soporte multiidioma (ES/CA/EN)
- ✅ Gestión de subcategorías para vinos

#### **2. `js/admin-menu.js`** (Ya existe, actualizar)
Lógica del panel de administración.

**Funcionalidades:**
- Cargar items desde Supabase
- CRUD completo (Create, Read, Update, Delete)
- Filtros y búsqueda
- Validaciones
- Gestión de orden

---

## 🎨 Paso 3: Actualizar la Carta

### **Modificar `carta.html`:**

Reemplazar el HTML estático de vinos por contenedores dinámicos que se llenarán con JavaScript.

**Antes:**
```html
<li class="menu-item">
    <span class="menu-item-name">Merayo</span>
    <span class="price-line"></span>
    <span class="menu-item-price">17€</span>
</li>
```

**Después:**
```html
<div id="vinos-blancos-godello" class="menu-list"></div>
```

### **Crear `js/menu-loader.js`:**

Script para cargar dinámicamente el menú desde Supabase.

---

## 📝 Paso 4: Estructura de Datos

### **Campos de la Tabla `menu_items`:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único |
| `nombre_es` | TEXT | Nombre en español |
| `nombre_ca` | TEXT | Nombre en catalán |
| `nombre_en` | TEXT | Nombre en inglés |
| `descripcion_es` | TEXT | Descripción en español |
| `descripcion_ca` | TEXT | Descripción en catalán |
| `descripcion_en` | TEXT | Descripción en inglés |
| `precio` | DECIMAL | Precio del item |
| `categoria` | TEXT | Categoría principal |
| `subcategoria` | TEXT | Subcategoría (para vinos) |
| `orden` | INTEGER | Orden de aparición |
| `disponible` | BOOLEAN | Si está disponible |
| `precio_mercado` | BOOLEAN | Si es PSM |
| `unidad` | TEXT | Unidad (/ud, /kg) |
| `destacado` | BOOLEAN | Si es destacado |
| `imagen_url` | TEXT | URL de imagen |
| `alergenos` | TEXT[] | Array de alérgenos |

---

## 🎯 Paso 5: Funcionalidades del Panel Admin

### **Vista Principal:**
```
┌─────────────────────────────────────────────────┐
│  🍽️ Gestión de Menú                             │
├─────────────────────────────────────────────────┤
│  [+ Nuevo Item]  [Filtros ▼]  [🔍 Buscar...]   │
├─────────────────────────────────────────────────┤
│  Nombre     │ Categoría  │ Precio │ Acciones   │
├─────────────────────────────────────────────────┤
│  Merayo     │ Vino Blanco│  17€   │ ✏️ 🗑️ 👁️  │
│  Pulpo Feira│ Entrantes  │  28€   │ ✏️ 🗑️ 👁️  │
│  ...        │ ...        │  ...   │ ...        │
└─────────────────────────────────────────────────┘
```

### **Modal de Edición:**
```
┌─────────────────────────────────────────┐
│  ✏️ Editar Item del Menú                │
├─────────────────────────────────────────┤
│  Categoría: [Vino Blanco ▼]            │
│  Subcategoría: [Godello ▼]             │
│                                         │
│  📝 Español:                            │
│  Nombre: [Merayo                    ]  │
│  Descripción: [                     ]  │
│                                         │
│  📝 Catalán:                            │
│  Nombre: [                          ]  │
│                                         │
│  📝 Inglés:                             │
│  Nombre: [                          ]  │
│                                         │
│  💰 Precio: [17.00] €                  │
│  ☑️ Disponible                          │
│  ☐ Precio según mercado                │
│                                         │
│  [Cancelar]  [Guardar]                 │
└─────────────────────────────────────────┘
```

---

## 🔄 Paso 6: Flujo de Trabajo

### **Para Agregar un Vino:**

1. Ir a `admin/menu.html`
2. Clic en **"+ Nuevo Item"**
3. Seleccionar categoría: **"Vino Blanco"**
4. Seleccionar subcategoría: **"Albariño"**
5. Rellenar nombre y precio
6. Guardar
7. El vino aparece automáticamente en la carta

### **Para Editar un Vino:**

1. Buscar el vino en la tabla
2. Clic en el botón **✏️ Editar**
3. Modificar los campos necesarios
4. Guardar
5. Los cambios se reflejan inmediatamente en la carta

### **Para Desactivar un Vino:**

1. Buscar el vino
2. Clic en el toggle **👁️ Disponible**
3. El vino desaparece de la carta pública
4. Sigue visible en el panel admin (marcado como no disponible)

---

## 📱 Paso 7: Integración con la Carta

### **Carga Dinámica:**

```javascript
// Cargar vinos blancos - Godello
const vinosGodello = await supabase
    .from('menu_items')
    .select('*')
    .eq('categoria', 'vino_blanco')
    .eq('subcategoria', 'Godello')
    .eq('disponible', true)
    .order('orden');

// Renderizar en la carta
vinosGodello.data.forEach(vino => {
    const li = document.createElement('li');
    li.className = 'menu-item';
    li.innerHTML = `
        <span class="menu-item-name">${vino.nombre_es}</span>
        <span class="price-line"></span>
        <span class="menu-item-price">${vino.precio}€</span>
    `;
    container.appendChild(li);
});
```

---

## ✅ Ventajas del Sistema

### **Para el Restaurante:**
- ✅ **Actualización instantánea** - Cambios en tiempo real
- ✅ **Sin código** - No necesitas tocar HTML
- ✅ **Multiidioma** - Gestión de traducciones
- ✅ **Control total** - Activar/desactivar items
- ✅ **Organización** - Orden personalizable
- ✅ **Historial** - Todos los cambios registrados

### **Para los Clientes:**
- ✅ **Carta siempre actualizada**
- ✅ **Precios correctos**
- ✅ **Solo items disponibles**
- ✅ **Traducciones automáticas**

---

## 🎨 Próximos Pasos

### **Fase 1: Vinos** ✅
- [x] Crear tabla en base de datos
- [x] Insertar vinos actuales
- [ ] Crear panel de administración
- [ ] Actualizar carta para carga dinámica

### **Fase 2: Platos**
- [ ] Insertar platos actuales
- [ ] Añadir gestión de alérgenos
- [ ] Añadir imágenes de platos
- [ ] Implementar platos destacados

### **Fase 3: Mejoras**
- [ ] Exportar carta a PDF
- [ ] Estadísticas de platos más pedidos
- [ ] Sugerencias automáticas de maridaje
- [ ] Integración con sistema de pedidos

---

## 🆘 Soporte

Si tienes dudas:
1. Revisa la documentación de Supabase
2. Verifica que el script SQL se ejecutó correctamente
3. Comprueba los permisos RLS
4. Revisa la consola del navegador para errores

---

**Fecha de creación:** 2026-01-09
**Última actualización:** 2026-01-09
