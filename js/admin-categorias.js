/**
 * GESTIÓN DE CATEGORÍAS - ADMIN PANEL (COMPLETO)
 * Restaurante Avoa
 */

// Estado global
let categorias = [];

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await cargarCategorias();
    configurarEventListeners();
});

// Cargar categorías desde Supabase
async function cargarCategorias() {
    try {
        const { data, error } = await supabase
            .from('categorias_disponibilidad')
            .select('*')
            .order('orden', { ascending: true });

        if (error) throw error;

        categorias = data || [];
        renderizarCategorias();
        mostrarToast('Categorías cargadas correctamente', 'success');
    } catch (error) {
        console.error('Error cargando categorías:', error);
        mostrarToast('Error al cargar las categorías', 'error');
    }
}

// Renderizar categorías
function renderizarCategorias() {
    const grid = document.getElementById('categorias-grid');

    document.getElementById('total-categorias').textContent =
        `${categorias.length} categoría${categorias.length !== 1 ? 's' : ''}`;

    if (categorias.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📂</div>
                <p style="color: #666;">No hay categorías configuradas</p>
                <button class="btn btn-primary" onclick="abrirModalNueva()">Crear Primera Categoría</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = categorias.map((cat, index) => `
        <div class="categoria-card" style="
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 2px solid ${cat.disponible ? '#10b981' : '#ef4444'};
            transition: all 0.3s ease;
        ">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 style="margin: 0 0 0.5rem 0; color: var(--color-secondary); font-size: 1.25rem;">
                        ${getIconoCategoria(cat.categoria)} ${cat.nombre_es}
                    </h3>
                    <p style="margin: 0; color: #666; font-size: 0.875rem;">
                        ${cat.categoria} • Orden: ${cat.orden || 0}
                    </p>
                </div>
                <span class="badge ${cat.disponible ? 'badge-success' : 'badge-danger'}" style="font-size: 0.75rem;">
                    ${cat.disponible ? '✓ Disponible' : '✗ No disponible'}
                </span>
            </div>

            ${cat.temporada && cat.temporada !== 'todo_año' ? `
                <div style="background: #f3f4f6; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem;">
                    <p style="margin: 0; font-size: 0.875rem; color: #666;">
                        <strong>Temporada:</strong> ${formatearTemporada(cat.temporada)}
                    </p>
                </div>
            ` : ''}

            ${cat.descripcion ? `
                <p style="margin: 0 0 1rem 0; color: #666; font-size: 0.875rem;">
                    ${cat.descripcion}
                </p>
            ` : ''}

            <!-- Botones de Orden -->
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <button 
                    class="btn btn-sm btn-outline" 
                    onclick="moverCategoria('${cat.id}', 'up')" 
                    ${index === 0 ? 'disabled' : ''}
                    style="flex: 0 0 40px;">
                    ↑
                </button>
                <button 
                    class="btn btn-sm btn-outline" 
                    onclick="moverCategoria('${cat.id}', 'down')" 
                    ${index === categorias.length - 1 ? 'disabled' : ''}
                    style="flex: 0 0 40px;">
                    ↓
                </button>
                <button 
                    class="btn btn-sm ${cat.disponible ? 'btn-warning' : 'btn-success'}" 
                    onclick="toggleDisponibilidad('${cat.id}')"
                    style="flex: 1;">
                    ${cat.disponible ? '🚫 Desactivar' : '✓ Activar'}
                </button>
            </div>

            <!-- Botones de Acción -->
            <div style="display: flex; gap: 0.5rem;">
                <button 
                    class="btn btn-sm btn-outline" 
                    onclick="abrirModalEditar('${cat.id}')"
                    style="flex: 1;">
                    ✏️ Editar
                </button>
                <button 
                    class="btn btn-sm btn-danger" 
                    onclick="eliminarCategoria('${cat.id}')"
                    style="flex: 0 0 auto;">
                    🗑️
                </button>
            </div>

            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 0.75rem; color: #999;">
                    Última actualización: ${formatearFecha(cat.updated_at)}
                </p>
            </div>
        </div>
    `).join('');
}

// Obtener icono de categoría
function getIconoCategoria(categoria) {
    const iconos = {
        'entrantes': '🥗',
        'platos_calientes': '🍲',
        'pescados': '🐟',
        'carnes': '🥩',
        'postres': '🍰',
        'vino_blanco': '🍷',
        'vino_tinto': '🍷',
        'cava_champagne': '🥂'
    };
    return iconos[categoria] || '📂';
}

// Formatear temporada
function formatearTemporada(temporada) {
    const temporadas = {
        'todo_año': 'Todo el año',
        'invierno': '❄️ Invierno',
        'verano': '☀️ Verano',
        'primavera': '🌸 Primavera',
        'otoño': '🍂 Otoño'
    };
    return temporadas[temporada] || temporada;
}

// Formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Toggle disponibilidad
async function toggleDisponibilidad(id) {
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) return;

    const nuevoEstado = !categoria.disponible;

    try {
        const { error } = await supabase
            .from('categorias_disponibilidad')
            .update({ disponible: nuevoEstado })
            .eq('id', id);

        if (error) throw error;

        mostrarToast(`Categoría ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`, 'success');
        await cargarCategorias();
    } catch (error) {
        console.error('Error actualizando disponibilidad:', error);
        mostrarToast('Error al actualizar la disponibilidad', 'error');
    }
}

// Abrir modal editar
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

// Guardar edición
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

// Cerrar modal editar
function cerrarModalEditar() {
    document.getElementById('modal-editar').style.display = 'none';
}

// Abrir modal nueva
function abrirModalNueva() {
    document.getElementById('form-nueva').reset();
    document.getElementById('modal-nueva').style.display = 'flex';
}

// Crear categoría
async function crearCategoria() {
    const form = document.getElementById('form-nueva');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const datos = {
        categoria: document.getElementById('nueva-categoria').value.toLowerCase(),
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
        if (error.code === '23505') {
            mostrarToast('Ya existe una categoría con ese ID', 'error');
        } else {
            mostrarToast('Error al crear categoría', 'error');
        }
    }
}

// Cerrar modal nueva
function cerrarModalNueva() {
    document.getElementById('modal-nueva').style.display = 'none';
}

// Eliminar categoría
async function eliminarCategoria(id) {
    const cat = categorias.find(c => c.id === id);
    if (!cat) return;

    // Contar items de esta categoría
    try {
        const { count } = await supabase
            .from('menu_items')
            .select('*', { count: 'exact', head: true })
            .eq('categoria', cat.categoria);

        const mensaje = count > 0
            ? `¿Eliminar la categoría "${cat.nombre_es}"?\n\nEsto también eliminará ${count} item(s) asociado(s).`
            : `¿Eliminar la categoría "${cat.nombre_es}"?`;

        if (!confirm(mensaje)) {
            return;
        }

        const { error } = await supabase
            .from('categorias_disponibilidad')
            .delete()
            .eq('id', id);

        if (error) throw error;

        mostrarToast('Categoría eliminada correctamente', 'success');
        await cargarCategorias();
    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error al eliminar categoría', 'error');
    }
}

// Mover categoría
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

// Mostrar notificación toast
function mostrarToast(mensaje, tipo = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = `toast toast-${tipo}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Configurar event listeners
function configurarEventListeners() {
    document.getElementById('refresh-btn').addEventListener('click', cargarCategorias);
    document.getElementById('nueva-categoria-btn').addEventListener('click', abrirModalNueva);

    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '/admin/login.html';
    });

    // Cerrar modales al hacer clic en overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            cerrarModalEditar();
            cerrarModalNueva();
        });
    });

    cargarInfoUsuario();
}

// Cargar información del usuario
async function cargarInfoUsuario() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        document.getElementById('admin-email').textContent = user.email;
        const nombre = user.email.split('@')[0];
        document.getElementById('admin-name').textContent = nombre.charAt(0).toUpperCase() + nombre.slice(1);
    }
}

// Exponer funciones al scope global para onclick
window.toggleDisponibilidad = toggleDisponibilidad;
window.abrirModalEditar = abrirModalEditar;
window.guardarEdicion = guardarEdicion;
window.cerrarModalEditar = cerrarModalEditar;
window.abrirModalNueva = abrirModalNueva;
window.crearCategoria = crearCategoria;
window.cerrarModalNueva = cerrarModalNueva;
window.eliminarCategoria = eliminarCategoria;
window.moverCategoria = moverCategoria;
