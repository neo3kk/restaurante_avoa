/**
 * GESTIÓN DE RESERVAS - ADMIN PANEL
 * Restaurante Avoa
 */

// Estado global
let reservas = [];
let reservasFiltradas = [];
let paginaActual = 1;
const reservasPorPagina = 10;
let reservaEditando = null;

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await cargarReservas();
    configurarEventListeners();
    configurarFiltroFecha();
});

// Configurar fecha por defecto (deshabilitado para mostrar todas las reservas)
function configurarFiltroFecha() {
    // const hoy = new Date().toISOString().split('T')[0];
    // document.getElementById('filter-fecha').value = hoy;
    // Dejar vacío para mostrar todas las reservas por defecto
}

// Cargar reservas desde Supabase
async function cargarReservas() {
    try {
        mostrarCargando();

        const { data, error } = await supabase
            .from('reservas')
            .select('*')
            .order('fecha', { ascending: true })
            .order('hora', { ascending: true });

        if (error) throw error;

        reservas = data || [];

        // Aplicar filtros (si hay filtros activos, se mantendrán)
        aplicarFiltros();

        mostrarToast('Reservas actualizadas', 'success');
    } catch (error) {
        console.error('Error cargando reservas:', error);
        mostrarToast('Error al cargar las reservas', 'error');
        mostrarEstadoVacio('Error al cargar las reservas');
    }
}

// Aplicar filtros
function aplicarFiltros() {
    const fecha = document.getElementById('filter-fecha').value;
    const estado = document.getElementById('filter-estado').value;
    const buscar = document.getElementById('filter-buscar').value.toLowerCase();

    reservasFiltradas = reservas.filter(reserva => {
        // Filtro por fecha
        if (fecha && reserva.fecha !== fecha) return false;

        // Filtro por estado
        if (estado && reserva.estado !== estado) return false;

        // Filtro por búsqueda
        if (buscar) {
            const nombre = (reserva.nombre || '').toLowerCase();
            const email = (reserva.email || '').toLowerCase();
            const telefono = (reserva.telefono || '').toLowerCase();

            if (!nombre.includes(buscar) &&
                !email.includes(buscar) &&
                !telefono.includes(buscar)) {
                return false;
            }
        }

        return true;
    });

    paginaActual = 1;
    renderizarReservas();
    actualizarPaginacion();
}

// Renderizar tabla de reservas
function renderizarReservas() {
    const tbody = document.getElementById('reservas-body');
    const inicio = (paginaActual - 1) * reservasPorPagina;
    const fin = inicio + reservasPorPagina;
    const reservasPagina = reservasFiltradas.slice(inicio, fin);

    // Actualizar contador
    document.getElementById('total-reservas').textContent =
        `${reservasFiltradas.length} reserva${reservasFiltradas.length !== 1 ? 's' : ''}`;

    if (reservasPagina.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-state">
                    <div class="empty-icon">📅</div>
                    <p>No se encontraron reservas</p>
                    <button class="btn btn-primary" onclick="abrirModalNuevaReserva()">
                        Crear Primera Reserva
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = reservasPagina.map(reserva => `
        <tr>
            <td>${reserva.fecha ? formatearFecha(reserva.fecha) : '-'}</td>
            <td>${reserva.hora ? formatearHora(reserva.hora) : '-'}</td>
            <td><strong>${reserva.nombre || '-'}</strong></td>
            <td>${reserva.email || '-'}</td>
            <td>${reserva.telefono || '-'}</td>
            <td><span class="badge badge-info">${reserva.personas || 0} ${(reserva.personas === 1) ? 'persona' : 'personas'}</span></td>
            <td><span class="comentarios-preview" title="${reserva.comentarios || ''}">${truncarTexto(reserva.comentarios, 30)}</span></td>
            <td>${obtenerBadgeEstado(reserva.estado || 'pendiente')}</td>
            <td>
                <div class="action-buttons">
                    ${(reserva.estado === 'pendiente') ? `
                        <button class="btn-icon btn-success" onclick="confirmarReserva('${reserva.id}')" title="Confirmar">
                            ✓
                        </button>
                    ` : ''}
                    <button class="btn-icon btn-primary" onclick="editarReserva('${reserva.id}')" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-icon btn-danger" onclick="eliminarReserva('${reserva.id}')" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Actualizar paginación
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);

    document.getElementById('page-info').textContent =
        `Página ${paginaActual} de ${totalPaginas || 1}`;

    document.getElementById('prev-page').disabled = paginaActual === 1;
    document.getElementById('next-page').disabled = paginaActual >= totalPaginas;
}

// Formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return '-';
    try {
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones);
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return fecha;
    }
}

// Formatear hora
function formatearHora(hora) {
    if (!hora) return '-';
    try {
        return hora.substring(0, 5);
    } catch (error) {
        console.error('Error formateando hora:', error);
        return hora;
    }
}

// Truncar texto largo
function truncarTexto(texto, maxLength) {
    if (!texto) return '-';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
}

// Obtener badge de estado
function obtenerBadgeEstado(estado) {
    const badges = {
        'pendiente': '<span class="badge badge-warning">Pendiente</span>',
        'confirmada': '<span class="badge badge-success">Confirmada</span>',
        'cancelada': '<span class="badge badge-danger">Cancelada</span>',
        'completada': '<span class="badge badge-info">Completada</span>'
    };
    return badges[estado] || '<span class="badge">Desconocido</span>';
}

// Abrir modal nueva reserva
function abrirModalNuevaReserva() {
    reservaEditando = null;
    document.getElementById('modal-title').textContent = 'Nueva Reserva';
    document.getElementById('reserva-form').reset();
    document.getElementById('reserva-id').value = '';

    // Establecer fecha y hora por defecto
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('reserva-fecha').value = hoy;
    document.getElementById('reserva-estado').value = 'pendiente';

    document.getElementById('reserva-modal').style.display = 'flex';
}

// Editar reserva
async function editarReserva(id) {
    const reserva = reservas.find(r => r.id === id);
    if (!reserva) return;

    reservaEditando = reserva;
    document.getElementById('modal-title').textContent = 'Editar Reserva';

    // Rellenar formulario con validaciones para valores nulos
    document.getElementById('reserva-id').value = reserva.id || '';
    document.getElementById('reserva-nombre').value = reserva.nombre || '';
    document.getElementById('reserva-email').value = reserva.email || '';
    document.getElementById('reserva-telefono').value = reserva.telefono || '';
    document.getElementById('reserva-personas').value = reserva.personas || 1;
    document.getElementById('reserva-fecha').value = reserva.fecha || '';
    document.getElementById('reserva-hora').value = reserva.hora || '';
    document.getElementById('reserva-estado').value = reserva.estado || 'pendiente';
    document.getElementById('reserva-notas').value = reserva.comentarios || '';

    document.getElementById('reserva-modal').style.display = 'flex';
}

// Guardar reserva
async function guardarReserva() {
    const form = document.getElementById('reserva-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById('reserva-id').value;

    // Validar y obtener valores
    const nombre = document.getElementById('reserva-nombre').value.trim();
    const email = document.getElementById('reserva-email').value.trim();
    const telefono = document.getElementById('reserva-telefono').value.trim();
    const personas = parseInt(document.getElementById('reserva-personas').value);
    const fecha = document.getElementById('reserva-fecha').value;
    const hora = document.getElementById('reserva-hora').value;
    const estado = document.getElementById('reserva-estado').value;
    const comentarios = document.getElementById('reserva-notas').value.trim();

    // Validaciones adicionales
    if (!nombre || !email || !telefono || !fecha || !hora) {
        mostrarToast('Por favor, completa todos los campos obligatorios', 'error');
        return;
    }

    if (personas < 1 || personas > 20) {
        mostrarToast('El número de personas debe estar entre 1 y 20', 'error');
        return;
    }

    const datos = {
        nombre: nombre,
        email: email,
        telefono: telefono,
        personas: personas,
        fecha: fecha,
        hora: hora,
        estado: estado,
        comentarios: comentarios || null
    };

    try {
        if (id) {
            // Actualizar
            const { error } = await supabase
                .from('reservas')
                .update(datos)
                .eq('id', id);

            if (error) throw error;
            mostrarToast('Reserva actualizada correctamente', 'success');
        } else {
            // Crear
            const { error } = await supabase
                .from('reservas')
                .insert([datos]);

            if (error) throw error;
            mostrarToast('Reserva creada correctamente', 'success');
        }

        cerrarModalReserva();
        await cargarReservas();
    } catch (error) {
        console.error('Error guardando reserva:', error);
        console.error('Detalles del error:', JSON.stringify(error, null, 2));

        let mensajeError = 'Error al guardar la reserva';
        if (error.message) {
            mensajeError += ': ' + error.message;
        }
        if (error.details) {
            mensajeError += ' - ' + error.details;
        }
        if (error.hint) {
            mensajeError += ' (Sugerencia: ' + error.hint + ')';
        }

        mostrarToast(mensajeError, 'error');
        alert('Error detallado:\n' + JSON.stringify(error, null, 2));
    }
}

// Confirmar reserva
async function confirmarReserva(id) {
    try {
        const { error } = await supabase
            .from('reservas')
            .update({ estado: 'confirmada' })
            .eq('id', id);

        if (error) throw error;

        // Enviar email de confirmación al cliente
        try {
            console.log('📧 Enviando email de confirmación al cliente...');
            const { error: emailError } = await supabase.functions.invoke('send-reservation-email', {
                body: JSON.stringify({
                    reservaId: id,
                    tipo: 'confirmada'
                })
            });

            if (emailError) {
                console.warn('⚠️ Error al enviar email:', emailError);
                mostrarToast('Reserva confirmada (email no enviado)', 'warning');
            } else {
                console.log('✅ Email de confirmación enviado');
                mostrarToast('Reserva confirmada y email enviado al cliente', 'success');
            }
        } catch (emailError) {
            console.warn('⚠️ Error al enviar email:', emailError);
            mostrarToast('Reserva confirmada (email no enviado)', 'warning');
        }

        await cargarReservas();
    } catch (error) {
        console.error('Error confirmando reserva:', error);
        mostrarToast('Error al confirmar la reserva', 'error');
    }
}

// Eliminar reserva
function eliminarReserva(id) {
    const reserva = reservas.find(r => r.id === id);
    if (!reserva) return;

    document.getElementById('confirm-message').textContent =
        `¿Estás seguro de que quieres eliminar la reserva de ${reserva.nombre}?`;

    document.getElementById('confirm-action-btn').onclick = async () => {
        try {
            const { error } = await supabase
                .from('reservas')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error al eliminar:', error);
                console.error('Detalles:', JSON.stringify(error, null, 2));
                throw error;
            }

            mostrarToast('Reserva eliminada', 'success');
            cerrarModalConfirm();
            await cargarReservas();
        } catch (error) {
            console.error('Error eliminando reserva:', error);

            let mensajeError = 'Error al eliminar la reserva';
            if (error.message) {
                mensajeError += ': ' + error.message;
            }
            if (error.details) {
                mensajeError += ' - ' + error.details;
            }
            if (error.hint) {
                mensajeError += ' (Sugerencia: ' + error.hint + ')';
            }

            mostrarToast(mensajeError, 'error');
            alert('Error al eliminar:\n' + JSON.stringify(error, null, 2));
        }
    };

    document.getElementById('confirm-modal').style.display = 'flex';
}

// Cerrar modales
function cerrarModalReserva() {
    document.getElementById('reserva-modal').style.display = 'none';
    reservaEditando = null;
}

function cerrarModalConfirm() {
    document.getElementById('confirm-modal').style.display = 'none';
}

// Mostrar estado de cargando
function mostrarCargando() {
    const tbody = document.getElementById('reservas-body');
    tbody.innerHTML = `
        <tr>
            <td colspan="9" class="empty-state">
                <div class="empty-icon">⏳</div>
                <p>Cargando reservas...</p>
            </td>
        </tr>
    `;
}

// Mostrar estado vacío
function mostrarEstadoVacio(mensaje) {
    const tbody = document.getElementById('reservas-body');
    tbody.innerHTML = `
        <tr>
            <td colspan="9" class="empty-state">
                <div class="empty-icon">📅</div>
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
    // Botones principales
    document.getElementById('refresh-btn').addEventListener('click', cargarReservas);
    document.getElementById('nueva-reserva-btn').addEventListener('click', abrirModalNuevaReserva);
    document.getElementById('guardar-reserva-btn').addEventListener('click', guardarReserva);

    // Filtros
    document.getElementById('filter-fecha').addEventListener('change', aplicarFiltros);
    document.getElementById('filter-estado').addEventListener('change', aplicarFiltros);
    document.getElementById('filter-buscar').addEventListener('input', aplicarFiltros);
    document.getElementById('limpiar-filtros-btn').addEventListener('click', () => {
        document.getElementById('filter-fecha').value = '';
        document.getElementById('filter-estado').value = '';
        document.getElementById('filter-buscar').value = '';
        aplicarFiltros();
    });

    // Paginación
    document.getElementById('prev-page').addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarReservas();
            actualizarPaginacion();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarReservas();
            actualizarPaginacion();
        }
    });

    // Cerrar modales al hacer clic en el overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                cerrarModalReserva();
                cerrarModalConfirm();
            }
        });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '/admin/login.html';
    });

    // Cargar info del usuario
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
