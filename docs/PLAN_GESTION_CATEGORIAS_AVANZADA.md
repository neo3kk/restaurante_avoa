# 📋 Plan de Implementación: Gestión Completa de Categorías

## 🎯 Funcionalidades a Implementar

### **1. Gestión de Categorías** ✅
- [x] Activar/Desactivar categorías
- [ ] **Editar nombre** de categoría (modal)
- [ ] **Crear nueva** categoría (modal)
- [ ] **Eliminar** categoría (con confirmación)
- [ ] **Ordenar** categorías (drag & drop o botones ↑↓)

### **2. Gestión de Subcategorías de Vinos** 🆕
- [ ] Ver subcategorías por categoría de vino
- [ ] Crear nueva subcategoría
- [ ] Editar subcategoría
- [ ] Eliminar subcategoría
- [ ] Ordenar subcategorías

---

## 📝 Archivos a Crear/Modificar

### **Base de Datos:**
1. ✅ `supabase/paso6_orden_categorias.sql` - Agregar campo orden
2. ✅ `supabase/paso7_subcategorias_vinos.sql` - Tabla subcategorías

### **Frontend:**
3. ⏳ `admin/categorias.html` - Agregar modales y botones
4. ⏳ `js/admin-categorias.js` - Lógica completa de CRUD
5. 🆕 `admin/subcategorias.html` - Nueva página para subcategorías
6. 🆕 `js/admin-subcategorias.js` - Lógica de subcategorías

---

## 🔧 Cambios Necesarios

### **A. Base de Datos (Ejecutar en Supabase)**

#### **Paso 1: Agregar campo orden**
```sql
-- Ejecutar: supabase/paso6_orden_categorias.sql
```

#### **Paso 2: Crear tabla subcategorías**
```sql
-- Ejecutar: supabase/paso7_subcategorias_vinos.sql
```

---

### **B. HTML - Agregar Modales**

#### **Modal Editar Categoría**
```html
<!-- Agregar antes de </main> en categorias.html -->
<div id="modal-editar" class="modal" style="display: none;">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h3>Editar Categoría</h3>
            <button class="modal-close" onclick="cerrarModalEditar()">×</button>
        </div>
        <div class="modal-body">
            <form id="form-editar">
                <input type="hidden" id="edit-id">
                <div class="form-group">
                    <label for="edit-nombre-es">Nombre (Español) *</label>
                    <input type="text" id="edit-nombre-es" required>
                </div>
                <div class="form-group">
                    <label for="edit-nombre-ca">Nombre (Catalán)</label>
                    <input type="text" id="edit-nombre-ca">
                </div>
                <div class="form-group">
                    <label for="edit-nombre-en">Nombre (Inglés)</label>
                    <input type="text" id="edit-nombre-en">
                </div>
                <div class="form-group">
                    <label for="edit-temporada">Temporada</label>
                    <select id="edit-temporada">
                        <option value="todo_año">Todo el año</option>
                        <option value="invierno">Invierno</option>
                        <option value="verano">Verano</option>
                        <option value="primavera">Primavera</option>
                        <option value="otoño">Otoño</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-orden">Orden</label>
                    <input type="number" id="edit-orden" min="0">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModalEditar()">Cancelar</button>
            <button class="btn btn-primary" onclick="guardarEdicion()">Guardar</button>
        </div>
    </div>
</div>
```

#### **Modal Nueva Categoría**
```html
<div id="modal-nueva" class="modal" style="display: none;">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h3>Nueva Categoría</h3>
            <button class="modal-close" onclick="cerrarModalNueva()">×</button>
        </div>
        <div class="modal-body">
            <form id="form-nueva">
                <div class="form-group">
                    <label for="nueva-categoria">ID de Categoría *</label>
                    <input type="text" id="nueva-categoria" required 
                           placeholder="ej: ensaladas" pattern="[a-z_]+">
                    <small>Solo minúsculas y guiones bajos</small>
                </div>
                <div class="form-group">
                    <label for="nueva-nombre-es">Nombre (Español) *</label>
                    <input type="text" id="nueva-nombre-es" required>
                </div>
                <div class="form-group">
                    <label for="nueva-nombre-ca">Nombre (Catalán)</label>
                    <input type="text" id="nueva-nombre-ca">
                </div>
                <div class="form-group">
                    <label for="nueva-nombre-en">Nombre (Inglés)</label>
                    <input type="text" id="nueva-nombre-en">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="cerrarModalNueva()">Cancelar</button>
            <button class="btn btn-primary" onclick="crearCategoria()">Crear</button>
        </div>
    </div>
</div>
```

#### **Botón "Nueva Categoría"**
```html
<!-- Agregar en header-actions -->
<button class="btn btn-primary" onclick="abrirModalNueva()">
    <span>➕</span> Nueva Categoría
</button>
```

---

### **C. JavaScript - Funciones Nuevas**

#### **Funciones a Agregar en `admin-categorias.js`:**

```javascript
// Modal Editar
function abrirModalEditar(id) {
    const cat = categorias.find(c => c.id === id);
    if (!cat) return;
    
    document.getElementById('edit-id').value = cat.id;
    document.getElementById('edit-nombre-es').value = cat.nombre_es;
    document.getElementById('edit-nombre-ca').value = cat.nombre_ca || '';
    document.getElementById('edit-nombre-en').value = cat.nombre_en || '';
    document.getElementById('edit-temporada').value = cat.temporada || 'todo_año';
    document.getElementById('edit-orden').value = cat.orden || 0;
    
    document.getElementById('modal-editar').style.display = 'flex';
}

async function guardarEdicion() {
    const id = document.getElementById('edit-id').value;
    const datos = {
        nombre_es: document.getElementById('edit-nombre-es').value,
        nombre_ca: document.getElementById('edit-nombre-ca').value || null,
        nombre_en: document.getElementById('edit-nombre-en').value || null,
        temporada: document.getElementById('edit-temporada').value,
        orden: parseInt(document.getElementById('edit-orden').value) || 0
    };
    
    try {
        const { error } = await supabase
            .from('categorias_disponibilidad')
            .update(datos)
            .eq('id', id);
        
        if (error) throw error;
        
        mostrarToast('Categoría actualizada correctamente', 'success');
        cerrarModalEditar();
        await cargarCategorias();
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error al actualizar categoría', 'error');
    }
}

// Modal Nueva
function abrirModalNueva() {
    document.getElementById('form-nueva').reset();
    document.getElementById('modal-nueva').style.display = 'flex';
}

async function crearCategoria() {
    const datos = {
        categoria: document.getElementById('nueva-categoria').value,
        nombre_es: document.getElementById('nueva-nombre-es').value,
        nombre_ca: document.getElementById('nueva-nombre-ca').value || null,
        nombre_en: document.getElementById('nueva-nombre-en').value || null,
        disponible: true,
        temporada: 'todo_año',
        orden: categorias.length + 1
    };
    
    try {
        const { error } = await supabase
            .from('categorias_disponibilidad')
            .insert([datos]);
        
        if (error) throw error;
        
        mostrarToast('Categoría creada correctamente', 'success');
        cerrarModalNueva();
        await cargarCategorias();
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error al crear categoría', 'error');
    }
}

// Eliminar
async function eliminarCategoria(id) {
    const cat = categorias.find(c => c.id === id);
    if (!cat) return;
    
    if (!confirm(`¿Eliminar la categoría "${cat.nombre_es}"?\n\nEsto también eliminará todos los items de esta categoría.`)) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('categorias_disponibilidad')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        mostrarToast('Categoría eliminada', 'success');
        await cargarCategorias();
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error al eliminar categoría', 'error');
    }
}

// Ordenar
async function moverCategoria(id, direccion) {
    const index = categorias.findIndex(c => c.id === id);
    if (index === -1) return;
    
    const newIndex = direccion === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categorias.length) return;
    
    // Intercambiar órdenes
    const cat1 = categorias[index];
    const cat2 = categorias[newIndex];
    
    try {
        await supabase
            .from('categorias_disponibilidad')
            .update({ orden: cat2.orden })
            .eq('id', cat1.id);
        
        await supabase
            .from('categorias_disponibilidad')
            .update({ orden: cat1.orden })
            .eq('id', cat2.id);
        
        await cargarCategorias();
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error al reordenar', 'error');
    }
}

// Exponer al scope global
window.abrirModalEditar = abrirModalEditar;
window.abrirModalNueva = abrirModalNueva;
window.guardarEdicion = guardarEdicion;
window.crearCategoria = crearCategoria;
window.eliminarCategoria = eliminarCategoria;
window.moverCategoria = moverCategoria;
window.cerrarModalEditar = () => document.getElementById('modal-editar').style.display = 'none';
window.cerrarModalNueva = () => document.getElementById('modal-nueva').style.display = 'none';
```

---

### **D. Actualizar Renderizado de Cards**

```javascript
// Agregar botones de orden y eliminar en cada card
<div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
    <button class="btn btn-sm btn-outline" onclick="moverCategoria('${cat.id}', 'up')" 
            ${index === 0 ? 'disabled' : ''}>↑</button>
    <button class="btn btn-sm btn-outline" onclick="moverCategoria('${cat.id}', 'down')" 
            ${index === categorias.length - 1 ? 'disabled' : ''}>↓</button>
    <button class="btn btn-sm ${cat.disponible ? 'btn-warning' : 'btn-success'}" 
            onclick="toggleDisponibilidad('${cat.id}')" style="flex: 1;">
        ${cat.disponible ? '🚫 Desactivar' : '✓ Activar'}
    </button>
    <button class="btn btn-sm btn-outline" onclick="abrirModalEditar('${cat.id}')">
        ✏️ Editar
    </button>
    <button class="btn btn-sm btn-danger" onclick="eliminarCategoria('${cat.id}')">
        🗑️
    </button>
</div>
```

---

## 🚀 Pasos para Implementar

1. **Ejecutar scripts SQL** en Supabase:
   - `paso6_orden_categorias.sql`
   - `paso7_subcategorias_vinos.sql`

2. **Actualizar `admin/categorias.html`**:
   - Agregar botón "Nueva Categoría"
   - Agregar modales (editar y nueva)

3. **Actualizar `js/admin-categorias.js`**:
   - Agregar todas las funciones nuevas
   - Actualizar renderizado de cards
   - Exponer funciones globalmente

4. **Probar funcionalidad**:
   - Crear categoría
   - Editar categoría
   - Eliminar categoría
   - Ordenar categorías

---

## ⚠️ Consideraciones

- **Eliminar categoría**: Eliminará todos los items asociados (CASCADE)
- **ID de categoría**: Debe coincidir con el usado en `menu_items.categoria`
- **Orden**: Se actualiza automáticamente al mover
- **Subcategorías**: Se gestionarán en página separada

---

¿Quieres que implemente todo esto ahora o prefieres hacerlo paso a paso?
