/**
 * VALIDACIÓN DINÁMICA DE HORARIOS DE RESERVA
 * Actualiza las opciones de hora según el día seleccionado
 */

document.addEventListener('DOMContentLoaded', () => {
    const fechaInput = document.getElementById('fecha');
    const horaContainer = document.getElementById('hora')?.parentNode;

    if (!fechaInput || !horaContainer) return;

    // Configurar fecha mínima (hoy)
    const hoy = new Date();
    const fechaMin = hoy.toISOString().split('T')[0];
    fechaInput.setAttribute('min', fechaMin);

    // Actualizar opciones de hora cuando cambia la fecha
    fechaInput.addEventListener('change', actualizarOpcionesHora);

    // Inicializar con la fecha actual si está vacía
    if (!fechaInput.value) {
        fechaInput.value = fechaMin;
        actualizarOpcionesHora();
    }

    function actualizarOpcionesHora() {
        const fechaSeleccionada = fechaInput.value;
        if (!fechaSeleccionada) return;

        const date = new Date(fechaSeleccionada + 'T00:00:00');
        const diaSemana = date.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

        // Obtener o crear el select de hora
        let horaInput = document.getElementById('hora');

        // Cambiar a select para mostrar opciones
        if (!horaInput || horaInput.tagName !== 'SELECT') {
            const select = document.createElement('select');
            select.id = 'hora';
            select.required = true;

            if (horaInput) {
                horaInput.parentNode.replaceChild(select, horaInput);
            } else {
                horaContainer.appendChild(select);
            }
            horaInput = select;
        }

        const select = horaInput;
        const lang = localStorage.getItem('preferredLanguage') || 'es';
        const t = translations[lang] || translations.es;

        select.innerHTML = `<option value="">${t.selecciona_hora}</option>`;

        // Domingo (cerrado)
        if (diaSemana === 0) {
            select.innerHTML = `<option value="">${t.cerrado_domingos}</option>`;
            select.disabled = true;
            return;
        }

        select.disabled = false;

        // Lunes y Martes: 13:30 - 16:30
        if (diaSemana === 1 || diaSemana === 2) {
            agregarOpcionesHorario(select, 13, 30, 16, 30);
        }

        // Miércoles a Sábado: 13:30 - 16:30 | 20:00 - 23:30
        if (diaSemana >= 3 && diaSemana <= 6) {
            // Turno de mediodía
            agregarOpcionesHorario(select, 13, 30, 16, 30);

            // Separador
            const separador = document.createElement('option');
            separador.disabled = true;
            separador.textContent = '───────────';
            select.appendChild(separador);

            // Turno de noche
            agregarOpcionesHorario(select, 20, 0, 23, 30);
        }
    }

    function agregarOpcionesHorario(select, horaInicio, minInicio, horaFin, minFin) {
        const inicioMinutos = horaInicio * 60 + minInicio;
        const finMinutos = horaFin * 60 + minFin;

        // Generar opciones cada 15 minutos
        for (let minutos = inicioMinutos; minutos <= finMinutos; minutos += 15) {
            const horas = Math.floor(minutos / 60);
            const mins = minutos % 60;

            const horaStr = horas.toString().padStart(2, '0');
            const minStr = mins.toString().padStart(2, '0');
            const valorHora = `${horaStr}:${minStr}`;

            const option = document.createElement('option');
            option.value = valorHora;
            option.textContent = valorHora;
            select.appendChild(option);
        }
    }


    // Ejecutar al cargar si ya hay una fecha seleccionada
    if (fechaInput.value) {
        actualizarOpcionesHora();
    }

    // Sobrescribir changeLanguage para actualizar el select de hora
    setTimeout(() => {
        const originalChangeLanguage = window.changeLanguage;

        window.changeLanguage = function (lang) {
            if (originalChangeLanguage) {
                originalChangeLanguage(lang);
            }

            // Actualizar el select de hora si existe
            const fechaInput = document.getElementById('fecha');
            if (fechaInput && fechaInput.value) {
                // Trigger change event para actualizar las opciones
                fechaInput.dispatchEvent(new Event('change'));
            }
        };
    }, 100);
});
