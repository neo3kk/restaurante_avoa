# 📝 Actualización de carta.html para Carga Dinámica

## ✅ Cambios Realizados

1. ✅ Agregado ID `entrantes-list` a la lista de entrantes
2. ✅ Cambiado script de `supabase-menu.js` a `js/menu-loader.js`

---

## 📋 IDs que Necesitan Agregarse

Busca cada `<ul class="menu-list">` y agrega el ID correspondiente:

### **Platos:**

| Sección | Línea Aprox | ID a Agregar |
|---------|-------------|--------------|
| Entrantes | ~131 | `id="entrantes-list"` ✅ HECHO |
| Platos Calientes | ~214 | `id="platos-calientes-list"` |
| Pescados | ~268 | `id="pescados-grid"` |
| Carnes | ~300 | `id="carnes-list"` |
| Postres | ~345 | `id="postres-list"` |

### **Vinos:**

| Sección | Subcategoría | Línea Aprox | ID a Agregar |
|---------|--------------|-------------|--------------|
| Blancos | Godello | ~359 | `id="vinos-blancos-godello"` |
| Blancos | Albariño | ~381 | `id="vinos-blancos-albariño"` |
| Blancos | Verdejo | ~394 | `id="vinos-blancos-verdejo"` |
| Tintos | - | ~430 | `id="vinos-tintos-list"` |
| Cavas | - | ~??? | `id="cavas-champagne-list"` |

---

## 🔍 Cómo Encontrar las Secciones

### **Método 1: Buscar por Texto**
1. Abre `carta.html`
2. Busca (Ctrl+F): `"Platos Calientes"`
3. Baja hasta encontrar `<ul class="menu-list">`
4. Agrega el ID correspondiente

### **Método 2: Buscar por Patrón**
Busca: `<ul class="menu-list">` (sin ID)
Reemplaza por el ID correspondiente según la sección

---

## 📝 Ejemplo de Cambio

**ANTES:**
```html
<ul class="menu-list">
    <li class="menu-item">
```

**DESPUÉS:**
```html
<ul class="menu-list" id="platos-calientes-list">
    <li class="menu-item">
```

---

## ⚠️ Nota Importante

El contenido hardcodeado (los `<li>` actuales) puede quedarse como **fallback**. Si Supabase no carga, se mostrará el contenido estático.

Si prefieres eliminar el contenido hardcodeado, simplemente deja las listas vacías:

```html
<ul class="menu-list" id="entrantes-list">
    <!-- Se cargará dinámicamente desde Supabase -->
</ul>
```

---

## ✅ Verificación

Una vez agregados todos los IDs, el script `menu-loader.js` automáticamente:
1. Cargará los items desde Supabase
2. Filtrará por disponibilidad (item + categoría)
3. Aplicará traducciones según idioma
4. Mostrará PSM donde corresponda
5. Agrupará vinos por subcategoría

---

## 🧪 Prueba

1. Abre http://localhost:8000/carta.html
2. Abre la consola del navegador (F12)
3. Deberías ver: "Menú cargado correctamente" (si no hay errores)
4. Los items deberían cargarse dinámicamente

---

**Fecha:** 2026-01-09
**Archivo:** carta.html
**Script:** js/menu-loader.js
