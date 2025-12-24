/**
 * SERVICIO DE CONFIGURACIÓN DEL RESTAURANTE
 * 
 * Este módulo gestiona la configuración del restaurante desde Supabase.
 * Incluye horarios, capacidad, y otros parámetros configurables.
 */

class ConfiguracionService {
    constructor() {
        this.config = null;
        this.loaded = false;
    }

    /**
     * Cargar configuración desde Supabase
     */
    async cargarConfiguracion() {
        try {
            const { data, error } = await supabase
                .from('configuracion')
                .select('*');

            if (error) throw error;

            // Convertir array a objeto para fácil acceso
            this.config = {};
            data.forEach(item => {
                this.config[item.clave] = item.valor;
            });

            this.loaded = true;
            console.log('✅ Configuración cargada:', this.config);
            return this.config;
        } catch (error) {
            console.error('Error al cargar configuración:', error);
            // Usar configuración por defecto si falla
            this.config = this.getConfiguracionPorDefecto();
            this.loaded = true;
            return this.config;
        }
    }

    /**
     * Configuración por defecto (fallback)
     */
    getConfiguracionPorDefecto() {
        return {
            // Horarios (según la web)
            'horario_lunes_martes_inicio': '13:30',
            'horario_lunes_martes_fin': '16:30',
            'horario_miercoles_sabado_comida_inicio': '13:30',
            'horario_miercoles_sabado_comida_fin': '16:30',
            'horario_miercoles_sabado_cena_inicio': '20:00',
            'horario_miercoles_sabado_cena_fin': '23:30',
            'dia_cerrado': '0', // 0 = Domingo

            // Capacidad (preparado para el futuro, pero desactivado)
            'validar_capacidad': 'false',
            'capacidad_maxima': '999',
            'max_personas_reserva': '999',
            'min_personas_reserva': '1',

            // Email y contacto
            'email_restaurante': 'reservas@restauranteavoa.com',
            'nombre_restaurante': 'Restaurante Avoa',
            'telefono_restaurante': '+34 659 02 13 02',
            'direccion_restaurante': 'Avinguda de l\'Argentina, 59, 07011 Palma',

            // Recordatorios
            'recordatorio_horas_antes': '24',
            'enviar_recordatorios': 'true'
        };
    }

    /**
     * Obtener un valor de configuración
     */
    get(clave, valorPorDefecto = null) {
        if (!this.loaded) {
            console.warn('⚠️ Configuración no cargada aún');
            return valorPorDefecto;
        }
        return this.config[clave] || valorPorDefecto;
    }

    /**
     * Verificar si un día está abierto
     * @param {Date} fecha - Fecha a verificar
     * @returns {boolean}
     */
    estaAbierto(fecha) {
        const diaSemana = fecha.getDay(); // 0 = Domingo, 6 = Sábado
        const diaCerrado = parseInt(this.get('dia_cerrado', '0'));

        return diaSemana !== diaCerrado;
    }

    /**
     * Obtener horarios disponibles para una fecha
     * @param {Date} fecha - Fecha a verificar
     * @returns {Array} Array de objetos con horarios {inicio, fin, tipo}
     */
    getHorariosDisponibles(fecha) {
        const diaSemana = fecha.getDay();
        const horarios = [];

        // Verificar si está cerrado
        if (!this.estaAbierto(fecha)) {
            return horarios;
        }

        // Lunes (1) y Martes (2)
        if (diaSemana === 1 || diaSemana === 2) {
            horarios.push({
                inicio: this.get('horario_lunes_martes_inicio', '13:30'),
                fin: this.get('horario_lunes_martes_fin', '16:30'),
                tipo: 'comida'
            });
        }
        // Miércoles (3) a Sábado (6)
        else if (diaSemana >= 3 && diaSemana <= 6) {
            horarios.push({
                inicio: this.get('horario_miercoles_sabado_comida_inicio', '13:30'),
                fin: this.get('horario_miercoles_sabado_comida_fin', '16:30'),
                tipo: 'comida'
            });
            horarios.push({
                inicio: this.get('horario_miercoles_sabado_cena_inicio', '20:00'),
                fin: this.get('horario_miercoles_sabado_cena_fin', '23:30'),
                tipo: 'cena'
            });
        }

        return horarios;
    }

    /**
     * Validar si una hora está dentro del horario
     * @param {Date} fecha - Fecha de la reserva
     * @param {string} hora - Hora en formato HH:MM
     * @returns {boolean}
     */
    esHoraValida(fecha, hora) {
        const horarios = this.getHorariosDisponibles(fecha);

        if (horarios.length === 0) {
            return false; // Día cerrado
        }

        // Convertir hora a minutos para comparar
        const [h, m] = hora.split(':').map(Number);
        const minutos = h * 60 + m;

        // Verificar si está dentro de algún horario
        return horarios.some(horario => {
            const [hi, mi] = horario.inicio.split(':').map(Number);
            const [hf, mf] = horario.fin.split(':').map(Number);
            const minutosInicio = hi * 60 + mi;
            const minutosFin = hf * 60 + mf;

            return minutos >= minutosInicio && minutos <= minutosFin;
        });
    }

    /**
     * Validar capacidad (preparado para el futuro)
     * @param {Date} fecha - Fecha de la reserva
     * @param {number} personas - Número de personas
     * @returns {Object} {valido: boolean, mensaje: string}
     */
    async validarCapacidad(fecha, personas) {
        // Si la validación está desactivada, siempre es válido
        if (this.get('validar_capacidad', 'false') === 'false') {
            return { valido: true, mensaje: '' };
        }

        // Validar mínimo y máximo por reserva
        const min = parseInt(this.get('min_personas_reserva', '1'));
        const max = parseInt(this.get('max_personas_reserva', '999'));

        if (personas < min) {
            return {
                valido: false,
                mensaje: `El mínimo de personas por reserva es ${min}`
            };
        }

        if (personas > max) {
            return {
                valido: false,
                mensaje: `El máximo de personas por reserva es ${max}`
            };
        }

        // Validar capacidad total del día
        const capacidadMaxima = parseInt(this.get('capacidad_maxima', '999'));

        try {
            // Obtener total de personas reservadas para ese día
            const { data, error } = await supabase
                .from('reservas')
                .select('personas')
                .eq('fecha', fecha.toISOString().split('T')[0])
                .in('estado', ['pendiente', 'confirmada']);

            if (error) throw error;

            const totalReservado = data.reduce((sum, r) => sum + r.personas, 0);
            const disponible = capacidadMaxima - totalReservado;

            if (personas > disponible) {
                return {
                    valido: false,
                    mensaje: `Solo hay disponibilidad para ${disponible} personas ese día`
                };
            }

            return { valido: true, mensaje: '' };
        } catch (error) {
            console.error('Error al validar capacidad:', error);
            // En caso de error, permitir la reserva
            return { valido: true, mensaje: '' };
        }
    }

    /**
     * Actualizar un valor de configuración
     * @param {string} clave - Clave de configuración
     * @param {string} valor - Nuevo valor
     */
    async actualizar(clave, valor) {
        try {
            const { error } = await supabase
                .from('configuracion')
                .update({
                    valor: valor,
                    updated_at: new Date().toISOString()
                })
                .eq('clave', clave);

            if (error) throw error;

            // Actualizar cache local
            this.config[clave] = valor;
            console.log(`✅ Configuración actualizada: ${clave} = ${valor}`);
            return true;
        } catch (error) {
            console.error('Error al actualizar configuración:', error);
            return false;
        }
    }
}

// Crear instancia global
const configuracionService = new ConfiguracionService();

// Cargar configuración al iniciar
if (typeof supabase !== 'undefined') {
    configuracionService.cargarConfiguracion();
}
