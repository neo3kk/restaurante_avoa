/**
 * SUPABASE MENU HANDLER
 * Gestiona la carga dinámica del menú desde Supabase
 */

// Obtener el idioma actual
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'es';
}

// Cargar items del menú por categoría
async function loadMenuItems(categoria) {
    try {
        const { data, error } = await window.supabaseClient
            .from('menu_items')
            .select('*')
            .eq('categoria', categoria)
            .eq('activo', true)
            .order('orden', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error cargando items del menú:', error);
        return [];
    }
}

// Cargar items destacados para la página principal
async function loadFeaturedItems() {
    try {
        const { data, error } = await window.supabaseClient
            .from('menu_items')
            .select('*')
            .eq('activo', true)
            .eq('destacado', true)
            .order('orden', { ascending: true })
            .limit(3);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error cargando items destacados:', error);
        return [];
    }
}

// Renderizar item del menú
function renderMenuItem(item, lang = 'es') {
    const nombre = item[`nombre_${lang}`] || item.nombre_es;
    const descripcion = item[`descripcion_${lang}`] || item.descripcion_es || '';

    let precioHTML = '';
    if (item.precio) {
        precioHTML = `<span class="menu-item-price">${item.precio}€${item.unidad ? ` <span class="unit-price">${item.unidad}</span>` : ''}</span>`;
    } else if (item.precio_texto) {
        precioHTML = `<span class="menu-item-price" style="font-size: 0.9rem; font-weight: 400; font-style: italic; color: #888;">${item.precio_texto}</span>`;
    }

    return `
        <li class="menu-item">
            ${descripcion ? `
                <div style="display: flex; flex-direction: column;">
                    <span class="menu-item-name">${nombre}</span>
                    <span class="menu-item-desc">${descripcion}</span>
                </div>
            ` : `
                <span class="menu-item-name">${nombre}</span>
            `}
            ${precioHTML ? `<span class="price-line"></span>${precioHTML}` : ''}
        </li>
    `;
}

// Renderizar tarjeta de plato destacado (para index.html)
function renderFeaturedCard(item, lang = 'es') {
    const nombre = item[`nombre_${lang}`] || item.nombre_es;
    const descripcion = item[`descripcion_${lang}`] || item.descripcion_es || '';

    let precioHTML = '';
    if (item.precio) {
        precioHTML = `<span class="price">${item.precio}€</span>`;
    } else if (item.precio_texto) {
        precioHTML = `<span class="price" style="font-size: 0.9rem; font-style: italic;">${item.precio_texto}</span>`;
    }

    // Imagen por defecto si no hay imagen_url
    const imageSrc = item.imagen_url || `assets/images/${item.categoria}.png`;

    return `
        <div class="menu-card">
            <div class="card-image">
                <img src="${imageSrc}" alt="${nombre}" onerror="this.src='https://placehold.co/400x300/d4af37/0f172a?text=${encodeURIComponent(nombre)}'">
            </div>
            <div class="card-content">
                <h3>${nombre}</h3>
                ${descripcion ? `<p>${descripcion}</p>` : ''}
                ${precioHTML}
            </div>
        </div>
    `;
}

// Cargar menú completo en carta.html
async function loadFullMenu() {
    const lang = getCurrentLanguage();

    const categorias = [
        { id: 'entrantes', selector: '#entrantes-list' },
        { id: 'platos_calientes', selector: '#platos-calientes-list' },
        { id: 'pescados', selector: '#pescados-list' },
        { id: 'carnes', selector: '#carnes-list' },
        { id: 'postres', selector: '#postres-list' }
    ];

    for (const categoria of categorias) {
        const items = await loadMenuItems(categoria.id);
        const container = document.querySelector(categoria.selector);

        if (container && items.length > 0) {
            container.innerHTML = items.map(item => renderMenuItem(item, lang)).join('');
        }
    }
}

// Cargar platos destacados en index.html
async function loadFeaturedMenu() {
    const lang = getCurrentLanguage();
    const items = await loadFeaturedItems();
    const container = document.querySelector('.menu-grid');

    if (container && items.length > 0) {
        container.innerHTML = items.map(item => renderFeaturedCard(item, lang)).join('');
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMenu);
} else {
    initializeMenu();
}

function initializeMenu() {
    // Detectar qué página estamos
    const isCartaPage = window.location.pathname.includes('carta.html');
    const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';

    if (isCartaPage) {
        loadFullMenu();
    } else if (isIndexPage) {
        loadFeaturedMenu();
    }
}
