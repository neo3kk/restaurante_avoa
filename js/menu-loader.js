/**
 * CARGA DINÁMICA DEL MENÚ - CARTA
 * Restaurante Avoa
 */

// Cargar menú desde Supabase al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    await cargarMenuCompleto();
});

// Función principal para cargar todo el menú
async function cargarMenuCompleto() {
    try {
        // Usar la función que filtra por categorías disponibles
        const { data: items, error } = await supabase
            .rpc('get_menu_items_disponibles');

        if (error) throw error;

        // Agrupar items por categoría
        const itemsPorCategoria = agruparPorCategoria(items);

        // Cargar cada sección y ocultar si está vacía
        cargarEntrantes(itemsPorCategoria.entrantes || []);
        toggleSeccion('entrantes', itemsPorCategoria.entrantes);

        cargarPlatosCalientes(itemsPorCategoria.platos_calientes || []);
        toggleSeccion('platos_calientes', itemsPorCategoria.platos_calientes);

        cargarPescados(itemsPorCategoria.pescados || []);
        toggleSeccion('pescados', itemsPorCategoria.pescados);

        cargarCarnes(itemsPorCategoria.carnes || []);
        toggleSeccion('carnes', itemsPorCategoria.carnes);

        cargarPostres(itemsPorCategoria.postres || []);
        toggleSeccion('postres', itemsPorCategoria.postres);

        // Cargar vinos
        cargarVinosBlancos(itemsPorCategoria.vino_blanco || []);
        toggleSeccion('vino_blanco', itemsPorCategoria.vino_blanco);

        cargarVinosTintos(itemsPorCategoria.vino_tinto || []);
        toggleSeccion('vino_tinto', itemsPorCategoria.vino_tinto);

        cargarCavasChampagne(itemsPorCategoria.cava_champagne || []);
        toggleSeccion('cava_champagne', itemsPorCategoria.cava_champagne);

    } catch (error) {
        console.error('Error cargando menú:', error);
    }
}

// Agrupar items por categoría
function agruparPorCategoria(items) {
    return items.reduce((acc, item) => {
        if (!acc[item.categoria]) {
            acc[item.categoria] = [];
        }
        acc[item.categoria].push(item);
        return acc;
    }, {});
}

// Obtener idioma actual
function getIdioma() {
    return localStorage.getItem('idioma') || 'es';
}

// Obtener nombre traducido
function getNombre(item) {
    const idioma = getIdioma();
    return item[`nombre_${idioma}`] || item.nombre_es;
}

// Obtener descripción traducida
function getDescripcion(item) {
    const idioma = getIdioma();
    return item[`descripcion_${idioma}`] || item.descripcion_es || '';
}

// Formatear precio
function formatearPrecio(item) {
    if (item.precio_mercado) {
        const idioma = getIdioma();
        const textos = {
            es: 'Precio según mercado',
            ca: 'Preu segons mercat',
            en: 'Market price'
        };
        return textos[idioma] || textos.es;
    }
    if (!item.precio && item.precio !== 0) return '';
    return `${parseFloat(item.precio).toFixed(2)}€`;
}

// Toggle visibilidad de sección completa
function toggleSeccion(categoria, items) {
    // Mapeo de categorías a selectores de sección
    const selectorMap = {
        'entrantes': '.menu-section:has(#entrantes-list)',
        'platos_calientes': '.menu-section:has(#platos-calientes-list)',
        'pescados': '.menu-section:has(#pescados-grid)',
        'carnes': '.menu-section:has(#carnes-list)',
        'postres': '.menu-section:has(#postres-list)',
        'vino_blanco': '.menu-column:has(#vinos-blancos-godello)',
        'vino_tinto': 'h3:has(+ #vinos-tintos-list)',
        'cava_champagne': 'h3:has(+ #cavas-champagne-list)'
    };

    // Selectores alternativos si :has() no funciona
    const alternativeSelectors = {
        'entrantes': 'section.menu-section:nth-of-type(1)',
        'platos_calientes': 'section.menu-section:nth-of-type(2)',
        'pescados': 'section.menu-section:nth-of-type(3)',
        'carnes': 'section.menu-section:nth-of-type(4)',
        'postres': 'section.menu-section:nth-of-type(5)'
    };

    const selector = selectorMap[categoria];
    let seccion = null;

    // Intentar con selector :has()
    try {
        seccion = document.querySelector(selector);
    } catch (e) {
        // Si :has() no funciona, usar selector alternativo
        if (alternativeSelectors[categoria]) {
            seccion = document.querySelector(alternativeSelectors[categoria]);
        }
    }

    // Si no encontramos la sección, buscar por el contenedor directamente
    if (!seccion) {
        const containerIds = {
            'entrantes': 'entrantes-list',
            'platos_calientes': 'platos-calientes-list',
            'pescados': 'pescados-grid',
            'carnes': 'carnes-list',
            'postres': 'postres-list'
        };

        if (containerIds[categoria]) {
            const container = document.getElementById(containerIds[categoria]);
            if (container) {
                seccion = container.closest('.menu-section');
            }
        }
    }

    if (seccion) {
        if (!items || items.length === 0) {
            seccion.style.display = 'none';
        } else {
            seccion.style.display = '';
        }
    }
}


// Cargar entrantes
function cargarEntrantes(items) {
    const container = document.querySelector('#entrantes-list');
    if (!container) return;

    container.innerHTML = items.map(item => {
        const descripcion = getDescripcion(item);
        return `
            <li class="menu-item">
                ${descripcion ? `
                    <div style="display: flex; flex-direction: column;">
                        <span class="menu-item-name">${getNombre(item)}</span>
                        <span class="menu-item-desc">${descripcion}</span>
                    </div>
                ` : `
                    <span class="menu-item-name">${getNombre(item)}</span>
                `}
                <span class="price-line"></span>
                <span class="menu-item-price">${formatearPrecio(item)}${item.unidad ? ` <span class="unit-price">/${item.unidad}</span>` : ''}</span>
            </li>
        `;
    }).join('');
}

// Cargar platos calientes
function cargarPlatosCalientes(items) {
    const container = document.querySelector('#platos-calientes-list');
    if (!container) return;

    container.innerHTML = items.map(item => {
        const descripcion = getDescripcion(item);
        return `
            <li class="menu-item">
                ${descripcion ? `
                    <div style="display: flex; flex-direction: column;">
                        <span class="menu-item-name">${getNombre(item)}</span>
                        <span class="menu-item-desc">${descripcion}</span>
                    </div>
                ` : `
                    <span class="menu-item-name">${getNombre(item)}</span>
                `}
                <span class="price-line"></span>
                <span class="menu-item-price">${formatearPrecio(item)}</span>
            </li>
        `;
    }).join('');
}

// Cargar pescados
function cargarPescados(items) {
    const container = document.querySelector('#pescados-grid');
    if (!container) return;

    container.innerHTML = items.map(item =>
        `<span class="fish-item">${getNombre(item)}</span>`
    ).join('');
}

// Cargar carnes
function cargarCarnes(items) {
    const container = document.querySelector('#carnes-list');
    if (!container) return;

    container.innerHTML = items.map(item => `
        <li class="menu-item">
            <span class="menu-item-name">${getNombre(item)}</span>
            <span class="price-line"></span>
            <span class="menu-item-price">${formatearPrecio(item)}</span>
        </li>
    `).join('');
}

// Cargar postres
function cargarPostres(items) {
    const container = document.querySelector('#postres-list');
    if (!container) return;

    // Agrupar postres por precio
    const precioComun = items.length > 0 ? items[0].precio : null;
    const todosMismoPrecio = items.every(item => item.precio === precioComun);

    if (todosMismoPrecio && precioComun) {
        // Mostrar lista sin precios individuales
        container.innerHTML = items.map(item => `
            <li class="menu-item">
                <span class="menu-item-name">${getNombre(item)}</span>
            </li>
        `).join('') + `
            <li class="menu-item" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
                <span class="price-line"></span>
                <span class="menu-item-price">${formatearPrecio(items[0])}</span>
            </li>
        `;
    } else {
        // Mostrar con precios individuales
        container.innerHTML = items.map(item => `
            <li class="menu-item">
                <span class="menu-item-name">${getNombre(item)}</span>
                <span class="price-line"></span>
                <span class="menu-item-price">${formatearPrecio(item)}</span>
            </li>
        `).join('');
    }
}

// Cargar vinos blancos
function cargarVinosBlancos(items) {
    // Agrupar por subcategoría
    const porSubcategoria = items.reduce((acc, item) => {
        const sub = item.subcategoria || 'Otros';
        if (!acc[sub]) acc[sub] = [];
        acc[sub].push(item);
        return acc;
    }, {});

    // Renderizar cada subcategoría
    Object.keys(porSubcategoria).forEach(subcategoria => {
        const containerId = `vinos-blancos-${subcategoria.toLowerCase()}`;
        const container = document.querySelector(`#${containerId}`);
        if (!container) return;

        container.innerHTML = porSubcategoria[subcategoria].map(item => `
            <li class="menu-item">
                <span class="menu-item-name">${getNombre(item)}</span>
                <span class="price-line"></span>
                <span class="menu-item-price">${formatearPrecio(item)}</span>
            </li>
        `).join('');
    });
}

// Cargar vinos tintos
function cargarVinosTintos(items) {
    const container = document.querySelector('#vinos-tintos-list');
    if (!container) return;

    container.innerHTML = items.map(item => `
        <li class="menu-item">
            <span class="menu-item-name">${getNombre(item)}</span>
            <span class="price-line"></span>
            <span class="menu-item-price">${formatearPrecio(item)}</span>
        </li>
    `).join('');
}

// Cargar cavas y champagne
function cargarCavasChampagne(items) {
    const container = document.querySelector('#cavas-champagne-list');
    if (!container) return;

    container.innerHTML = items.map(item => `
        <li class="menu-item">
            <span class="menu-item-name">${getNombre(item)}</span>
            <span class="price-line"></span>
            <span class="menu-item-price">${formatearPrecio(item)}</span>
        </li>
    `).join('');
}

// Recargar menú cuando cambia el idioma
window.addEventListener('idiomaChanged', () => {
    cargarMenuCompleto();
});
