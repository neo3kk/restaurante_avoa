/**
 * SISTEMA DE AUTENTICACIÓN PARA ADMINISTRADORES
 * Usa Supabase Auth para gestionar sesiones
 */

class AdminAuth {
    constructor() {
        this.currentUser = null;
        this.initialized = false;
        // No llamar init() aquí, esperar a que se llame manualmente
    }

    /**
     * Inicializar sistema de autenticación
     */
    async init() {
        if (this.initialized) return;

        // Esperar a que supabase esté disponible
        if (typeof supabase === 'undefined') {
            console.warn('⏳ Esperando a que supabase esté disponible...');
            await new Promise(resolve => setTimeout(resolve, 100));
            return this.init(); // Reintentar
        }

        try {
            // Verificar si hay una sesión activa
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                this.currentUser = session.user;
                console.log('✅ Sesión activa:', this.currentUser.email);
            }

            // Escuchar cambios en la autenticación
            supabase.auth.onAuthStateChange((event, session) => {
                console.log('Auth event:', event);
                if (session) {
                    this.currentUser = session.user;
                } else {
                    this.currentUser = null;
                }
            });

            this.initialized = true;
            console.log('✅ AdminAuth inicializado correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar AdminAuth:', error);
        }
    }


    /**
     * Iniciar sesión
     */
    async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            this.currentUser = data.user;
            console.log('✅ Login exitoso:', this.currentUser.email);
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Error en login:', error);
            return {
                success: false,
                error: this.getErrorMessage(error.message)
            };
        }
    }

    /**
     * Cerrar sesión
     */
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            this.currentUser = null;
            console.log('✅ Logout exitoso');
            return { success: true };
        } catch (error) {
            console.error('❌ Error en logout:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Proteger una página (redirigir si no está autenticado)
     */
    async requireAuth() {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            // No hay sesión, redirigir al login
            window.location.href = '/admin/login.html';
            return false;
        }

        this.currentUser = session.user;
        return true;
    }

    /**
     * Traducir mensajes de error
     */
    getErrorMessage(errorCode) {
        const errorMessages = {
            'Invalid login credentials': 'Email o contraseña incorrectos',
            'Email not confirmed': 'Por favor, confirma tu email',
            'User not found': 'Usuario no encontrado',
            'Invalid email': 'Email no válido',
            'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
            'Email already registered': 'Este email ya está registrado',
            'Network request failed': 'Error de conexión. Verifica tu internet.',
        };

        return errorMessages[errorCode] || 'Error al iniciar sesión. Intenta de nuevo.';
    }

    /**
     * Registrar un nuevo administrador (solo para setup inicial)
     */
    async registerAdmin(email, password) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        role: 'admin',
                        nombre: 'Administrador'
                    }
                }
            });

            if (error) throw error;

            console.log('✅ Admin registrado:', data.user.email);
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Error al registrar admin:', error);
            return {
                success: false,
                error: this.getErrorMessage(error.message)
            };
        }
    }
}

// Crear instancia global
const adminAuth = new AdminAuth();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => adminAuth.init());
} else {
    adminAuth.init();
}

// ============================================
// MANEJO DEL FORMULARIO DE LOGIN
// ============================================

if (document.getElementById('login-form')) {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const errorMessage = document.getElementById('error-message');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener valores
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validar
        if (!email || !password) {
            showError('Por favor, completa todos los campos');
            return;
        }

        // Mostrar loader
        setLoading(true);
        hideError();

        // Intentar login
        const result = await adminAuth.login(email, password);

        if (result.success) {
            // Login exitoso
            console.log('✅ Redirigiendo al dashboard...');

            // Guardar preferencia de "recordar sesión"
            if (rememberCheckbox.checked) {
                localStorage.setItem('admin_remember', 'true');
            }

            // Redirigir al dashboard
            window.location.href = '/admin/dashboard.html';
        } else {
            // Error en login
            setLoading(false);
            showError(result.error);
        }
    });

    /**
     * Mostrar mensaje de error
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';

        // Shake animation
        errorMessage.classList.add('shake');
        setTimeout(() => {
            errorMessage.classList.remove('shake');
        }, 500);
    }

    /**
     * Ocultar mensaje de error
     */
    function hideError() {
        errorMessage.style.display = 'none';
    }

    /**
     * Mostrar/ocultar loader
     */
    function setLoading(loading) {
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoader = submitButton.querySelector('.btn-loader');

        if (loading) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            submitButton.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitButton.disabled = false;
        }
    }

    // Verificar si ya hay sesión activa
    (async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            // Ya hay sesión, redirigir al dashboard
            window.location.href = '/admin/dashboard.html';
        }
    })();
}
