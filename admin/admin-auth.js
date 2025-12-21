/**
 * ADMIN AUTHENTICATION
 * Gestiona el login y logout del panel de administración
 */

let currentUser = null;

// Verificar si hay una sesión activa
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        currentUser = session.user;
        showDashboard();
        return true;
    } else {
        showLogin();
        return false;
    }
}

// Mostrar pantalla de login
function showLogin() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

// Mostrar dashboard
function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');

    // Actualizar nombre de usuario
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.email;
    }
}

// Manejar login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorDiv = document.getElementById('loginError');

    // Deshabilitar botón
    loginBtn.disabled = true;
    loginBtn.textContent = 'Iniciando sesión...';
    errorDiv.classList.add('hidden');

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        currentUser = data.user;
        showDashboard();

        // Cargar datos del dashboard si existe la función
        if (typeof loadDashboardData === 'function') {
            loadDashboardData();
        }
    } catch (error) {
        console.error('Error de login:', error);
        errorDiv.textContent = 'Email o contraseña incorrectos';
        errorDiv.classList.remove('hidden');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Iniciar Sesión';
    }
});

// Manejar logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    currentUser = null;
    showLogin();
});

// Verificar autenticación al cargar
checkAuth();

// Escuchar cambios en la autenticación
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        currentUser = session.user;
        showDashboard();
    } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        showLogin();
    }
});
