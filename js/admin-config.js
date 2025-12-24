/**
 * CONFIGURACIÓN - ADMIN PANEL
 * Restaurante Avoa
 */

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await cargarEstadisticas();
    await cargarInfoUsuario();
    configurarEventListeners();
});

// Cargar estadísticas
async function cargarEstadisticas() {
    try {
        // Total de reservas
        const { count: totalReservas, error: errorReservas } = await supabase
            .from('reservas')
            .select('*', { count: 'exact', head: true });

        if (!errorReservas) {
            document.getElementById('stat-total-reservas').textContent = totalReservas || 0;
        }

        // Reservas confirmadas
        const { count: confirmadas, error: errorConfirmadas } = await supabase
            .from('reservas')
            .select('*', { count: 'exact', head: true })
            .eq('estado', 'confirmada');

        if (!errorConfirmadas) {
            document.getElementById('stat-confirmadas').textContent = confirmadas || 0;
        }

        // Reservas pendientes
        const { count: pendientes, error: errorPendientes } = await supabase
            .from('reservas')
            .select('*', { count: 'exact', head: true })
            .eq('estado', 'pendiente');

        if (!errorPendientes) {
            document.getElementById('stat-pendientes').textContent = pendientes || 0;
        }

        // Total de platos en el menú
        const { count: totalPlatos, error: errorPlatos } = await supabase
            .from('menu_items')
            .select('*', { count: 'exact', head: true });

        if (!errorPlatos) {
            document.getElementById('stat-total-platos').textContent = totalPlatos || 0;
        }

    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

// Cargar información del usuario
async function cargarInfoUsuario() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) throw error;

        if (user) {
            const email = user.email;
            const nombre = email.split('@')[0];
            const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);

            // Actualizar en el sidebar
            document.getElementById('admin-email').textContent = email;
            document.getElementById('admin-name').textContent = nombreCapitalizado;

            // Actualizar en la sección de cuenta
            document.getElementById('admin-email-display').textContent = email;
            document.getElementById('admin-name-display').textContent = nombreCapitalizado;
        }
    } catch (error) {
        console.error('Error cargando información del usuario:', error);
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
    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '/admin/login.html';
    });

    // Cambiar contraseña (redirige a Supabase)
    document.getElementById('cambiar-password-btn').addEventListener('click', () => {
        mostrarToast('Redirigiendo a la configuración de Supabase...', 'info');
        setTimeout(() => {
            window.open('https://supabase.com', '_blank');
        }, 1000);
    });

    // Toggle de Rate Limiting
    const rateLimitToggle = document.getElementById('rate-limit-toggle');
    const rateLimitStatus = document.getElementById('rate-limit-status');

    // Cargar estado actual desde localStorage
    const rateLimitEnabled = localStorage.getItem('rateLimitEnabled') !== 'false';
    rateLimitToggle.checked = rateLimitEnabled;
    actualizarEstadoRateLimit(rateLimitEnabled);

    rateLimitToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        localStorage.setItem('rateLimitEnabled', enabled);
        actualizarEstadoRateLimit(enabled);

        if (enabled) {
            mostrarToast('✅ Protección activada - Límite de reservas habilitado', 'success');
        } else {
            mostrarToast('⚠️ Protección desactivada - Solo para pruebas', 'warning');
        }
    });

    function actualizarEstadoRateLimit(enabled) {
        if (enabled) {
            rateLimitStatus.innerHTML = '✅ Protección activa - Las reservas están limitadas (máx. 3 cada 15 min)';
            rateLimitStatus.style.color = '#10b981';
        } else {
            rateLimitStatus.innerHTML = '⚠️ Protección desactivada - Reservas ilimitadas (solo para pruebas)';
            rateLimitStatus.style.color = '#f59e0b';
        }
    }
}
