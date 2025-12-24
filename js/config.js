/**
 * CONFIGURACIÓN GLOBAL
 * Restaurante Avoa
 */

const APP_CONFIG = {
    // Modo debug (cambiar a false en producción)
    DEBUG_MODE: true,

    // Configuración de rate limiting
    RATE_LIMIT: {
        maxAttempts: 3,
        windowMs: 15 * 60 * 1000 // 15 minutos
    },

    // Horarios del restaurante
    HORARIOS: {
        LUNES_MARTES: {
            comida: { inicio: '13:30', fin: '16:30' }
        },
        MIERCOLES_SABADO: {
            comida: { inicio: '13:30', fin: '16:30' },
            cena: { inicio: '20:00', fin: '23:30' }
        },
        DOMINGO: 'cerrado'
    },

    // Intervalo de tiempo para reservas (en minutos)
    INTERVALO_RESERVAS: 15
};

// Función de logging condicional
function debugLog(message, data = null) {
    if (APP_CONFIG.DEBUG_MODE) {
        if (data) {
            console.log(message, data);
        } else {
            console.log(message);
        }
    }
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APP_CONFIG, debugLog };
}
