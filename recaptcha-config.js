/**
 * CONFIGURACIÓN DE GOOGLE reCAPTCHA v3
 * 
 * INSTRUCCIONES PARA OBTENER LAS CLAVES:
 * 1. Ve a https://www.google.com/recaptcha/admin
 * 2. Haz clic en "+" para crear un nuevo sitio
 * 3. Configuración:
 *    - Etiqueta: Restaurante Avoa
 *    - Tipo de reCAPTCHA: reCAPTCHA v3
 *    - Dominios: localhost, tu-dominio.com
 * 4. Acepta los términos y haz clic en "Enviar"
 * 5. Copia la "Clave del sitio" y pégala en RECAPTCHA_SITE_KEY
 * 6. La "Clave secreta" se usa en el backend (Supabase Edge Function)
 * 
 * IMPORTANTE: reCAPTCHA v3 es invisible y no interrumpe la experiencia del usuario
 */

const RECAPTCHA_SITE_KEY = '6Lfy6TIsAAAAAAW7SBygtxkGDD2O3w7v1sb1yZ8-';

// Cargar el script de reCAPTCHA
function loadRecaptcha() {
    if (!RECAPTCHA_SITE_KEY || RECAPTCHA_SITE_KEY === 'TU_CLAVE_DEL_SITIO_AQUI') {
        console.warn('⚠️ reCAPTCHA no configurado. Por favor, obtén tu clave en https://www.google.com/recaptcha/admin');
        return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    console.log('✅ reCAPTCHA cargado correctamente');
}

// Ejecutar reCAPTCHA y obtener token
async function getRecaptchaToken(action = 'submit_reservation') {
    if (!RECAPTCHA_SITE_KEY || RECAPTCHA_SITE_KEY === 'TU_CLAVE_DEL_SITIO_AQUI') {
        console.warn('⚠️ reCAPTCHA no configurado, omitiendo verificación');
        return null;
    }

    try {
        // Esperar a que grecaptcha esté disponible
        if (typeof grecaptcha === 'undefined') {
            console.warn('⚠️ grecaptcha no está cargado aún');
            return null;
        }

        const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
        console.log('✅ Token de reCAPTCHA obtenido');
        return token;
    } catch (error) {
        console.error('Error al obtener token de reCAPTCHA:', error);
        return null;
    }
}

// Cargar reCAPTCHA cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadRecaptcha);
} else {
    loadRecaptcha();
}
