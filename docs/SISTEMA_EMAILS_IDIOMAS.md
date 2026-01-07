# 📧 Sistema de Emails de Reservas - Configuración de Idiomas

## 🌍 Idiomas Soportados

El sistema soporta **3 idiomas**:
- 🇪🇸 **Español (es)**
- 🇪🇸 **Catalán (ca)**
- 🇬🇧 **Inglés (en)**

---

## 📨 Tipos de Emails

### 1️⃣ **Email al Cliente - "Reserva Recibida"**
- **Destinatario**: Cliente que hizo la reserva
- **Idioma**: El idioma que seleccionó el cliente en la web
- **Cuándo se envía**: Inmediatamente después de crear la reserva
- **Contenido**: 
  - Confirmación de recepción
  - Detalles de la reserva
  - Estado: "Pendiente de confirmación"

### 2️⃣ **Email al Restaurante - "Notificación"**
- **Destinatario**: `reservas@restauranteavoa.com`
- **Idioma**: ⭐ **SIEMPRE EN ESPAÑOL** (independiente del idioma del cliente)
- **Cuándo se envía**: Inmediatamente después de crear la reserva
- **Contenido**:
  - Nueva reserva pendiente
  - Datos del cliente (nombre, email, teléfono)
  - Detalles de la reserva
  - Enlace al panel de administración

### 3️⃣ **Email al Cliente - "Reserva Confirmada"**
- **Destinatario**: Cliente
- **Idioma**: El idioma del cliente
- **Cuándo se envía**: Cuando el restaurante confirma la reserva desde el panel admin
- **Contenido**:
  - Confirmación oficial
  - Detalles finales
  - Estado: "Confirmada"

### 4️⃣ **Email de Recordatorio** (Opcional)
- **Destinatario**: Cliente
- **Idioma**: El idioma del cliente
- **Cuándo se envía**: 24h antes de la reserva (si está configurado)

### 5️⃣ **Email de Cancelación** (Opcional)
- **Destinatario**: Cliente
- **Idioma**: El idioma del cliente
- **Cuándo se envía**: Cuando se cancela una reserva

---

## 🔧 Configuración Técnica

### Lógica de Idiomas (Actualizada)

```typescript
// Determinar idioma del email según el tipo
const idiomaEmail = tipo === 'notificacion' ? 'es' : reservaData.idioma

// Resultado:
// - tipo === 'notificacion' → Siempre español ('es')
// - tipo === 'recibida' → Idioma del cliente
// - tipo === 'confirmada' → Idioma del cliente
// - tipo === 'recordatorio' → Idioma del cliente
// - tipo === 'cancelacion' → Idioma del cliente
```

### Ejemplo de Flujo

#### Caso 1: Cliente reserva en Inglés
1. **Cliente recibe**: Email en **inglés** ✅
2. **Restaurante recibe**: Email en **español** ✅

#### Caso 2: Cliente reserva en Catalán
1. **Cliente recibe**: Email en **catalán** ✅
2. **Restaurante recibe**: Email en **español** ✅

#### Caso 3: Cliente reserva en Español
1. **Cliente recibe**: Email en **español** ✅
2. **Restaurante recibe**: Email en **español** ✅

---

## 📋 Plantillas de Email

### Estructura de las Plantillas

Cada idioma tiene sus propias traducciones en el archivo `index.ts`:

```typescript
const translations = {
    es: {
        recibida_subject: '📝 Reserva recibida - Restaurante Avoa',
        confirmada_subject: '✅ Reserva confirmada - Restaurante Avoa',
        notificacion_subject: '🔔 Nueva reserva pendiente de confirmar',
        // ... más traducciones
    },
    ca: {
        recibida_subject: '📝 Reserva rebuda - Restaurante Avoa',
        // ... traducciones en catalán
    },
    en: {
        recibida_subject: '📝 Reservation received - Restaurante Avoa',
        // ... traducciones en inglés
    }
}
```

---

## 🎨 Personalización de Emails

### Elementos Personalizables

Todos los emails incluyen:
- ✅ Logo del restaurante (ΛVOΛ)
- ✅ Colores corporativos (#2c5f8d)
- ✅ Diseño responsive (móvil y desktop)
- ✅ Información de contacto
- ✅ Dirección del restaurante

### Email al Restaurante (Notificación)

Incluye además:
- 📊 Datos completos del cliente
- 🔗 Botón directo al panel de administración
- ⚡ Llamada a la acción: "Confirmar o rechazar"

---

## 🚀 Despliegue

### Actualizar la Edge Function

Después de modificar el código, debes desplegarlo:

```bash
# Desde la raíz del proyecto
supabase functions deploy send-reservation-email
```

### Verificar Variables de Entorno

Asegúrate de que estén configuradas en Supabase:

```bash
RESEND_API_KEY=tu_clave_aqui
EMAIL_PROVIDER=resend
SUPABASE_URL=tu_url_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_clave_aqui
```

---

## 🧪 Pruebas

### Probar Emails en Diferentes Idiomas

1. **Español**: Cambia el idioma a ES en la web y haz una reserva
2. **Catalán**: Cambia el idioma a CA en la web y haz una reserva
3. **Inglés**: Cambia el idioma a EN en la web y haz una reserva

### Verificar que Funciona

- [ ] Cliente recibe email en su idioma
- [ ] Restaurante recibe email en español (siempre)
- [ ] Asuntos están en el idioma correcto
- [ ] Contenido está traducido correctamente
- [ ] Enlaces funcionan correctamente

---

## 📊 Logs de Emails

Todos los emails se registran en la tabla `email_logs`:

```sql
SELECT 
    tipo,
    destinatario,
    asunto,
    enviado,
    created_at
FROM email_logs
ORDER BY created_at DESC;
```

---

## ⚠️ Notas Importantes

### Email del Restaurante

El email de notificación **siempre se envía a**:
```
reservas@restauranteavoa.com
```

Si necesitas cambiar este email, modifica la línea 354 en `index.ts`:

```typescript
to = 'reservas@restauranteavoa.com'  // ← Cambiar aquí
```

### Idioma por Defecto

Si por alguna razón no se detecta el idioma del cliente, se usa **español** como fallback:

```typescript
const t = translations[idioma as keyof typeof translations] || translations.es
```

---

## 🔄 Cambios Recientes

### 2026-01-07
- ✅ **Modificado**: Emails de notificación al restaurante ahora siempre en español
- ✅ **Mejorado**: Comentarios más claros en el código
- ✅ **Limpiado**: Eliminados comentarios temporales de prueba

---

## 📞 Soporte

Si necesitas modificar:
- **Traducciones**: Edita el objeto `translations` en `index.ts`
- **Diseño de emails**: Modifica la función `getEmailTemplate()`
- **Destinatarios**: Modifica las líneas 354-360 en `index.ts`

---

**Última actualización**: 2026-01-07
