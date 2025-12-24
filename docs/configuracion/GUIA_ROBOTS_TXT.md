# Guía: robots.txt - ¿Qué es y cómo funciona?

## 🤖 ¿Qué es robots.txt?

`robots.txt` es un archivo de texto que se coloca en la raíz de tu sitio web (`https://tudominio.com/robots.txt`) y sirve para **dar instrucciones a los bots de búsqueda** (Google, Bing, etc.) sobre qué páginas pueden o no indexar.

## ⚠️ IMPORTANTE: Lo que NO es robots.txt

### ❌ NO es una medida de seguridad
- Cualquiera puede leer tu `robots.txt`
- Los bots maliciosos lo ignoran completamente
- **NUNCA** uses `Disallow` para ocultar contenido privado

### ❌ NO bloquea el acceso
- Solo es una "sugerencia" para bots buenos
- No impide que alguien visite esas páginas directamente
- No protege archivos ni directorios

## ✅ Para qué SÍ sirve

1. **Guiar a los bots de búsqueda** - Qué páginas indexar
2. **Ahorrar recursos** - Evitar que indexen páginas innecesarias
3. **Indicar el sitemap** - Facilitar la indexación
4. **Controlar crawl rate** - Velocidad de rastreo

## 📝 Ejemplo Correcto (Restaurante Avoa)

```txt
# robots.txt - Restaurante Avoa

# Permitir a todos los bots acceder a todo
User-agent: *
Allow: /

# Sitemap
Sitemap: https://restauranteavoa.com/sitemap.xml
```

**Por qué es correcto:**
- ✅ Simple y claro
- ✅ No revela estructura interna
- ✅ Permite indexar todo el contenido público
- ✅ Indica dónde está el sitemap

## ❌ Ejemplo INCORRECTO (Inseguro)

```txt
# ¡NO HACER ESTO!
User-agent: *
Disallow: /admin/          # ← Revelas que existe /admin/
Disallow: /private/        # ← Le dices a atacantes dónde buscar
Disallow: /backup/         # ← Información sensible expuesta
Disallow: /config/         # ← Mala idea
```

**Por qué es incorrecto:**
- ❌ Revela estructura de directorios
- ❌ Indica dónde están áreas sensibles
- ❌ Da pistas a atacantes
- ❌ Falsa sensación de seguridad

## 🔒 Cómo proteger REALMENTE el panel de admin

### 1. Autenticación (Ya implementado ✅)
```javascript
// Supabase Auth protege el panel
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
    window.location.href = '/admin/login.html';
}
```

### 2. Configuración del Servidor

#### Apache (.htaccess)
```apache
# Proteger directorio /admin/
<Directory /admin>
    AuthType Basic
    AuthName "Área Restringida"
    AuthUserFile /path/to/.htpasswd
    Require valid-user
</Directory>
```

#### Nginx (nginx.conf)
```nginx
location /admin {
    auth_basic "Área Restringida";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

### 3. Firewall / IP Whitelist
```apache
# Solo permitir IPs específicas
<Directory /admin>
    Order Deny,Allow
    Deny from all
    Allow from 123.456.789.0  # Tu IP
</Directory>
```

### 4. HTTPS (SSL/TLS)
- Siempre usar HTTPS en producción
- Protege datos en tránsito
- Mejora SEO

## 📊 Casos de Uso Legítimos de Disallow

### 1. Evitar contenido duplicado
```txt
# No indexar parámetros de búsqueda
User-agent: *
Disallow: /*?s=
Disallow: /*?search=
```

### 2. Páginas de agradecimiento
```txt
# No indexar páginas de confirmación
User-agent: *
Disallow: /gracias.html
Disallow: /confirmacion.html
```

### 3. Archivos temporales
```txt
# No indexar archivos temporales
User-agent: *
Disallow: /tmp/
Disallow: /*.tmp$
```

### 4. Recursos no importantes
```txt
# No indexar recursos que no aportan valor SEO
User-agent: *
Disallow: /cgi-bin/
Disallow: /scripts/
```

## 🎯 Mejores Prácticas

### ✅ DO (Hacer)
1. Mantenerlo simple
2. Incluir el sitemap
3. Usar para contenido público no relevante
4. Testear con Google Search Console
5. Actualizar cuando cambies estructura

### ❌ DON'T (No hacer)
1. Usarlo como seguridad
2. Bloquear CSS/JS (perjudica SEO)
3. Revelar estructura interna
4. Bloquear contenido que quieres indexar
5. Olvidarte de actualizarlo

## 🔍 Cómo Verificar tu robots.txt

### 1. Acceso Directo
Visita: `https://tudominio.com/robots.txt`

### 2. Google Search Console
1. Ir a Search Console
2. Herramientas > Probador de robots.txt
3. Verificar que funciona correctamente

### 3. Validadores Online
- https://www.google.com/webmasters/tools/robots-testing-tool
- https://technicalseo.com/tools/robots-txt/

## 📱 Ejemplo para Restaurante Avoa

### Versión Actual (Correcta) ✅
```txt
User-agent: *
Allow: /
Sitemap: https://restauranteavoa.com/sitemap.xml
```

### Si necesitaras bloquear algo (Ejemplo)
```txt
User-agent: *
Allow: /

# No indexar páginas de confirmación
Disallow: /reserva-confirmada.html
Disallow: /gracias.html

# No indexar búsquedas internas
Disallow: /*?buscar=

Sitemap: https://restauranteavoa.com/sitemap.xml
```

## 🚨 Errores Comunes

### Error 1: Bloquear CSS/JS
```txt
# ❌ MAL - Perjudica el SEO
Disallow: /css/
Disallow: /js/
```
Google necesita ver CSS/JS para renderizar correctamente.

### Error 2: Sintaxis incorrecta
```txt
# ❌ MAL - Sintaxis incorrecta
User-agent *        # Falta el ":"
Disalow: /admin/    # "Disalow" mal escrito
```

### Error 3: Bloquear todo
```txt
# ❌ MAL - Bloquea todo el sitio
User-agent: *
Disallow: /
```
Tu sitio no se indexará en Google.

## 📚 Recursos Adicionales

- **Documentación oficial de Google:** https://developers.google.com/search/docs/crawling-indexing/robots/intro
- **Especificación robots.txt:** https://www.robotstxt.org/
- **Tester de Google:** https://www.google.com/webmasters/tools/robots-testing-tool

## 💡 Conclusión

Para Restaurante Avoa:
- ✅ Mantén `robots.txt` simple
- ✅ No reveles estructura interna
- ✅ Protege el admin con autenticación real
- ✅ Usa Supabase Auth (ya implementado)
- ✅ Considera HTTPS en producción

**Recuerda:** `robots.txt` es para SEO, NO para seguridad.

---

**Última actualización:** 23 de Diciembre de 2025
