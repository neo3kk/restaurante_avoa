# Sistema Multiidioma - Restaurante Avoa

## Idiomas Disponibles

La web del Restaurante Avoa está disponible en tres idiomas:
- 🇪🇸 **Español (ES)** - Idioma por defecto
- 🇨🇦 **Catalán (CA)**
- 🇬🇧 **Inglés (EN)**

## Cómo Funciona

### 1. Archivos del Sistema

- **`translations.js`**: Contiene todas las traducciones en los tres idiomas
- **`index.html`**: Página principal con atributos `data-i18n`
- **`carta.html`**: Menú digital con atributos `data-i18n`
- **`style.css`**: Estilos para el selector de idiomas

### 2. Selector de Idiomas

El selector de idiomas se encuentra en el **footer** de ambas páginas (index.html y carta.html).

Los usuarios pueden cambiar el idioma haciendo clic en los botones:
- **ES** - Español
- **CA** - Catalán  
- **EN** - Inglés

### 3. Persistencia

El idioma seleccionado se guarda en `localStorage`, por lo que:
- Se mantiene al navegar entre páginas
- Se recuerda en futuras visitas
- Si no hay idioma guardado, se usa español por defecto

### 4. Cómo Agregar Nuevas Traducciones

Para agregar una nueva traducción:

1. Abre `translations.js`
2. Agrega la clave y traducción en cada idioma:

```javascript
es: {
    nueva_clave: "Texto en español",
    // ...
},
ca: {
    nueva_clave: "Text en català",
    // ...
},
en: {
    nueva_clave: "Text in English",
    // ...
}
```

3. En el HTML, agrega el atributo `data-i18n`:

```html
<p data-i18n="nueva_clave">Texto en español</p>
```

### 5. Tipos de Elementos Traducibles

El sistema traduce automáticamente:
- **Texto de elementos**: `<p>`, `<h1>`, `<span>`, etc.
- **Placeholders de inputs**: `<input placeholder="...">`
- **Contenido HTML**: Soporta etiquetas como `<strong>`, `<br>`, etc.

## Estructura de Archivos

```
restaurante_avoa/
├── index.html          # Página principal (multiidioma)
├── carta.html          # Menú digital (multiidioma)
├── translations.js     # Archivo de traducciones
├── style.css           # Estilos (incluye selector de idiomas)
└── assets/
    └── images/         # Imágenes del sitio
```

## Notas Técnicas

- El cambio de idioma es **instantáneo** (sin recargar la página)
- El sistema usa el atributo `data-i18n` para identificar elementos traducibles
- El idioma activo se indica visualmente en el selector (botón con fondo dorado)
- Compatible con todos los navegadores modernos

## Mantenimiento

Para mantener el sitio actualizado:

1. **Actualizar traducciones**: Edita `translations.js`
2. **Agregar nuevo contenido**: Añade `data-i18n="clave"` en el HTML y la traducción en `translations.js`
3. **Cambiar idioma por defecto**: Modifica la línea en `translations.js`:
   ```javascript
   const savedLang = localStorage.getItem('preferredLanguage') || 'es'; // Cambiar 'es' por 'ca' o 'en'
   ```

---

**Desarrollado para Restaurante Avoa** | 2024
