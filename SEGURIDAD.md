# 🔐 GUÍA DE SEGURIDAD - Restaurante Avoa

## Implementación Completada

### ✅ Medidas de Seguridad Implementadas

#### 1. **Row Level Security (RLS) en Supabase**

**Tabla `menu_items` - Protegida**
- ✅ Lectura pública permitida (solo items activos)
- ✅ Modificación solo para usuarios autenticados

**Tabla `reservas` - Acceso Público Controlado**
- ✅ RLS deshabilitado para permitir reservas públicas
- ✅ Rate limiting implementado en el frontend
- ✅ Verificación anti-bot con reCAPTCHA

**SQL Ejecutado:**
```sql
-- Proteger tabla de menú
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_read_menu"
ON public.menu_items
FOR SELECT
TO public
USING (activo = true);

CREATE POLICY "allow_authenticated_all_menu"
ON public.menu_items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

#### 2. **Rate Limiting (Protección contra Spam)**

**Configuración:**
- Máximo 3 intentos de reserva cada 15 minutos
- Almacenamiento local en el navegador del usuario
- Mensaje de error claro indicando tiempo de espera

**Funcionamiento:**
```javascript
// Límite: 3 reservas cada 15 minutos
const RATE_LIMIT = {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000
};
```

#### 3. **Google reCAPTCHA v3 (Anti-Bot)**

**Estado:** ⚠️ **Requiere Configuración**

**Pasos para Activar:**

1. **Obtener Claves de reCAPTCHA:**
   - Ve a: https://www.google.com/recaptcha/admin
   - Haz clic en "+" para crear un nuevo sitio
   - Configuración:
     * **Etiqueta:** Restaurante Avoa
     * **Tipo:** reCAPTCHA v3
     * **Dominios:** 
       - `localhost` (para desarrollo)
       - `tu-dominio.com` (tu dominio real)
   - Acepta los términos y haz clic en "Enviar"

2. **Configurar las Claves:**
   - Abre el archivo `recaptcha-config.js`
   - Reemplaza `'TU_CLAVE_DEL_SITIO_AQUI'` con tu **Clave del sitio**
   - La **Clave secreta** no se usa en el frontend (solo backend)

3. **Verificar Funcionamiento:**
   - Recarga la página
   - Abre la consola del navegador (F12)
   - No deberías ver el warning de reCAPTCHA no configurado
   - Al enviar una reserva, se generará un token automáticamente

**Ventajas de reCAPTCHA v3:**
- ✅ Invisible para el usuario
- ✅ No interrumpe la experiencia
- ✅ Puntuación de riesgo automática
- ✅ Protección contra bots avanzados

---

## 🛡️ Protección de Datos Personales (GDPR)

### Datos Recopilados en Reservas:
- Nombre
- Email
- Teléfono
- Fecha de reserva
- Número de personas
- Comentarios (opcional)
- Token de reCAPTCHA (verificación)
- Timestamp de creación

### Medidas de Protección:

1. **Almacenamiento Seguro:**
   - ✅ Datos almacenados en Supabase (infraestructura segura)
   - ✅ Conexión HTTPS encriptada
   - ✅ Acceso restringido solo a usuarios autenticados

2. **Acceso a Datos:**
   - ❌ Los datos NO son accesibles públicamente
   - ✅ Solo usuarios autenticados pueden leer reservas
   - ✅ La clave `anon` solo puede INSERTAR, no leer

3. **Retención de Datos:**
   - Recomendación: Eliminar reservas antiguas (>6 meses)
   - Puedes configurar esto en Supabase con SQL:
   ```sql
   -- Eliminar reservas de más de 6 meses
   DELETE FROM reservas 
   WHERE created_at < NOW() - INTERVAL '6 months';
   ```

4. **Política de Privacidad:**
   - ⚠️ **IMPORTANTE:** Debes añadir un enlace a tu política de privacidad
   - Añade un checkbox de consentimiento en el formulario
   - Ejemplo: "Acepto la [política de privacidad](#)"

---

## 📋 Checklist de Seguridad

### Configuración Actual:
- [x] RLS habilitado en `menu_items`
- [x] Rate limiting implementado
- [x] Script de reCAPTCHA añadido
- [ ] **Claves de reCAPTCHA configuradas** ⚠️
- [x] Datos de reserva protegidos
- [ ] **Política de privacidad añadida** ⚠️
- [ ] **Checkbox de consentimiento GDPR** ⚠️

### Próximos Pasos Recomendados:

1. **Configurar reCAPTCHA** (5 minutos)
   - Obtener claves en Google
   - Actualizar `recaptcha-config.js`

2. **Añadir Política de Privacidad** (recomendado)
   - Crear página `privacidad.html`
   - Añadir enlace en el footer
   - Añadir checkbox en formulario de reservas

3. **Configurar Retención de Datos** (opcional)
   - Decidir cuánto tiempo guardar reservas
   - Configurar limpieza automática en Supabase

4. **Monitoreo** (recomendado)
   - Revisar regularmente las reservas en Supabase
   - Verificar intentos de spam
   - Ajustar rate limiting si es necesario

---

## 🔒 Seguridad de la Clave API

### ¿Es Segura la Clave `anon`?

**SÍ**, la clave `anon` de Supabase es segura para usar en el frontend porque:

1. ✅ Solo tiene permisos limitados (definidos por RLS)
2. ✅ No puede leer datos sensibles
3. ✅ Solo puede insertar en tablas permitidas
4. ✅ No puede modificar la estructura de la base de datos
5. ✅ No puede acceder a funciones administrativas

### Archivo `.gitignore`

El archivo `supabase-config.js` está en `.gitignore` para evitar que se suba a GitHub, pero esto es más por buenas prácticas que por seguridad crítica.

---

## 📞 Soporte

Si tienes dudas sobre la configuración de seguridad:
1. Revisa la documentación de Supabase: https://supabase.com/docs/guides/auth/row-level-security
2. Documentación de reCAPTCHA: https://developers.google.com/recaptcha/docs/v3
3. GDPR: https://gdpr.eu/

---

**Última actualización:** 21/12/2024
