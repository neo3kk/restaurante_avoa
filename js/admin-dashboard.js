/**
 * LÓGICA DEL DASHBOARD DE ADMINISTRACIÓN
 * Restaurante Avoa
 */

// Proteger la página - requiere autenticación
(async () => {
    const isAuth = await adminAuth.requireAuth();
    if (!isAuth) return;

    // Cargar información del usuario
    const user = adminAuth.getCurrentUser();
    if (user) {
        document.getElementById('admin-email').textContent = user.email;
        const nombre = user.user_metadata?.nombre || 'Admin';
        document.getElementById('admin-name').textContent = nombre;

        // Actualizar avatar con inicial
        const avatar = document.querySelector('.user-avatar');
        if (avatar) {
            avatar.textContent = nombre.charAt(0).toUpperCase();
        }
    }

    // Cargar datos del dashboard
    await loadDashboardData();
})();

/**
 * Cargar todos los datos del dashboard
 */
async function loadDashboardData() {
    try {
        showLoading();

        // Cargar estadísticas
        await loadStats();

        // Cargar reservas de hoy
        await loadReservasHoy();

        // Cargar reservas pendientes
        await loadReservasPendientes();

        hideLoading();
    } catch (error) {
        console.error('Error al cargar dashboard:', error);
        showToast('Error al cargar los datos', 'error');
        hideLoading();
    }
}

/**
 * Cargar estadísticas del dashboard
 */
async function loadStats() {
    try {
        // Llamar a la función de Supabase
        const { data, error } = await supabase.rpc('get_dashboard_stats');

        if (error) throw error;

        // Actualizar las tarjetas de estadísticas
        document.getElementById('stat-reservas-hoy').textContent = data.reservas_hoy || 0;
        document.getElementById('stat-personas-hoy').textContent = `${data.personas_hoy || 0} personas`;
        document.getElementById('stat-pendientes').textContent = data.reservas_pendientes || 0;
        document.getElementById('stat-confirmadas').textContent = data.reservas_confirmadas || 0;
        document.getElementById('stat-emails').textContent = data.emails_enviados_hoy || 0;

        console.log('✅ Estadísticas cargadas:', data);
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        // Mostrar valores por defecto
        document.getElementById('stat-reservas-hoy').textContent = '0';
        document.getElementById('stat-personas-hoy').textContent = '0 personas';
        document.getElementById('stat-pendientes').textContent = '0';
        document.getElementById('stat-confirmadas').textContent = '0';
        document.getElementById('stat-emails').textContent = '0';
    }
}

/**
 * Cargar reservas de hoy
 */
async function loadReservasHoy() {
    try {
        const hoy = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('reservas')
            .select('*')
            .eq('fecha', hoy)
            .neq('estado', 'cancelada')
            .order('hora', { ascending: true });

        if (error) throw error;

        const tbody = document.getElementById('reservas-hoy-body');

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <div class="empty-icon">📅</div>
                        <p>No hay reservas para hoy</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(reserva => `
            <tr>
                <td><strong>${formatHora(reserva.hora)}</strong></td>
                <td>${reserva.nombre}</td>
                <td><span class="badge badge-info">${reserva.personas} ${reserva.personas === 1 ? 'persona' : 'personas'}</span></td>
                <td><a href="tel:${reserva.telefono}">${reserva.telefono}</a></td>
                <td>${getEstadoBadge(reserva.estado)}</td>
                <td>
                    <div class="action-buttons">
                        ${reserva.estado === 'pendiente' ? `
                            <button class="btn-icon btn-success" onclick="confirmarReserva('${reserva.id}')" title="Confirmar">
                                ✓
                            </button>
                        ` : ''}
                        <button class="btn-icon btn-primary" onclick="verDetalles('${reserva.id}')" title="Ver detalles">
                            👁️
                        </button>
                        ${reserva.estado !== 'cancelada' ? `
                            <button class="btn-icon btn-danger" onclick="cancelarReserva('${reserva.id}')" title="Cancelar">
                                ✕
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');

        console.log(`✅ ${data.length} reservas de hoy cargadas`);
    } catch (error) {
        console.error('Error al cargar reservas de hoy:', error);
        const tbody = document.getElementById('reservas-hoy-body');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state error">
                    <p>Error al cargar las reservas</p>
                </td>
            </tr>
        `;
    }
}

/**
 * Cargar reservas pendientes
 */
async function loadReservasPendientes() {
    try {
        const hoy = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('reservas')
            .select('*')
            .eq('estado', 'pendiente')
            .gte('fecha', hoy)
            .order('fecha', { ascending: true })
            .order('hora', { ascending: true });

        if (error) throw error;

        const tbody = document.getElementById('reservas-pendientes-body');
        const countBadge = document.getElementById('pendientes-count');

        countBadge.textContent = data.length;

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <div class="empty-icon">✅</div>
                        <p>No hay reservas pendientes</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(reserva => `
            <tr>
                <td><strong>${formatFecha(reserva.fecha)}</strong></td>
                <td>${formatHora(reserva.hora)}</td>
                <td>${reserva.nombre}</td>
                <td><a href="mailto:${reserva.email}">${reserva.email}</a></td>
                <td><span class="badge badge-info">${reserva.personas}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-success" onclick="confirmarReserva('${reserva.id}')" title="Confirmar">
                            ✓
                        </button>
                        <button class="btn-icon btn-primary" onclick="verDetalles('${reserva.id}')" title="Ver detalles">
                            👁️
                        </button>
                        <button class="btn-icon btn-danger" onclick="cancelarReserva('${reserva.id}')" title="Cancelar">
                            ✕
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        console.log(`✅ ${data.length} reservas pendientes cargadas`);
    } catch (error) {
        console.error('Error al cargar reservas pendientes:', error);
    }
}

/**
 * Confirmar una reserva
 */
async function confirmarReserva(reservaId) {
    const confirmed = await showConfirmModal(
        '¿Confirmar esta reserva?',
        'La reserva pasará a estado confirmado.'
    );

    if (!confirmed) return;

    try {
        const { error } = await supabase
            .from('reservas')
            .update({
                estado: 'confirmada',
                confirmada_en: new Date().toISOString()
            })
            .eq('id', reservaId);

        if (error) throw error;

        showToast('Reserva confirmada exitosamente', 'success');
        await loadDashboardData();
    } catch (error) {
        console.error('Error al confirmar reserva:', error);
        showToast('Error al confirmar la reserva', 'error');
    }
}

/**
 * Cancelar una reserva
 */
async function cancelarReserva(reservaId) {
    const confirmed = await showConfirmModal(
        '¿Cancelar esta reserva?',
        'Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    try {
        const { error } = await supabase
            .from('reservas')
            .update({
                estado: 'cancelada',
                cancelada_en: new Date().toISOString()
            })
            .eq('id', reservaId);

        if (error) throw error;

        showToast('Reserva cancelada', 'success');
        await loadDashboardData();
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        showToast('Error al cancelar la reserva', 'error');
    }
}

/**
 * Ver detalles de una reserva
 */
function verDetalles(reservaId) {
    // Redirigir a la página de reservas con el ID
    window.location.href = `/admin/reservas.html?id=${reservaId}`;
}

/**
 * Formatear fecha
 */
function formatFecha(fecha) {
    if (!fecha) return '-';
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Formatear hora
 */
function formatHora(hora) {
    if (!hora) return '-';
    return hora.substring(0, 5); // HH:MM
}

/**
 * Obtener badge de estado
 */
function getEstadoBadge(estado) {
    const badges = {
        'pendiente': '<span class="badge badge-warning">Pendiente</span>',
        'confirmada': '<span class="badge badge-success">Confirmada</span>',
        'cancelada': '<span class="badge badge-error">Cancelada</span>'
    };
    return badges[estado] || '<span class="badge">Desconocido</span>';
}

/**
 * Mostrar modal de confirmación
 */
function showConfirmModal(title, message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirm-modal');
        const messageEl = document.getElementById('confirm-message');
        const confirmBtn = document.getElementById('confirm-action-btn');

        messageEl.textContent = message;
        modal.style.display = 'flex';

        const handleConfirm = () => {
            modal.style.display = 'none';
            confirmBtn.removeEventListener('click', handleConfirm);
            resolve(true);
        };

        confirmBtn.addEventListener('click', handleConfirm);
    });
}

/**
 * Cerrar modal
 */
function closeModal() {
    const modal = document.getElementById('confirm-modal');
    modal.style.display = 'none';
}

/**
 * Mostrar notificación toast
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

/**
 * Mostrar/ocultar loading
 */
function showLoading() {
    // Implementar si es necesario
}

function hideLoading() {
    // Implementar si es necesario
}

// ============================================
// EVENT LISTENERS
// ============================================

// Botón de logout
document.getElementById('logout-btn')?.addEventListener('click', async () => {
    const result = await adminAuth.logout();
    if (result.success) {
        window.location.href = '/admin/login.html';
    }
});

// Botón de refresh
document.getElementById('refresh-btn')?.addEventListener('click', async () => {
    showToast('Actualizando datos...', 'info');
    await loadDashboardData();
    showToast('Datos actualizados', 'success');
});

// Cerrar modal al hacer clic fuera
document.getElementById('confirm-modal')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

// Botón de descargar carta en PDF
document.getElementById('download-menu-pdf')?.addEventListener('click', async () => {
    try {
        showToast('Abriendo carta para generar PDF...', 'info');
        
        const baseUrl = window.location.origin;
        const cartaUrl = baseUrl + '/carta.html';
        const cartaWindow = window.open(cartaUrl, '_blank', 'width=1200,height=900');
        
        if (!cartaWindow) {
            showToast('Por favor, permite las ventanas emergentes', 'error');
            return;
        }
        
        cartaWindow.addEventListener('load', async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 3000));
                cartaWindow.print();
                showToast(' En el diálogo: Destino  Guardar como PDF y activa Gráficos de fondo', 'info');
            } catch (error) {
                console.error('Error:', error);
                showToast('Error al preparar la impresión', 'error');
            }
        });
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al abrir la carta', 'error');
    }
});
