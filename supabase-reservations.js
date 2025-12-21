/**
 * SUPABASE RESERVATIONS HANDLER
 * Gestiona el envío de reservas a Supabase con protección anti-bot
 */

// Rate limiting: máximo de intentos por IP/sesión
const RATE_LIMIT = {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000 // 15 minutos
};

// Verificar rate limiting
function checkRateLimit() {
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem('reservation_attempts') || '[]');

    // Limpiar intentos antiguos
    const recentAttempts = attempts.filter(time => now - time < RATE_LIMIT.windowMs);

    if (recentAttempts.length >= RATE_LIMIT.maxAttempts) {
        const oldestAttempt = Math.min(...recentAttempts);
        const waitTime = Math.ceil((RATE_LIMIT.windowMs - (now - oldestAttempt)) / 60000);
        return {
            allowed: false,
            waitTime
        };
    }

    // Registrar nuevo intento
    recentAttempts.push(now);
    localStorage.setItem('reservation_attempts', JSON.stringify(recentAttempts));

    return { allowed: true };
}

// Función para enviar reserva con protección anti-bot
async function submitReservation(formData) {
    try {
        const lang = getCurrentLanguage();

        // Obtener token de reCAPTCHA si está configurado
        let recaptchaToken = null;
        if (typeof getRecaptchaToken === 'function') {
            recaptchaToken = await getRecaptchaToken('submit_reservation');
        }

        const reservationData = {
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            fecha: formData.fecha,
            personas: parseInt(formData.personas),
            comentarios: formData.comentarios || null,
            idioma: lang,
            estado: 'pendiente',
            recaptcha_token: recaptchaToken,
            created_at: new Date().toISOString()
        };

        const { data, error } = await window.supabaseClient
            .from('reservas')
            .insert([reservationData])
            .select();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error al enviar reserva:', error);
        return { success: false, error: error.message };
    }
}

// Inicializar formulario de reservas
function initializeReservationForm() {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Verificar rate limiting
        const rateLimitCheck = checkRateLimit();
        if (!rateLimitCheck.allowed) {
            showMessage(
                `Por favor, espera ${rateLimitCheck.waitTime} minutos antes de intentar otra reserva.`,
                'error'
            );
            return;
        }

        // Obtener datos del formulario
        const formData = {
            nombre: form.querySelector('input[type="text"]').value,
            email: form.querySelector('input[type="email"]').value,
            telefono: form.querySelector('input[type="tel"]').value,
            fecha: form.querySelector('input[type="date"]').value,
            personas: form.querySelector('input[type="number"]').value,
            comentarios: form.querySelector('textarea')?.value || ''
        };

        // Validar fecha (no permitir fechas pasadas)
        const selectedDate = new Date(formData.fecha);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showMessage('Por favor, selecciona una fecha válida.', 'error');
            return;
        }

        // Deshabilitar botón mientras se envía
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = getTranslation('enviando') || 'Enviando...';

        // Enviar reserva
        const result = await submitReservation(formData);

        if (result.success) {
            showMessage(
                getTranslation('reserva_exitosa') || '¡Reserva enviada con éxito! Te contactaremos pronto.',
                'success'
            );
            form.reset();
        } else {
            showMessage(
                getTranslation('reserva_error') || 'Hubo un error al enviar la reserva. Por favor, inténtalo de nuevo.',
                'error'
            );
        }

        // Rehabilitar botón
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

// Función auxiliar para mostrar mensajes
function showMessage(message, type = 'info') {
    // Crear elemento de mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-notification message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        font-family: var(--font-body);
    `;

    // Agregar animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(messageDiv);

    // Remover después de 5 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Función auxiliar para obtener traducciones
function getTranslation(key) {
    const lang = getCurrentLanguage();
    const translations = {
        enviando: {
            es: 'Enviando...',
            ca: 'Enviant...',
            en: 'Sending...'
        },
        reserva_exitosa: {
            es: '¡Reserva enviada con éxito! Te contactaremos pronto.',
            ca: 'Reserva enviada amb èxit! Et contactarem aviat.',
            en: 'Reservation sent successfully! We will contact you soon.'
        },
        reserva_error: {
            es: 'Hubo un error al enviar la reserva. Por favor, inténtalo de nuevo.',
            ca: 'Hi ha hagut un error en enviar la reserva. Si us plau, torna-ho a intentar.',
            en: 'There was an error sending the reservation. Please try again.'
        }
    };

    return translations[key]?.[lang] || translations[key]?.es;
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeReservationForm);
} else {
    initializeReservationForm();
}
