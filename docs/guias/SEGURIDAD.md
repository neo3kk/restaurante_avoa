# Guía de Seguridad - Restaurante Avoa

## 🔒 Optimizaciones de Seguridad Implementadas

### ✅ 1. Headers de Seguridad HTTP

#### En HTML (index.html, carta.html)
```html
<!-- Security Headers -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
<meta name="referrer" content="strict-origin-when-cross-origin">
```

**Qué hacen:**
- **X-Content-Type-Options**: Previene MIME type sniffing
- **X-Frame-Options**: Protege contra clickjacking
- **X-XSS-Protection**: Activa filtro XSS del navegador
- **Referrer-Policy**: Controla información enviada en referrer

---

### ✅ 2. Archivo .htaccess (Raíz)

**Protecciones implementadas:**

#### Seguridad
- ✅ Bloqueo de archivos sensibles (.env, .bak, .sql)
- ✅ Deshabilitar listado de directorios
- ✅ Protección contra inyección SQL
- ✅ Headers de seguridad HTTP
- ✅ Content Security Policy (CSP)

#### Rendimiento
- ✅ Compresión GZIP
- ✅ Cache del navegador
- ✅ ETags optimizados

#### SEO
- ✅ URLs limpias (sin .html)
- ✅ Redirecciones 301
- ✅ HTTPS forzado (comentado, activar en producción)

---

### ✅ 3. Archivo .htaccess (/admin/)

**Protecciones adicionales para el panel:**
- ✅ Headers más estrictos
- ✅ X-Frame-Options: DENY (no puede cargarse en iframe)
- ✅ Strict-Transport-Security (HSTS)
- ✅ Opciones para autenticación HTTP básica
- ✅ Opciones para restricción por IP

---

## 🛡️ Capas de Seguridad

### Capa 1: Supabase Authentication ✅
```javascript
// Ya implementado
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
    window.location.href = '/admin/login.html';
}
```

### Capa 2: Row Level Security (RLS) ✅
```sql
-- Ya configurado en Supabase
-- Solo usuarios autenticados pueden modificar datos
```

### Capa 3: Headers HTTP ✅
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### Capa 4: .htaccess (Opcional)
```apache
# Activar según necesidad
# - Autenticación HTTP básica
# - Restricción por IP
# - Rate limiting
```

---

## 🚀 Optimizaciones SEO Implementadas

### 1. Meta Tags Completos ✅
- Title optimizado con keywords
- Description atractiva
- Keywords relevantes
- Canonical URLs
- Open Graph (Facebook, Twitter)
- Geo tags para SEO local

### 2. Datos Estructurados ✅
```json
{
  "@type": "Restaurant",
  "name": "Restaurante Avoa",
  "servesCuisine": ["Mediterránea", "Pescado", "Marisco"],
  ...
}
```

### 3. Archivos de Configuración ✅
- sitemap.xml
- robots.txt (seguro)
- favicon.svg

### 4. Rendimiento ✅
- Compresión GZIP
- Cache del navegador
- Lazy loading (pendiente)
- Imágenes optimizadas (pendiente)

---

## 📋 Checklist de Seguridad

### Implementado ✅
- [x] Autenticación con Supabase
- [x] Row Level Security (RLS)
- [x] Headers de seguridad HTTP
- [x] .htaccess con protecciones
- [x] robots.txt seguro
- [x] Protección contra clickjacking
- [x] Protección XSS
- [x] Content Security Policy

### Recomendado para Producción
- [ ] Activar HTTPS (SSL/TLS)
- [ ] Configurar HSTS
- [ ] Activar restricción por IP (admin)
- [ ] Configurar autenticación HTTP básica (doble capa)
- [ ] Implementar rate limiting
- [ ] Configurar firewall (Cloudflare, etc.)
- [ ] Backups automáticos
- [ ] Monitoreo de logs

### Opcional (Avanzado)
- [ ] 2FA (Two-Factor Authentication)
- [ ] WAF (Web Application Firewall)
- [ ] DDoS protection
- [ ] Penetration testing
- [ ] Security audit

---

## 🔧 Configuración para Producción

### 1. Activar HTTPS

En `.htaccess` (raíz), descomentar:
```apache
# Forzar HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 2. Configurar Dominio

Actualizar en todos los archivos:
- `index.html` - canonical URL
- `carta.html` - canonical URL
- `sitemap.xml` - URLs
- `robots.txt` - sitemap URL

Buscar y reemplazar:
```
https://restauranteavoa.com
```
Por tu dominio real.

### 3. Restricción por IP (Admin)

En `/admin/.htaccess`, descomentar y ajustar:
```apache
Order Deny,Allow
Deny from all
Allow from TU.IP.AQUI
```

Para obtener tu IP:
- https://www.whatismyip.com

### 4. Autenticación HTTP Básica (Opcional)

#### Paso 1: Crear archivo de contraseñas
```bash
htpasswd -c /ruta/completa/.htpasswd admin
```

#### Paso 2: En `/admin/.htaccess`, descomentar:
```apache
AuthType Basic
AuthName "Área de Administración"
AuthUserFile /ruta/completa/.htpasswd
Require valid-user
```

---

## 🔍 Verificar Seguridad

### Herramientas Online

1. **Security Headers**
   - https://securityheaders.com
   - Analiza headers HTTP

2. **SSL Labs**
   - https://www.ssllabs.com/ssltest/
   - Verifica configuración SSL/TLS

3. **Observatory by Mozilla**
   - https://observatory.mozilla.org
   - Análisis de seguridad completo

4. **CSP Evaluator**
   - https://csp-evaluator.withgoogle.com
   - Valida Content Security Policy

### Comandos de Verificación

```bash
# Ver headers HTTP
curl -I https://restauranteavoa.com

# Verificar SSL
openssl s_client -connect restauranteavoa.com:443

# Test de seguridad
nmap -sV --script=http-security-headers restauranteavoa.com
```

---

## 🚨 Qué Hacer en Caso de Incidente

### 1. Detectar el Problema
- Revisar logs del servidor
- Verificar Google Search Console
- Comprobar Supabase logs

### 2. Contener el Daño
- Cambiar todas las contraseñas
- Revocar tokens de API
- Bloquear IPs sospechosas

### 3. Investigar
- Identificar punto de entrada
- Revisar código modificado
- Analizar logs de acceso

### 4. Recuperar
- Restaurar desde backup
- Actualizar dependencias
- Aplicar parches de seguridad

### 5. Prevenir
- Implementar medidas adicionales
- Actualizar documentación
- Formar al equipo

---

## 📊 Monitoreo Continuo

### Logs a Revisar
- Apache/Nginx access logs
- Apache/Nginx error logs
- Supabase logs
- Google Search Console

### Métricas de Seguridad
- Intentos de login fallidos
- Peticiones bloqueadas
- Errores 403/404
- Tráfico inusual

### Alertas Configurar
- Múltiples logins fallidos
- Cambios en archivos críticos
- Picos de tráfico
- Errores del servidor

---

## 🔐 Mejores Prácticas

### DO (Hacer)
1. ✅ Mantener software actualizado
2. ✅ Usar contraseñas fuertes
3. ✅ Hacer backups regulares
4. ✅ Revisar logs periódicamente
5. ✅ Usar HTTPS siempre
6. ✅ Implementar múltiples capas de seguridad
7. ✅ Limitar acceso por IP cuando sea posible
8. ✅ Monitorear actividad sospechosa

### DON'T (No hacer)
1. ❌ Exponer credenciales en código
2. ❌ Usar contraseñas débiles
3. ❌ Ignorar actualizaciones de seguridad
4. ❌ Confiar solo en una capa de seguridad
5. ❌ Dejar directorios sin protección
6. ❌ Usar HTTP en producción
7. ❌ Compartir credenciales
8. ❌ Ignorar logs y alertas

---

## 📞 Recursos y Contactos

### Documentación
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Mozilla Web Security: https://infosec.mozilla.org/guidelines/web_security
- Supabase Security: https://supabase.com/docs/guides/platform/security

### Herramientas
- Cloudflare (CDN + Security): https://cloudflare.com
- Sucuri (WAF): https://sucuri.net
- Wordfence (si usas WordPress)

### Soporte
- Supabase Support: https://supabase.com/support
- Stack Overflow: https://stackoverflow.com

---

## 📝 Resumen de Archivos

### Archivos de Seguridad Creados
1. `/.htaccess` - Configuración raíz (seguridad + rendimiento + SEO)
2. `/admin/.htaccess` - Protección específica del admin
3. `/SEGURIDAD_COMPLETA.md` - Este documento

### Archivos Modificados
1. `/index.html` - Headers de seguridad añadidos
2. `/carta.html` - Headers de seguridad añadidos
3. `/robots.txt` - Versión segura (sin revelar estructura)

### Archivos SEO
1. `/sitemap.xml` - Mapa del sitio
2. `/ESTRATEGIA_SEO.md` - Plan completo de SEO
3. `/GUIA_ROBOTS_TXT.md` - Guía de robots.txt

---

**Estado Actual:** ✅ Seguridad Básica Implementada
**Próximo Paso:** Activar HTTPS y configurar en producción

**Última actualización:** 23 de Diciembre de 2025
