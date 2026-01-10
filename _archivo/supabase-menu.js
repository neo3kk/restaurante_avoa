/**
 * CARGA DINÁMICA DEL MENÚ DESDE SUPABASE
 * Restaurante Avoa
 */

// Esperar a que Supabase esté disponible
document.addEventListener('DOMContentLoaded', async () => {
    // Esperar a que supabase esté inicializado
    let intentos = 0;
    const maxIntentos = 20;

    while (typeof window.supabaseClient === 'undefined' && intentos < maxIntentos) {
        await new Promise(resolve => setTimeout(resolve, 100));
        intentos++;
    }

    if (typeof window.supabaseClient === 'undefined') {
        console.error('❌ Supabase no está disponible después de esperar');
        return;
    }

    console.log('✅ Supabase disponible, cargando menú...');
    await cargarMenuDinamico();
});

async function cargarMenuDinamico() {
    try {
        // Cargar todos los platos disponibles desde Supabase
        const { data: platos, error } = await window.supabaseClient
            .from('menu_items')
            .select('*')
            .eq('disponible', true)
            .order('categoria', { ascending: true })
            .order('orden', { ascending: true });

        if (error) {
            console.error('Error cargando menú:', error);
            return;
        }

        if (!platos || platos.length === 0) {
            console.warn('No hay platos disponibles en la base de datos');
            return;
        }

        // Agrupar platos por categoría
        const platosPorCategoria = {
            entrantes: [],
            pescados: [],
            mariscos: [],
            carnes: [],
            postres: []
        };

        platos.forEach(plato => {
            if (platosPorCategoria[plato.categoria]) {
                platosPorCategoria[plato.categoria].push(plato);
            }
        });

        // Renderizar cada categoría
        renderizarEntrantes(platosPorCategoria.entrantes);
        renderizarPescados(platosPorCategoria.pescados);
        renderizarMariscos(platosPorCategoria.mariscos);
        renderizarCarnes(platosPorCategoria.carnes);
        renderizarPostres(platosPorCategoria.postres);

        console.log('Menú cargado correctamente desde Supabase');
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

// Renderizar Entrantes
function renderizarEntrantes(platos) {
    const container = document.querySelector('.menu-section .menu-list');
    if (!container) return;

    container.innerHTML = platos.map(plato => {
        const precio = plato.precio ? `${plato.precio.toFixed(2)}€` : '<span style="font-size: 0.9rem; font-weight: 400; font-style: italic; color: #888;" data-i18n="precio_mercado">Precio según mercado</span>';

        return `
            <li class="menu-item">
                ${plato.descripcion_es ? `
                    <div style="display: flex; flex-direction: column;">
                        <span class="menu-item-name" data-nombre-es="${plato.nombre_es}" data-nombre-ca="${plato.nombre_ca || ''}" data-nombre-en="${plato.nombre_en || ''}">${plato.nombre_es}</span>
                        <span class="menu-item-desc" data-desc-es="${plato.descripcion_es || ''}" data-desc-ca="${plato.descripcion_ca || ''}" data-desc-en="${plato.descripcion_en || ''}">${plato.descripcion_es || ''}</span>
                    </div>
                ` : `
                    <span class="menu-item-name" data-nombre-es="${plato.nombre_es}" data-nombre-ca="${plato.nombre_ca || ''}" data-nombre-en="${plato.nombre_en || ''}">${plato.nombre_es}</span>
                `}
                <span class="price-line"></span>
                <span class="menu-item-price">${precio}</span>
            </li>
        `;
    }).join('');

    // Aplicar traducciones si hay un idioma seleccionado
    aplicarTraduccionesMenu();
}

// Renderizar Pescados
function renderizarPescados(platos) {
    const container = document.querySelector('.fish-grid');
    if (!container) return;

    // Mantener la nota inicial
    const nota = container.querySelector('.fish-note');

    container.innerHTML = '';
    if (nota) {
        container.appendChild(nota);
    }

    platos.forEach(plato => {
        const fishItem = document.createElement('span');
        fishItem.className = 'fish-item';
        fishItem.setAttribute('data-nombre-es', plato.nombre_es);
        fishItem.setAttribute('data-nombre-ca', plato.nombre_ca || '');
        fishItem.setAttribute('data-nombre-en', plato.nombre_en || '');
        fishItem.textContent = plato.nombre_es;
        container.appendChild(fishItem);
    });

    aplicarTraduccionesMenu();
}

// Renderizar Mariscos (se añaden a pescados)
function renderizarMariscos(platos) {
    const container = document.querySelector('.fish-grid');
    if (!container) return;

    platos.forEach(plato => {
        const fishItem = document.createElement('span');
        fishItem.className = 'fish-item';
        fishItem.setAttribute('data-nombre-es', plato.nombre_es);
        fishItem.setAttribute('data-nombre-ca', plato.nombre_ca || '');
        fishItem.setAttribute('data-nombre-en', plato.nombre_en || '');
        fishItem.textContent = plato.nombre_es;

        // El último elemento ocupa toda la fila
        if (plato.nombre_es.toLowerCase().includes('bogavante') || plato.nombre_es.toLowerCase().includes('llagosta')) {
            fishItem.style.gridColumn = '1 / -1';
        }

        container.appendChild(fishItem);
    });

    aplicarTraduccionesMenu();
}

// Renderizar Carnes
function renderizarCarnes(platos) {
    const sections = document.querySelectorAll('.menu-section');
    let carnesSection = null;

    sections.forEach(section => {
        const header = section.querySelector('h2[data-i18n="carta_carnes"]');
        if (header) {
            carnesSection = section;
        }
    });

    if (!carnesSection) return;

    const container = carnesSection.querySelector('.menu-list');
    if (!container) return;

    container.innerHTML = platos.map(plato => {
        const precio = plato.precio ? `${plato.precio.toFixed(2)}€` : '<span style="font-size: 0.9rem; font-weight: 400; font-style: italic; color: #888;">PSM</span>';

        return `
            <li class="menu-item">
                <span class="menu-item-name" data-nombre-es="${plato.nombre_es}" data-nombre-ca="${plato.nombre_ca || ''}" data-nombre-en="${plato.nombre_en || ''}">${plato.nombre_es}</span>
                <span class="price-line"></span>
                <span class="menu-item-price">${precio}</span>
            </li>
        `;
    }).join('');

    aplicarTraduccionesMenu();
}

// Renderizar Postres
function renderizarPostres(platos) {
    const sections = document.querySelectorAll('.menu-section');
    let postresSection = null;

    sections.forEach(section => {
        const header = section.querySelector('h2[data-i18n="carta_postres"]');
        if (header) {
            postresSection = section;
        }
    });

    if (!postresSection) return;

    const container = postresSection.querySelector('.menu-list');
    if (!container) return;

    // Obtener el precio (todos los postres tienen el mismo precio)
    const precioPostre = platos.length > 0 && platos[0].precio ? `${platos[0].precio.toFixed(2)}€` : '8€';

    container.innerHTML = platos.map(plato => {
        return `
            <li class="menu-item">
                <span class="menu-item-name" data-nombre-es="${plato.nombre_es}" data-nombre-ca="${plato.nombre_ca || ''}" data-nombre-en="${plato.nombre_en || ''}">${plato.nombre_es}</span>
            </li>
        `;
    }).join('');

    // Añadir el precio al final
    container.innerHTML += `
        <li class="menu-item" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
            <span class="price-line"></span>
            <span class="menu-item-price">${precioPostre}</span>
        </li>
    `;

    aplicarTraduccionesMenu();
}

// Aplicar traducciones al menú dinámico
function aplicarTraduccionesMenu() {
    const lang = localStorage.getItem('preferredLanguage') || 'es';

    // Traducir nombres de platos
    document.querySelectorAll('[data-nombre-es]').forEach(element => {
        const nombreEs = element.getAttribute('data-nombre-es');
        const nombreCa = element.getAttribute('data-nombre-ca');
        const nombreEn = element.getAttribute('data-nombre-en');

        if (lang === 'ca' && nombreCa) {
            element.textContent = nombreCa;
        } else if (lang === 'en' && nombreEn) {
            element.textContent = nombreEn;
        } else {
            element.textContent = nombreEs;
        }
    });

    // Traducir descripciones
    document.querySelectorAll('[data-desc-es]').forEach(element => {
        const descEs = element.getAttribute('data-desc-es');
        const descCa = element.getAttribute('data-desc-ca');
        const descEn = element.getAttribute('data-desc-en');

        if (lang === 'ca' && descCa) {
            element.textContent = descCa;
        } else if (lang === 'en' && descEn) {
            element.textContent = descEn;
        } else {
            element.textContent = descEs;
        }
    });
}

// Escuchar cambios de idioma
document.addEventListener('DOMContentLoaded', () => {
    // Sobrescribir la función changeLanguage original para incluir traducciones del menú
    const originalChangeLanguage = window.changeLanguage;

    window.changeLanguage = function (lang) {
        if (originalChangeLanguage) {
            originalChangeLanguage(lang);
        }
        aplicarTraduccionesMenu();
    };
});
