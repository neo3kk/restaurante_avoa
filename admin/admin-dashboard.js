/**
 * ADMIN DASHBOARD
 * Carga y muestra estadísticas del dashboard
 */

// Cargar datos del dashboard
async function loadDashboardData() {
    await Promise.all([
        loadReservasHoy(),
        loadTotalPlatos(),
        loadReservasMes(),
        loadRecentReservations()
    ]);
}

// Obtener reservas de hoy
async function loadReservasHoy() {
    try {
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('reservas')
            .select('*', { count: 'exact' })
            .eq('fecha', today)
            .eq('estado', 'pendiente');

        if (error) throw error;

        document.getElementById('reservasHoy').textContent = data?.length || 0;
    } catch (error) {
        console.error('Error cargando reservas de hoy:', error);
        document.getElementById('reservasHoy').textContent = '-';
    }
}

// Obtener total de platos activos
async function loadTotalPlatos() {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*', { count: 'exact' })
            .eq('activo', true);

        if (error) throw error;

        document.getElementById('totalPlatos').textContent = data?.length || 0;
    } catch (error) {
        console.error('Error cargando total de platos:', error);
        document.getElementById('totalPlatos').textContent = '-';
    }
}

// Obtener reservas del mes
async function loadReservasMes() {
    try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('reservas')
            .select('*', { count: 'exact' })
            .gte('fecha', firstDay)
            .lte('fecha', lastDay);

        if (error) throw error;

        document.getElementById('reservasMes').textContent = data?.length || 0;
    } catch (error) {
        console.error('Error cargando reservas del mes:', error);
        document.getElementById('reservasMes').textContent = '-';
    }
}

// Cargar últimas reservas
async function loadRecentReservations() {
    try {
        const { data, error } = await supabase
            .from('reservas')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;

        const container = document.getElementById('recentReservations');

        if (!data || data.length === 0) {
            container.innerHTML = '<p style="color: var(--admin-text-light);">No hay reservas recientes</p>';
            return;
        }

        container.innerHTML = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 2px solid var(--admin-border); text-align: left;">
                        <th style="padding: 0.75rem; color: var(--admin-text-light); font-weight: 600; font-size: 0.875rem;">Nombre</th>
                        <th style="padding: 0.75rem; color: var(--admin-text-light); font-weight: 600; font-size: 0.875rem;">Email</th>
                        <th style="padding: 0.75rem; color: var(--admin-text-light); font-weight: 600; font-size: 0.875rem;">Fecha</th>
                        <th style="padding: 0.75rem; color: var(--admin-text-light); font-weight: 600; font-size: 0.875rem;">Personas</th>
                        <th style="padding: 0.75rem; color: var(--admin-text-light); font-weight: 600; font-size: 0.875rem;">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(reserva => `
                        <tr style="border-bottom: 1px solid var(--admin-border);">
                            <td style="padding: 0.75rem; color: var(--admin-text);">${reserva.nombre}</td>
                            <td style="padding: 0.75rem; color: var(--admin-text-light); font-size: 0.875rem;">${reserva.email}</td>
                            <td style="padding: 0.75rem; color: var(--admin-text);">${formatDate(reserva.fecha)}</td>
                            <td style="padding: 0.75rem; color: var(--admin-text);">${reserva.personas}</td>
                            <td style="padding: 0.75rem;">
                                <span style="
                                    padding: 0.25rem 0.75rem;
                                    border-radius: 9999px;
                                    font-size: 0.75rem;
                                    font-weight: 600;
                                    background: ${getStatusColor(reserva.estado).bg};
                                    color: ${getStatusColor(reserva.estado).text};
                                ">
                                    ${getStatusText(reserva.estado)}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error cargando reservas recientes:', error);
        document.getElementById('recentReservations').innerHTML =
            '<p style="color: var(--admin-danger);">Error al cargar reservas</p>';
    }
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Obtener color según estado
function getStatusColor(estado) {
    const colors = {
        pendiente: { bg: '#fef3c7', text: '#92400e' },
        confirmada: { bg: '#d1fae5', text: '#065f46' },
        cancelada: { bg: '#fee2e2', text: '#991b1b' },
        completada: { bg: '#e0e7ff', text: '#3730a3' }
    };
    return colors[estado] || colors.pendiente;
}

// Obtener texto según estado
function getStatusText(estado) {
    const texts = {
        pendiente: 'Pendiente',
        confirmada: 'Confirmada',
        cancelada: 'Cancelada',
        completada: 'Completada'
    };
    return texts[estado] || estado;
}

// Cargar datos cuando el usuario esté autenticado
if (currentUser) {
    loadDashboardData();
}
