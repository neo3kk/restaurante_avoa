# 🔐 AUDITORÍA DE SEGURIDAD - RESTAURANTE AVOA
**Fecha:** 24 de Diciembre de 2024  
**Objetivo:** Preparar el proyecto para producción con máxima seguridad

---

## 📋 ÍNDICE
1. [Seguridad del Servidor](#1-seguridad-del-servidor)
2. [Protección de Datos](#2-protección-de-datos)
3. [Autenticación y Autorización](#3-autenticación-y-autorización)
4. [Protección Anti-Bot](#4-protección-anti-bot)
5. [Seguridad de Base de Datos](#5-seguridad-de-base-de-datos)
6. [Seguridad del Frontend](#6-seguridad-del-frontend)
7. [Monitoreo y Logging](#7-monitoreo-y-logging)

---

## 1. SEGURIDAD DEL SERVIDOR

### 1.1 Headers de Seguridad HTTP

**Archivo:** `.htaccess` o configuración del servidor

```apache
# ============================================
# HEADERS DE SEGURIDAD
# ============================================

<IfModule mod_headers.c>
    # Prevenir MIME type sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Protección contra clickjacking
    Header always set X-Frame-Options "SAMEORIGIN"
    
    # Activar filtro XSS del navegador
    Header always set X-XSS-Protection "1; mode=block"
    
    # Control de referrer
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Deshabilitar APIs peligrosas
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
    
    # Content Security Policy (CSP)
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self';"
    
    # Strict Transport Security (HSTS) - Solo en HTTPS
    # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>
```

**Checklist:**
- [ ] Headers configurados en el servidor
- [ ] CSP probado y funcional
- [ ] HSTS activado (solo después de configurar SSL)
- [ ] Headers verificados con https://securityheaders.com

---

### 1.2 Protección de Archivos Sensibles

```apache
# ============================================
# PROTECCIÓN DE ARCHIVOS
# ============================================

# Bloquear acceso a archivos de documentación y desarrollo
<FilesMatch "\.(md|sql|py|example|ps1|sh|bat|log|bak|old|txt)$">
    Require all denied
</FilesMatch>

# Proteger archivos de configuración
<Files "supabase-config.js">
    Require all denied
</Files>

<Files ".gitignore">
    Require all denied
</Files>

<Files ".htaccess">
    Require all denied
</Files>

# Bloquear acceso a carpetas ocultas
<DirectoryMatch "^\.|\/\.">
    Require all denied
</DirectoryMatch>

# Deshabilitar listado de directorios
Options -Indexes

# Prevenir acceso a archivos de backup
<FilesMatch "~$">
    Require all denied
</FilesMatch>
```

**Checklist:**
- [ ] Archivos `.md` bloqueados
- [ ] `supabase-config.js` inaccesible desde web
- [ ] Listado de directorios deshabilitado
- [ ] Archivos de backup protegidos

---

### 1.3 SSL/HTTPS

```apache
# ============================================
# REDIRECCIÓN HTTPS
# ============================================

# Forzar HTTPS (activar solo después de configurar SSL)
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

**Checklist:**
- [ ] Certificado SSL instalado
- [ ] Redirección HTTP → HTTPS configurada
- [ ] Certificado válido y no expirado
- [ ] Verificado con https://www.ssllabs.com/ssltest/

---

### 1.4 Protección del Panel Admin

**Archivo:** `admin/.htaccess`

```apache
# ============================================
# PROTECCIÓN ADICIONAL PARA ADMIN
# ============================================

# Bloquear acceso por IP (opcional)
# <RequireAll>
#     Require ip 192.168.1.0/24
#     Require ip 203.0.113.0/24
# </RequireAll>

# Protección adicional con autenticación HTTP
# AuthType Basic
# AuthName "Área Restringida"
# AuthUserFile /ruta/absoluta/.htpasswd
# Require valid-user

# Headers de seguridad adicionales
<IfModule mod_headers.c>
    Header always set X-Robots-Tag "noindex, nofollow"
    Header always set Cache-Control "no-store, no-cache, must-revalidate, max-age=0"
</IfModule>

# Bloquear acceso a archivos de test
<Files "login-test.html">
    Require all denied
</Files>
```

**Checklist:**
- [ ] `.htaccess` configurado en `/admin/`
- [ ] Considerar autenticación HTTP adicional
- [ ] Archivos de test bloqueados
- [ ] Panel admin no indexado por Google

---

## 2. PROTECCIÓN DE DATOS

### 2.1 Variables de Entorno

**NO incluir en el código:**
```javascript
// ❌ MAL - Credenciales en el código
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

**Usar variables de entorno:**
```javascript
// ✅ BIEN - Variables de entorno
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
```

**Checklist:**
- [ ] `supabase-config.js` en `.gitignore`
- [ ] Credenciales NO en el repositorio
- [ ] Variables de entorno configuradas en servidor
- [ ] Archivo `supabase-config.example.js` documentado

---

### 2.2 Política de Privacidad

**Archivo:** `privacidad.html`

**Checklist:**
- [ ] Política de privacidad actualizada
- [ ] Cumple con RGPD (Europa)
- [ ] Información sobre cookies
- [ ] Contacto para ejercer derechos (acceso, rectificación, supresión)
- [ ] Enlace visible en el footer

---

## 3. AUTENTICACIÓN Y AUTORIZACIÓN

### 3.1 Panel de Administración

**Archivo:** `js/admin-auth.js`

**Verificaciones de seguridad:**

```javascript
// Verificar implementación de:
// 1. Autenticación con Supabase Auth
// 2. Verificación de sesión en cada carga
// 3. Redirección si no está autenticado
// 4. Cierre de sesión seguro
// 5. Tokens de sesión seguros
```

**Checklist:**
- [ ] Autenticación implementada correctamente
- [ ] Sesiones expiran después de inactividad
- [ ] Logout limpia la sesión completamente
- [ ] No se puede acceder al admin sin login
- [ ] Contraseñas hasheadas (nunca en texto plano)

---

### 3.2 Supabase Row Level Security (RLS)

**Verificar en Supabase Dashboard:**

```sql
-- Política para tabla 'menu_items'
-- Solo lectura pública, escritura solo para admin
CREATE POLICY "Lectura pública del menú"
ON menu_items FOR SELECT
USING (true);

CREATE POLICY "Solo admin puede modificar menú"
ON menu_items FOR ALL
USING (auth.role() = 'authenticated');

-- Política para tabla 'reservations'
-- Solo admin puede leer/escribir
CREATE POLICY "Solo admin puede ver reservas"
ON reservations FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Inserción pública de reservas"
ON reservations FOR INSERT
WITH CHECK (true);
```

**Checklist:**
- [ ] RLS activado en todas las tablas
- [ ] Políticas de lectura configuradas
- [ ] Políticas de escritura configuradas
- [ ] Solo admin puede modificar datos sensibles
- [ ] Usuarios anónimos solo pueden insertar reservas

---

## 4. PROTECCIÓN ANTI-BOT

### 4.1 Google reCAPTCHA v3

**Archivo:** `recaptcha-config.js`

**Configuración para producción:**

1. **Actualizar dominios permitidos:**
   - Ir a https://www.google.com/recaptcha/admin
   - Añadir dominio de producción: `restauranteavoa.com`
   - Añadir `www.restauranteavoa.com` si aplica

2. **Verificar clave de sitio:**
```javascript
const RECAPTCHA_SITE_KEY = '6Lfy6TIsAAAAAAW7SBygtxkGDD2O3w7v1sb1yZ8-';
```

3. **Implementar verificación backend:**

**Archivo:** `supabase/functions/verify-recaptcha/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RECAPTCHA_SECRET_KEY = Deno.env.get('RECAPTCHA_SECRET_KEY');

serve(async (req) => {
  const { token } = await req.json();
  
  // Verificar token con Google
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
    }
  );
  
  const data = await response.json();
  
  // Score mínimo recomendado: 0.5
  if (data.success && data.score >= 0.5) {
    return new Response(JSON.stringify({ valid: true, score: data.score }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({ valid: false }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
});
```

**Checklist:**
- [ ] Dominio de producción añadido a reCAPTCHA
- [ ] Clave de sitio válida
- [ ] Edge Function de verificación implementada
- [ ] Score mínimo configurado (0.5 recomendado)
- [ ] Probado en producción

---

### 4.2 Rate Limiting

**Archivo:** `supabase-reservations.js`

**Verificar implementación:**

```javascript
const RATE_LIMIT = {
    maxAttempts: 3,        // Máximo 3 intentos
    windowMs: 15 * 60 * 1000  // En 15 minutos
};
```

**Checklist:**
- [ ] Rate limiting implementado
- [ ] Límite razonable (3-5 intentos por 15 min)
- [ ] Mensajes de error claros
- [ ] Almacenamiento en localStorage o cookies

---

## 5. SEGURIDAD DE BASE DE DATOS

### 5.1 Supabase Security Checklist

**En Supabase Dashboard:**

1. **Authentication:**
   - [ ] Email confirmation activado
   - [ ] Password mínimo 8 caracteres
   - [ ] Rate limiting en login activado
   - [ ] Solo dominios permitidos en CORS

2. **Database:**
   - [ ] RLS activado en todas las tablas
   - [ ] Políticas de seguridad configuradas
   - [ ] Backups automáticos activados
   - [ ] Logs de auditoría activados

3. **API:**
   - [ ] Solo `anon` key expuesta en frontend
   - [ ] `service_role` key NUNCA en frontend
   - [ ] CORS configurado correctamente
   - [ ] Rate limiting en API activado

4. **Storage (si se usa):**
   - [ ] Políticas de acceso configuradas
   - [ ] Tamaño máximo de archivos limitado
   - [ ] Tipos de archivo permitidos restringidos

---

### 5.2 SQL Injection Prevention

**Verificar que se usan consultas parametrizadas:**

```javascript
// ✅ BIEN - Consulta parametrizada
const { data } = await supabase
  .from('reservations')
  .select('*')
  .eq('email', userEmail);

// ❌ MAL - Concatenación de strings (vulnerable)
const query = `SELECT * FROM reservations WHERE email = '${userEmail}'`;
```

**Checklist:**
- [ ] Todas las consultas usan el cliente de Supabase
- [ ] No hay concatenación de strings en queries
- [ ] Validación de inputs en frontend
- [ ] Validación de inputs en backend (Edge Functions)

---

## 6. SEGURIDAD DEL FRONTEND

### 6.1 Validación de Formularios

**Archivo:** `supabase-reservations.js`

**Validaciones necesarias:**

```javascript
// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar teléfono
function validarTelefono(telefono) {
    const regex = /^[+]?[\d\s()-]{9,}$/;
    return regex.test(telefono);
}

// Sanitizar inputs
function sanitizarInput(input) {
    return input.trim().replace(/[<>]/g, '');
}

// Validar fecha (no en el pasado)
function validarFecha(fecha) {
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaSeleccionada >= hoy;
}
```

**Checklist:**
- [ ] Validación de email implementada
- [ ] Validación de teléfono implementada
- [ ] Sanitización de inputs
- [ ] Validación de fechas (no pasadas)
- [ ] Validación de número de personas (1-10)
- [ ] Mensajes de error claros

---

### 6.2 XSS Prevention

**Evitar:**
```javascript
// ❌ MAL - Vulnerable a XSS
element.innerHTML = userInput;
document.write(userInput);
eval(userInput);
```

**Usar:**
```javascript
// ✅ BIEN - Seguro
element.textContent = userInput;
element.setAttribute('data-value', userInput);
```

**Checklist:**
- [ ] No se usa `innerHTML` con datos de usuario
- [ ] No se usa `eval()` nunca
- [ ] Datos de usuario escapados antes de mostrar
- [ ] CSP configurado para prevenir scripts inline maliciosos

---

### 6.3 Secrets y API Keys

**Verificar que NO están expuestas:**

```javascript
// ❌ MAL - API keys en el código
const GOOGLE_MAPS_API_KEY = "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const STRIPE_PUBLIC_KEY = "pk_live_XXXXXXXXXXXXXXXXXXXXXXXX";
```

**Checklist:**
- [ ] `supabase-config.js` en `.gitignore`
- [ ] Solo `anon` key de Supabase en frontend
- [ ] API keys sensibles en variables de entorno
- [ ] Verificar con `git log` que no hay keys en historial

---

## 7. MONITOREO Y LOGGING

### 7.1 Error Tracking

**Implementar Sentry (opcional pero recomendado):**

```html
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: "https://xxxxx@xxxxx.ingest.sentry.io/xxxxx",
    environment: "production",
    tracesSampleRate: 0.1
  });
</script>
```

**Checklist:**
- [ ] Error tracking configurado
- [ ] Errores de JavaScript capturados
- [ ] Errores de red capturados
- [ ] Notificaciones de errores críticos

---

### 7.2 Analytics y Monitoreo

**Google Analytics (opcional):**

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'anonymize_ip': true  // RGPD compliance
  });
</script>
```

**Checklist:**
- [ ] Analytics configurado
- [ ] IP anonimizada (RGPD)
- [ ] Cookie consent implementado
- [ ] Eventos importantes trackeados (reservas, errores)

---

### 7.3 Logs de Seguridad

**Supabase Dashboard:**
- [ ] Logs de autenticación revisados
- [ ] Intentos de login fallidos monitoreados
- [ ] Queries sospechosas detectadas
- [ ] Alertas configuradas para actividad anómala

---

## 8. TESTING DE SEGURIDAD

### 8.1 Herramientas de Auditoría

**Ejecutar antes de producción:**

1. **Security Headers:**
   - https://securityheaders.com
   - Objetivo: A+ rating

2. **SSL Test:**
   - https://www.ssllabs.com/ssltest/
   - Objetivo: A rating

3. **Mozilla Observatory:**
   - https://observatory.mozilla.org
   - Objetivo: B+ o superior

4. **OWASP ZAP:**
   - Escaneo de vulnerabilidades
   - Pruebas de penetración básicas

**Checklist:**
- [ ] Security Headers: A+
- [ ] SSL Test: A
- [ ] Mozilla Observatory: B+
- [ ] OWASP ZAP: Sin vulnerabilidades críticas

---

### 8.2 Pruebas Manuales

**Checklist de pruebas:**

1. **Autenticación:**
   - [ ] No se puede acceder a `/admin/` sin login
   - [ ] Sesión expira correctamente
   - [ ] Logout funciona correctamente
   - [ ] No se pueden adivinar contraseñas (rate limiting)

2. **Formularios:**
   - [ ] Validación frontend funciona
   - [ ] Validación backend funciona
   - [ ] reCAPTCHA bloquea bots
   - [ ] Rate limiting previene spam

3. **Archivos:**
   - [ ] No se puede acceder a `.md` files
   - [ ] No se puede acceder a `supabase-config.js`
   - [ ] Listado de directorios deshabilitado
   - [ ] Archivos de backup inaccesibles

4. **Headers:**
   - [ ] CSP bloquea scripts maliciosos
   - [ ] X-Frame-Options previene clickjacking
   - [ ] HSTS fuerza HTTPS

---

## 9. CHECKLIST FINAL PRE-PRODUCCIÓN

### Configuración del Servidor
- [ ] SSL/HTTPS configurado y funcionando
- [ ] Headers de seguridad configurados
- [ ] `.htaccess` configurado correctamente
- [ ] Archivos sensibles protegidos
- [ ] Backups automáticos configurados

### Supabase
- [ ] RLS activado en todas las tablas
- [ ] Políticas de seguridad configuradas
- [ ] Variables de entorno configuradas
- [ ] `supabase-config.js` NO en repositorio
- [ ] Edge Functions desplegadas

### Frontend
- [ ] Validación de formularios implementada
- [ ] reCAPTCHA configurado para dominio de producción
- [ ] No hay API keys expuestas
- [ ] CSP configurado y probado
- [ ] Error tracking configurado

### Testing
- [ ] Security Headers: A+
- [ ] SSL Test: A
- [ ] Pruebas manuales completadas
- [ ] Formulario de reservas probado
- [ ] Panel admin probado
- [ ] Probado en múltiples navegadores

### Documentación
- [ ] Política de privacidad actualizada
- [ ] Documentación de configuración actualizada
- [ ] Credenciales guardadas de forma segura
- [ ] Plan de respuesta a incidentes documentado

---

## 🚨 PLAN DE RESPUESTA A INCIDENTES

### En caso de brecha de seguridad:

1. **Contención inmediata:**
   - Desactivar el sitio temporalmente
   - Cambiar todas las credenciales
   - Revisar logs de acceso

2. **Investigación:**
   - Identificar el vector de ataque
   - Determinar datos comprometidos
   - Documentar el incidente

3. **Notificación:**
   - Notificar a usuarios afectados (si aplica)
   - Cumplir con RGPD (72 horas para notificar)
   - Contactar a autoridades si es necesario

4. **Remediación:**
   - Parchear vulnerabilidad
   - Actualizar sistemas
   - Mejorar medidas de seguridad

5. **Prevención:**
   - Revisar y actualizar políticas
   - Capacitación del equipo
   - Auditorías regulares

---

## 📞 CONTACTOS DE EMERGENCIA

**Supabase Support:**
- Email: support@supabase.io
- Dashboard: https://app.supabase.com

**Google reCAPTCHA:**
- Support: https://support.google.com/recaptcha

**Hosting Provider:**
- [Añadir contacto del proveedor de hosting]

---

**Última actualización:** 24/12/2024  
**Próxima revisión:** [Programar auditoría trimestral]
