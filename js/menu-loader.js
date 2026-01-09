/**
 * CARGA DINÁMICA DEL MENÚ - CARTA (COMPLETAMENTE DINÁMICO)
 * Restaurante Avoa
 */

// Cargar menú desde Supabase al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    await cargarMenuCompleto();
});

// Función principal para cargar todo el menú dinámicamente
async function cargarMenuCompleto() {
    try {
        // Cargar categorías disponibles
        const { data: categorias, error: errorCat } = await supabase
            .from('categorias_disponibilidad')
            .select('*')
            .eq('disponible', true)
            .order('orden', { ascending: true });

        if (errorCat) throw errorCat;

        // Cargar items disponibles
        const { data: items, error: errorItems } = await supabase
            .rpc('get_menu_items_disponibles');

        if (errorItems) throw errorItems;

        // Agrupar items por categoría
        const itemsPorCategoria = agruparPorCategoria(items);

        // Renderizar cada categoría dinámicamente
        renderizarMenuDinamico(categorias, itemsPorCategoria);

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

// Renderizar menú dinámicamente
function renderizarMenuDinamico(categorias, itemsPorCategoria) {
    const container = document.querySelector('.menu-content');
    if (!container) return;

    // Categorías que ya tienen sección HTML hardcodeada
    const categoriasExistentes = [
        'entrantes', 'platos_calientes', 'pescados', 'carnes',
        'postres', 'vino_blanco', 'vino_tinto', 'cava_champagne'
    ];

    categorias.forEach(categoria => {
        const items = itemsPorCategoria[categoria.categoria] || [];

        // Solo renderizar si hay items
        if (items.length === 0) return;

        // Si la categoría ya existe en el HTML, renderizar items en su sección
        if (categoriasExistentes.includes(categoria.categoria)) {
            renderizarEnSeccionExistente(categoria.categoria, items);
            return;
        }

        // Buscar sección dinámica existente o crearla
        let seccion = document.getElementById(`seccion-${categoria.categoria}`);

        if (!seccion) {
            // Crear nueva sección para categorías nuevas
            seccion = crearSeccionCategoria(categoria);
            container.appendChild(seccion);
        }

        // Renderizar items en la sección
        renderizarItemsCategoria(seccion, items, categoria.categoria);
    });
}

// Renderizar items en secciones existentes del HTML
function renderizarEnSeccionExistente(categoria, items) {
    // Mapeo de categorías a sus IDs de contenedor
    const contenedores = {
        'entrantes': 'entrantes-list',
        'platos_calientes': 'platos-calientes-list',
        'pescados': 'pescados-grid',
        'carnes': 'carnes-list',
        'postres': 'postres-list',
        'vino_blanco': null, // Se maneja especialmente
        'vino_tinto': 'vinos-tintos-list',
        'cava_champagne': 'cavas-champagne-list'
    };

    const containerId = contenedores[categoria];
    if (!containerId) {
        // Vinos blancos se manejan por subcategoría
        if (categoria === 'vino_blanco') {
            renderizarVinosBlancos(null, items);
        }
        return;
    }

    const lista = document.getElementById(containerId);
    if (!lista) return;

    // Renderizar según el tipo de categoría
    if (categoria === 'pescados') {
        renderizarPescados(lista, items);
    } else if (categoria === 'postres') {
        renderizarPostres(lista, items);
    } else {
        renderizarItemsEstandar(lista, items);
    }
}

// Crear sección de categoría
function crearSeccionCategoria(categoria) {
    const seccion = document.createElement('section');
    seccion.className = 'menu-section';
    seccion.id = `seccion-${categoria.categoria}`;
    seccion.style.marginTop = '3rem';

    const idioma = getIdioma();
    const nombreCategoria = categoria[`nombre_${idioma}`] || categoria.nombre_es;

    seccion.innerHTML = `
        <div class="section-header">
            <h2 style="font-family: var(--font-heading); color: var(--color-primary); font-size: 2rem;">
                ${nombreCategoria}
            </h2>
        </div>
        <ul class="menu-list" id="lista-${categoria.categoria}">
            <!-- Items se cargarán aquí -->
        </ul>
    `;

    return seccion;
}

// Renderizar items de una categoría
function renderizarItemsCategoria(seccion, items, categoria) {
    const lista = seccion.querySelector('.menu-list');
    if (!lista) return;

    renderizarItemsEstandar(lista, items);
}

// Renderizar items estándar
function renderizarItemsEstandar(lista, items) {
    lista.innerHTML = items.map(item => {
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

// Renderizar pescados (diseño especial con grid)
function renderizarPescados(lista, items) {
    lista.className = 'fish-grid';
    lista.innerHTML = items.map(item =>
        `<span class="fish-item">${getNombre(item)}</span>`
    ).join('');
}

// Renderizar vinos blancos (con subcategorías)
function renderizarVinosBlancos(lista, items) {
    // Agrupar por subcategoría
    const porSubcategoria = items.reduce((acc, item) => {
        const sub = item.subcategoria || 'Otros';
        if (!acc[sub]) acc[sub] = [];
        acc[sub].push(item);
        return acc;
    }, {});

    // Renderizar cada subcategoría en su contenedor
    Object.keys(porSubcategoria).forEach(subcategoria => {
        const subItems = porSubcategoria[subcategoria];
        const containerId = `vinos-blancos-${subcategoria.toLowerCase()}`;
        const container = document.getElementById(containerId);

        if (container) {
            container.innerHTML = subItems.map(item => `
                <li class="menu-item">
                    <span class="menu-item-name">${getNombre(item)}</span>
                    <span class="price-line"></span>
                    <span class="menu-item-price">${formatearPrecio(item)}</span>
                </li>
            `).join('');
        }
    });
}

// Renderizar postres (con precio común si aplica)
function renderizarPostres(lista, items) {
    const precioComun = items.length > 0 ? items[0].precio : null;
    const todosMismoPrecio = items.every(item => item.precio === precioComun);

    if (todosMismoPrecio && precioComun) {
        lista.innerHTML = items.map(item => `
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
        renderizarItemsEstandar(lista, items);
    }
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

// Recargar menú cuando cambia el idioma
window.addEventListener('idiomaChanged', () => {
    cargarMenuCompleto();
});
