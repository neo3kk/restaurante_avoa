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

// Validar horario de apertura del restaurante
function validarHorario(fecha, hora) {
    const date = new Date(fecha);
    const diaSemana = date.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

    const [horas, minutos] = hora.split(':').map(Number);
    const horaMinutos = horas * 60 + minutos;

    const lang = localStorage.getItem('preferredLanguage') || 'es';
    const t = translations[lang] || translations.es;

    // Domingo (cerrado)
    if (diaSemana === 0) {
        return {
            valido: false,
            mensaje: t.cerrado_domingos
        };
    }

    // Lunes y Martes: 13:30 - 16:30
    if (diaSemana === 1 || diaSemana === 2) {
        const apertura = 13 * 60 + 30; // 13:30
        const cierre = 16 * 60 + 30;   // 16:30

        if (horaMinutos < apertura || horaMinutos > cierre) {
            return {
                valido: false,
                mensaje: t.horario_lunes_martes
            };
        }
    }

    // Miércoles a Sábado: 13:30 - 16:30 | 20:00 - 23:30
    if (diaSemana >= 3 && diaSemana <= 6) {
        const aperturaMediadia = 13 * 60 + 30; // 13:30
        const cierreMediadia = 16 * 60 + 30;   // 16:30
        const aperturaNoche = 20 * 60;         // 20:00
        const cierreNoche = 23 * 60 + 30;      // 23:30

        const enHorarioMediadia = horaMinutos >= aperturaMediadia && horaMinutos <= cierreMediadia;
        const enHorarioNoche = horaMinutos >= aperturaNoche && horaMinutos <= cierreNoche;

        if (!enHorarioMediadia && !enHorarioNoche) {
            return {
                valido: false,
                mensaje: t.horario_miercoles_sabado
            };
        }
    }

    return { valido: true };
}

// Función para enviar reserva con protección anti-bot
async function submitReservation(formData) {
    try {
        const lang = localStorage.getItem('preferredLanguage') || 'es';

        // 1. Obtener token de reCAPTCHA si está configurado
        let recaptchaToken = null;
        if (typeof getRecaptchaToken === 'function') {
            console.log('🔐 Obteniendo token de reCAPTCHA...');
            recaptchaToken = await getRecaptchaToken('submit_reservation');

            if (!recaptchaToken) {
                console.warn('⚠️ No se pudo obtener token de reCAPTCHA');
            }
        }

        // 2. Verificar token en backend (Edge Function)
        if (recaptchaToken) {
            console.log('🔍 Verificando token en backend...');

            try {
                // Invocar Edge Function de Supabase
                const { data: verifyData, error: verifyError } = await window.supabaseClient.functions.invoke('verify-recaptcha', {
                    body: JSON.stringify({ token: recaptchaToken })
                });

                if (verifyError) {
                    console.error('❌ Error al verificar reCAPTCHA:', verifyError);
                    throw new Error('Error de verificación anti-bot. Por favor, recarga la página e intenta de nuevo.');
                }

                if (!verifyData || !verifyData.valid) {
                    console.warn('⚠️ Token de reCAPTCHA inválido o score bajo');
                    throw new Error('Verificación anti-bot fallida. Si eres humano, por favor intenta de nuevo.');
                }

                console.log(`✅ reCAPTCHA verificado - Score: ${verifyData.score}`);
            } catch (verifyError) {
                console.error('❌ Error en verificación de reCAPTCHA:', verifyError);
                throw new Error('Error de verificación de seguridad. Por favor, intenta de nuevo.');
            }
        } else {
            console.warn('⚠️ reCAPTCHA no configurado - Enviando sin verificación');
        }

        // 3. Preparar datos de la reserva
        const reservationData = {
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            fecha: formData.fecha,
            hora: formData.hora,
            personas: parseInt(formData.personas),
            comentarios: formData.comentarios || null,
            idioma: lang,
            estado: 'pendiente',
            created_at: new Date().toISOString()
        };

        // 4. Insertar reserva en Supabase
        console.log('💾 Guardando reserva en base de datos...');
        const { data, error } = await window.supabaseClient
            .from('reservas')
            .insert([reservationData])
            .select();

        if (error) throw error;

        console.log('✅ Reserva guardada exitosamente');
        return { success: true, data };
    } catch (error) {
        console.error('❌ Error al enviar reserva:', error);
        return { success: false, error: error.message };
    }
}

// Inicializar formulario de reservas
function initializeReservationForm() {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();


        // Verificar rate limiting (controlado desde el panel de administración)
        const rateLimitEnabled = localStorage.getItem('rateLimitEnabled') !== 'false';

        if (rateLimitEnabled) {
            const rateLimitCheck = checkRateLimit();
            if (!rateLimitCheck.allowed) {
                showMessage(
                    `Por favor, espera ${rateLimitCheck.waitTime} minutos antes de intentar otra reserva.`,
                    'error'
                );
                return;
            }
        }

        // Obtener datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value,
            personas: document.getElementById('personas').value,
            comentarios: form.querySelector('textarea')?.value || ''
        };

        // Validar fecha (no permitir fechas pasadas)
        const selectedDate = new Date(formData.fecha);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            const lang = localStorage.getItem('preferredLanguage') || 'es';
            const t = translations[lang] || translations.es;
            showMessage(t.fecha_invalida, 'error');
            return;
        }

        // Validar horario de apertura
        const horarioValido = validarHorario(formData.fecha, formData.hora);
        if (!horarioValido.valido) {
            showMessage(horarioValido.mensaje, 'error');
            return;
        }

        // Deshabilitar botón mientras se envía
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        const originalText = submitBtn.textContent;
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
    const lang = localStorage.getItem('preferredLanguage') || 'es';
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


