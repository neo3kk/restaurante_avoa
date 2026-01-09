/**
 * GESTIÓN DE MENÚ - ADMIN PANEL
 * Restaurante Avoa
 */

// Estado global
let platos = [];
let platosFiltrados = [];
let paginaActual = 1;
const platosPorPagina = 15;

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await cargarPlatos();
    configurarEventListeners();
});

// Cargar platos desde Supabase
async function cargarPlatos() {
    try {
        mostrarCargando();

        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('categoria', { ascending: true })
            .order('subcategoria', { ascending: true })
            .order('orden', { ascending: true })
            .order('nombre_es', { ascending: true });

        if (error) throw error;

        platos = data || [];
        aplicarFiltros();
        mostrarToast('Menú cargado correctamente', 'success');
    } catch (error) {
        console.error('Error cargando menú:', error);
        mostrarToast('Error al cargar el menú', 'error');
        mostrarEstadoVacio('Error al cargar el menú');
    }
}

// Aplicar filtros
function aplicarFiltros() {
    const categoria = document.getElementById('filter-categoria').value;
    const disponible = document.getElementById('filter-disponible').value;
    const buscar = document.getElementById('filter-buscar').value.toLowerCase();

    platosFiltrados = platos.filter(plato => {
        if (categoria && plato.categoria !== categoria) return false;
        if (disponible !== '' && plato.disponible.toString() !== disponible) return false;

        if (buscar) {
            const nombre = (plato.nombre_es || '').toLowerCase();
            if (!nombre.includes(buscar)) return false;
        }

        return true;
    });

    paginaActual = 1;
    renderizarPlatos();
    actualizarPaginacion();
}

// Renderizar tabla de platos
function renderizarPlatos() {
    const tbody = document.getElementById('platos-body');
    const inicio = (paginaActual - 1) * platosPorPagina;
    const fin = inicio + platosPorPagina;
    const platosPagina = platosFiltrados.slice(inicio, fin);

    document.getElementById('total-platos').textContent =
        `${platosFiltrados.length} item${platosFiltrados.length !== 1 ? 's' : ''}`;

    if (platosPagina.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div class="empty-icon">🍽️</div>
                    <p>No se encontraron platos</p>
                    <button class="btn btn-primary" onclick="abrirModalNuevoPlato()">
                        Crear Primer Plato
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = platosPagina.map(plato => `
        <tr>
            <td><strong>${plato.nombre_es || '-'}</strong>${plato.subcategoria ? ` <span class="badge badge-secondary" style="font-size: 0.75rem;">${plato.subcategoria}</span>` : ''}</td>
            <td><span class="badge badge-info">${formatearCategoria(plato.categoria)}</span></td>
            <td><strong>${formatearPrecio(plato.precio, plato.precio_mercado)}</strong></td>
            <td><span class="descripcion-preview" title="${plato.descripcion_es || ''}">${truncarTexto(plato.descripcion_es, 50)}</span></td>
            <td>${plato.disponible ? '<span class="badge badge-success">Disponible</span>' : '<span class="badge badge-danger">No disponible</span>'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon ${plato.disponible ? 'btn-warning' : 'btn-success'}" 
                            onclick="toggleDisponibilidad('${plato.id}')" 
                            title="${plato.disponible ? 'Marcar como no disponible' : 'Marcar como disponible'}">
                        ${plato.disponible ? '🚫' : '✓'}
                    </button>
                    <button class="btn-icon btn-primary" onclick="editarPlato('${plato.id}')" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-icon btn-danger" onclick="eliminarPlato('${plato.id}')" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Actualizar paginación
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(platosFiltrados.length / platosPorPagina);

    document.getElementById('page-info').textContent =
        `Página ${paginaActual} de ${totalPaginas || 1}`;

    document.getElementById('prev-page').disabled = paginaActual === 1;
    document.getElementById('next-page').disabled = paginaActual >= totalPaginas;
}

// Formatear categoría
function formatearCategoria(categoria) {
    const categorias = {
        'entrantes': 'Entrantes',
        'platos_calientes': 'Platos Calientes',
        'pescados': 'Pescados',
        'carnes': 'Carnes',
        'postres': 'Postres',
        'vino_blanco': '🍷 Vino Blanco',
        'vino_tinto': '🍷 Vino Tinto',
        'cava_champagne': '🥂 Cava/Champagne'
    };
    return categorias[categoria] || categoria;
}

// Formatear precio
function formatearPrecio(precio, precioMercado) {
    if (precioMercado) return '<span style="color: #888; font-style: italic;">PSM</span>';
    if (!precio && precio !== 0) return '-';
    return `${parseFloat(precio).toFixed(2)}€`;
}

// Truncar texto
function truncarTexto(texto, maxLength) {
    if (!texto) return '-';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
}

// Abrir modal nuevo plato
function abrirModalNuevoPlato() {
    document.getElementById('modal-title').textContent = 'Nuevo Item';
    document.getElementById('plato-form').reset();
    document.getElementById('plato-id').value = '';
    document.getElementById('plato-disponible').checked = true;
    document.getElementById('plato-precio-mercado').checked = false;
    document.getElementById('plato-orden').value = 0;
    document.getElementById('subcategoria-row').style.display = 'none';
    document.getElementById('plato-modal').style.display = 'flex';
}

// Editar plato
function editarPlato(id) {
    const plato = platos.find(p => p.id === id);
    if (!plato) return;

    document.getElementById('modal-title').textContent = 'Editar Item';
    document.getElementById('plato-id').value = plato.id || '';
    document.getElementById('plato-nombre-es').value = plato.nombre_es || '';
    document.getElementById('plato-nombre-ca').value = plato.nombre_ca || '';
    document.getElementById('plato-nombre-en').value = plato.nombre_en || '';
    document.getElementById('plato-categoria').value = plato.categoria || '';
    document.getElementById('plato-precio').value = plato.precio || '';
    document.getElementById('plato-descripcion-es').value = plato.descripcion_es || '';
    document.getElementById('plato-descripcion-ca').value = plato.descripcion_ca || '';
    document.getElementById('plato-descripcion-en').value = plato.descripcion_en || '';
    document.getElementById('plato-disponible').checked = plato.disponible !== false;
    document.getElementById('plato-precio-mercado').checked = plato.precio_mercado || false;
    document.getElementById('plato-subcategoria').value = plato.subcategoria || '';
    document.getElementById('plato-orden').value = plato.orden || 0;

    // Mostrar/ocultar subcategoría según categoría
    const esVino = ['vino_blanco', 'vino_tinto', 'cava_champagne'].includes(plato.categoria);
    document.getElementById('subcategoria-row').style.display = esVino ? 'flex' : 'none';

    document.getElementById('plato-modal').style.display = 'flex';
}

// Guardar plato
async function guardarPlato() {
    const form = document.getElementById('plato-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById('plato-id').value;
    const precioMercado = document.getElementById('plato-precio-mercado').checked;
    const precioValor = document.getElementById('plato-precio').value;

    const datos = {
        nombre_es: document.getElementById('plato-nombre-es').value.trim(),
        nombre_ca: document.getElementById('plato-nombre-ca').value.trim() || null,
        nombre_en: document.getElementById('plato-nombre-en').value.trim() || null,
        categoria: document.getElementById('plato-categoria').value,
        precio: precioMercado ? null : (precioValor ? parseFloat(precioValor) : null),
        precio_mercado: precioMercado,
        subcategoria: document.getElementById('plato-subcategoria').value || null,
        orden: parseInt(document.getElementById('plato-orden').value) || 0,
        descripcion_es: document.getElementById('plato-descripcion-es').value.trim() || null,
        descripcion_ca: document.getElementById('plato-descripcion-ca').value.trim() || null,
        descripcion_en: document.getElementById('plato-descripcion-en').value.trim() || null,
        disponible: document.getElementById('plato-disponible').checked
    };

    try {
        if (id) {
            const { error } = await supabase
                .from('menu_items')
                .update(datos)
                .eq('id', id);

            if (error) throw error;
            mostrarToast('Item actualizado correctamente', 'success');
        } else {
            const { error } = await supabase
                .from('menu_items')
                .insert([datos]);

            if (error) throw error;
            mostrarToast('Item creado correctamente', 'success');
        }

        cerrarModalPlato();
        await cargarPlatos();
    } catch (error) {
        console.error('Error guardando plato:', error);
        mostrarToast('Error al guardar el plato: ' + (error.message || ''), 'error');
    }
}

// Toggle disponibilidad
async function toggleDisponibilidad(id) {
    const plato = platos.find(p => p.id === id);
    if (!plato) return;

    try {
        const { error } = await supabase
            .from('menu_items')
            .update({ disponible: !plato.disponible })
            .eq('id', id);

        if (error) throw error;

        mostrarToast(`Plato marcado como ${!plato.disponible ? 'disponible' : 'no disponible'}`, 'success');
        await cargarPlatos();
    } catch (error) {
        console.error('Error actualizando disponibilidad:', error);
        mostrarToast('Error al actualizar la disponibilidad', 'error');
    }
}

// Eliminar plato
function eliminarPlato(id) {
    const plato = platos.find(p => p.id === id);
    if (!plato) return;

    document.getElementById('confirm-message').textContent =
        `¿Estás seguro de que quieres eliminar "${plato.nombre_es}"?`;

    document.getElementById('confirm-action-btn').onclick = async () => {
        try {
            const { error } = await supabase
                .from('menu_items')
                .delete()
                .eq('id', id);

            if (error) throw error;

            mostrarToast('Plato eliminado', 'success');
            cerrarModalConfirm();
            await cargarPlatos();
        } catch (error) {
            console.error('Error eliminando plato:', error);
            mostrarToast('Error al eliminar el plato', 'error');
        }
    };

    document.getElementById('confirm-modal').style.display = 'flex';
}

// Cerrar modales
function cerrarModalPlato() {
    document.getElementById('plato-modal').style.display = 'none';
}

function cerrarModalConfirm() {
    document.getElementById('confirm-modal').style.display = 'none';
}

// Mostrar estado de cargando
function mostrarCargando() {
    const tbody = document.getElementById('platos-body');
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="empty-state">
                <div class="empty-icon">⏳</div>
                <p>Cargando platos...</p>
            </td>
        </tr>
    `;
}

// Mostrar estado vacío
function mostrarEstadoVacio(mensaje) {
    const tbody = document.getElementById('platos-body');
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="empty-state">
                <div class="empty-icon">🍽️</div>
                <p>${mensaje}</p>
            </td>
        </tr>
    `;
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
    document.getElementById('refresh-btn').addEventListener('click', cargarPlatos);
    document.getElementById('nuevo-plato-btn').addEventListener('click', abrirModalNuevoPlato);
    document.getElementById('guardar-plato-btn').addEventListener('click', guardarPlato);

    document.getElementById('filter-categoria').addEventListener('change', aplicarFiltros);
    document.getElementById('filter-disponible').addEventListener('change', aplicarFiltros);
    document.getElementById('filter-buscar').addEventListener('input', aplicarFiltros);
    document.getElementById('limpiar-filtros-btn').addEventListener('click', () => {
        document.getElementById('filter-categoria').value = '';
        document.getElementById('filter-disponible').value = '';
        document.getElementById('filter-buscar').value = '';
        aplicarFiltros();
    });

    document.getElementById('prev-page').addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarPlatos();
            actualizarPaginacion();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const totalPaginas = Math.ceil(platosFiltrados.length / platosPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarPlatos();
            actualizarPaginacion();
        }
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                cerrarModalPlato();
                cerrarModalConfirm();
            }
        });
    });

    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '/admin/login.html';
    });

    // Listener para mostrar/ocultar subcategoría según categoría
    document.getElementById('plato-categoria').addEventListener('change', (e) => {
        const esVino = ['vino_blanco', 'vino_tinto', 'cava_champagne'].includes(e.target.value);
        document.getElementById('subcategoria-row').style.display = esVino ? 'flex' : 'none';
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
