# 📧 GUÍA DE IMPLEMENTACIÓN - NOTIFICACIONES POR EMAIL

**Fecha:** 29 de Diciembre de 2024  
**Versión:** 1.0  
**Estado:** ✅ Implementado - Pendiente de configuración

---

## 📋 ÍNDICE

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Configuración Paso a Paso](#configuración-paso-a-paso)
4. [Tipos de Emails](#tipos-de-emails)
5. [Testing y Verificación](#testing-y-verificación)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 DESCRIPCIÓN GENERAL

El sistema de notificaciones por email envía automáticamente correos electrónicos cuando:

- ✅ **Cliente hace una reserva** → Email de confirmación al cliente
- ✅ **Cliente hace una reserva** → Notificación al restaurante
- ✅ **Cliente confirma reserva** → Email de confirmación actualizado
- ✅ **24h antes de reserva** → Recordatorio automático
- ✅ **Reserva cancelada** → Email de cancelación

### **Características:**

- 🌐 **Multiidioma:** Emails en ES, CA, EN según preferencia del cliente
- 🎨 **HTML Responsive:** Plantillas profesionales adaptadas a móvil
- 🔒 **Seguro:** Tokens únicos de confirmación
- 📊 **Tracking:** Registro de todos los emails enviados
- ⚡ **Rápido:** Edge Functions de Supabase

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────┐
│  Cliente hace   │
│    reserva      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Supabase DB    │
│  (reservas)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Edge Function  │
│ send-reservation│
│     -email      │
└────────┬────────┘
         │
         ├──────────────┬──────────────┐
         ▼              ▼              ▼
    ┌────────┐    ┌────────┐    ┌────────┐
    │ Resend │ o  │ Brevo  │    │email   │
    │  API   │    │  API   │    │_logs   │
    └────────┘    └────────┘    └────────┘
         │              │
         └──────┬───────┘
                ▼
         ┌────────────┐
         │   Cliente  │
         │ Restaurante│
         └────────────┘
```

---

## ⚙️ CONFIGURACIÓN PASO A PASO

### **OPCIÓN 1: RESEND (Recomendado) ⭐**

#### **Paso 1: Crear cuenta en Resend**

1. Ve a: https://resend.com
2. Haz clic en "Sign Up"
3. Regístrate con tu email
4. Verifica tu email

#### **Paso 2: Obtener API Key**

1. En el dashboard, ve a "API Keys"
2. Haz clic en "Create API Key"
3. Nombre: "Restaurante Avoa - Producción"
4. Permisos: "Sending access"
5. **Copia la API Key** (solo se muestra una vez)

#### **Paso 3: Verificar dominio (Opcional pero recomendado)**

1. Ve a "Domains"
2. Haz clic en "Add Domain"
3. Ingresa: `restauranteavoa.com`
4. Sigue las instrucciones para agregar registros DNS:
   - **SPF:** `v=spf1 include:_spf.resend.com ~all`
   - **DKIM:** (Te darán el registro específico)
   - **DMARC:** `v=DMARC1; p=none;`

**Nota:** Sin verificar el dominio, puedes enviar emails pero aparecerán como "via resend.com"

#### **Paso 4: Configurar en Supabase**

1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. Ve a "Project Settings" → "Edge Functions" → "Secrets"
3. Agrega las siguientes variables:

```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_tu_api_key_aqui
```

---

### **OPCIÓN 2: BREVO (Alternativa)**

#### **Paso 1: Crear cuenta en Brevo**

1. Ve a: https://www.brevo.com/es/
2. Regístrate con tu email
3. Completa tu perfil:
   - Tipo de negocio: Restaurante
   - País: España
   - Teléfono: +34 659 02 13 02

#### **Paso 2: Obtener API Key**

1. Ve a "Settings" (Configuración)
2. Selecciona "SMTP & API"
3. Haz clic en "Create a new API key"
4. Nombre: "Restaurante Avoa - Reservas"
5. **Copia la API Key**

#### **Paso 3: Verificar remitente**

1. Ve a "Senders & IP"
2. Añade: `reservas@restauranteavoa.com`
3. Verifica el email

#### **Paso 4: Configurar en Supabase**

```bash
EMAIL_PROVIDER=brevo
BREVO_API_KEY=tu_api_key_aqui
```

---

### **Paso 5: Desplegar Edge Function**

#### **Instalar Supabase CLI (si no lo tienes)**

```bash
# Windows (PowerShell)
scoop install supabase

# O descarga desde: https://github.com/supabase/cli/releases
```

#### **Login en Supabase**

```bash
supabase login
```

#### **Desplegar la función**

```bash
# Navegar al directorio del proyecto
cd c:\Users\neo3k\Desktop\restaurante_avoa

# Desplegar la función
supabase functions deploy send-reservation-email --project-ref TU_PROJECT_REF
```

**Nota:** Encuentra tu `PROJECT_REF` en: Settings → General → Reference ID

---

## 📨 TIPOS DE EMAILS

### **1. Email de Confirmación (al cliente)**

**Cuándo:** Inmediatamente después de hacer la reserva  
**Destinatario:** Email del cliente  
**Contenido:**
- Saludo personalizado
- Detalles de la reserva (fecha, hora, personas)
- **Botón de confirmación** con enlace único
- Información de contacto del restaurante

**Ejemplo:**
```
Asunto: ✅ Confirma tu reserva - Restaurante Avoa

Hola Juan,

Gracias por tu reserva en Restaurante Avoa.

Detalles de tu reserva:
- Fecha: Viernes, 5 de enero de 2024
- Hora: 20:30
- Personas: 4

[Botón: Confirmar Reserva]

Si tienes alguna pregunta, contáctanos:
📞 +34 659 02 13 02
📧 reservas@restauranteavoa.com
```

---

### **2. Email de Notificación (al restaurante)**

**Cuándo:** Inmediatamente después de hacer la reserva  
**Destinatario:** `reservas@restauranteavoa.com`  
**Contenido:**
- Alerta de nueva reserva
- Todos los detalles (nombre, email, teléfono, fecha, hora, personas, comentarios)
- Estado: Pendiente de confirmación

---

### **3. Email de Recordatorio**

**Cuándo:** 24 horas antes de la reserva  
**Destinatario:** Email del cliente  
**Contenido:**
- Recordatorio amigable
- Detalles de la reserva
- Información de contacto por si necesita modificar

**Nota:** Se envía automáticamente mediante un cron job (ver sección de automatización)

---

### **4. Email de Cancelación**

**Cuándo:** Cuando se cancela una reserva desde el panel admin  
**Destinatario:** Email del cliente  
**Contenido:**
- Confirmación de cancelación
- Invitación a hacer una nueva reserva

---

## 🧪 TESTING Y VERIFICACIÓN

### **Paso 1: Probar localmente**

```bash
# Iniciar servidor local
python -m http.server 8000

# Abrir en navegador
http://localhost:8000
```

### **Paso 2: Hacer una reserva de prueba**

1. Completa el formulario de reserva
2. Usa tu email personal
3. Verifica que:
   - ✅ La reserva se guarda en Supabase
   - ✅ Recibes email de confirmación
   - ✅ El restaurante recibe notificación

### **Paso 3: Verificar logs**

```sql
-- En Supabase SQL Editor
SELECT * FROM email_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

Deberías ver:
- `enviado = true`
- `error = null`
- `resend_id` o `messageId` con valor

### **Paso 4: Probar confirmación**

1. Abre el email recibido
2. Haz clic en "Confirmar Reserva"
3. Verifica que te redirige a `confirmar.html`
4. Verifica que muestra "¡Reserva Confirmada!"
5. En Supabase, verifica que `estado = 'confirmada'`

---

## 🔄 AUTOMATIZACIÓN DE RECORDATORIOS

Para enviar recordatorios automáticos 24h antes, necesitas configurar un cron job.

### **Opción 1: GitHub Actions (Gratis)**

Crea `.github/workflows/send-reminders.yml`:

```yaml
name: Send Reservation Reminders

on:
  schedule:
    # Ejecutar cada hora
    - cron: '0 * * * *'
  workflow_dispatch: # Permitir ejecución manual

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Send reminders
        run: |
          curl -X POST \
            'https://TU_PROJECT_REF.supabase.co/functions/v1/send-reminders' \
            -H 'Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}'
```

### **Opción 2: Supabase Cron (Requiere plan Pro)**

```sql
-- Crear función de recordatorios
CREATE OR REPLACE FUNCTION enviar_recordatorios()
RETURNS void AS $$
DECLARE
    reserva RECORD;
BEGIN
    FOR reserva IN 
        SELECT * FROM get_reservas_para_recordatorio()
    LOOP
        -- Llamar a Edge Function
        PERFORM net.http_post(
            url := 'https://TU_PROJECT_REF.supabase.co/functions/v1/send-reservation-email',
            body := json_build_object(
                'reservaId', reserva.id,
                'tipo', 'recordatorio'
            )::text
        );
        
        -- Marcar como enviado
        UPDATE reservas 
        SET recordatorio_enviado = true 
        WHERE id = reserva.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Programar ejecución cada hora
SELECT cron.schedule(
    'send-reservation-reminders',
    '0 * * * *', -- Cada hora
    'SELECT enviar_recordatorios();'
);
```

---

## 🐛 TROUBLESHOOTING

### **Problema: No se envían emails**

**Solución:**
1. Verifica que la Edge Function está desplegada:
   ```bash
   supabase functions list
   ```

2. Verifica las variables de entorno en Supabase:
   - `EMAIL_PROVIDER`
   - `RESEND_API_KEY` o `BREVO_API_KEY`

3. Revisa los logs de la función:
   ```bash
   supabase functions logs send-reservation-email
   ```

4. Verifica la tabla `email_logs`:
   ```sql
   SELECT * FROM email_logs WHERE enviado = false;
   ```

---

### **Problema: Emails van a spam**

**Solución:**
1. **Verifica tu dominio** en Resend/Brevo
2. Configura registros DNS (SPF, DKIM, DMARC)
3. Usa un dominio verificado como remitente
4. Evita palabras spam en el asunto

---

### **Problema: Error "RESEND_API_KEY no configurada"**

**Solución:**
1. Ve a Supabase → Project Settings → Edge Functions → Secrets
2. Agrega la variable `RESEND_API_KEY`
3. Vuelve a desplegar la función:
   ```bash
   supabase functions deploy send-reservation-email
   ```

---

### **Problema: Confirmación no funciona**

**Solución:**
1. Verifica que la función `confirmar_reserva()` existe en Supabase:
   ```sql
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_name = 'confirmar_reserva';
   ```

2. Si no existe, ejecuta `supabase/paso5_funciones.sql`

3. Verifica que el token es correcto:
   ```sql
   SELECT * FROM reservas WHERE token_confirmacion = 'TOKEN_AQUI';
   ```

---

## 📊 MONITOREO Y ESTADÍSTICAS

### **Ver emails enviados hoy**

```sql
SELECT 
    tipo,
    COUNT(*) as total,
    SUM(CASE WHEN enviado THEN 1 ELSE 0 END) as exitosos,
    SUM(CASE WHEN NOT enviado THEN 1 ELSE 0 END) as fallidos
FROM email_logs
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY tipo;
```

### **Ver tasa de confirmación**

```sql
SELECT 
    COUNT(*) as total_reservas,
    SUM(CASE WHEN estado = 'confirmada' THEN 1 ELSE 0 END) as confirmadas,
    ROUND(
        SUM(CASE WHEN estado = 'confirmada' THEN 1 ELSE 0 END)::NUMERIC / 
        COUNT(*)::NUMERIC * 100, 
        2
    ) as tasa_confirmacion
FROM reservas
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Cuenta creada en Resend o Brevo
- [ ] API Key obtenida
- [ ] Variables de entorno configuradas en Supabase
- [ ] Edge Function desplegada
- [ ] Prueba de envío realizada
- [ ] Email de confirmación recibido
- [ ] Confirmación de reserva probada
- [ ] Logs verificados en `email_logs`
- [ ] Dominio verificado (opcional)
- [ ] Recordatorios automáticos configurados (opcional)

---

## 📞 SOPORTE

### **Documentación de APIs:**
- **Resend:** https://resend.com/docs
- **Brevo:** https://developers.brevo.com/docs
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions

### **Límites gratuitos:**
- **Resend:** 100 emails/día (3,000/mes)
- **Brevo:** 300 emails/día (9,000/mes)

---

## 🎯 PRÓXIMOS PASOS

1. **Configurar cuenta de email** (Resend o Brevo)
2. **Obtener API Key**
3. **Configurar variables en Supabase**
4. **Desplegar Edge Function**
5. **Probar con reserva real**
6. **Configurar recordatorios automáticos**
7. **Monitorear logs**

---

**Implementado por:** Antigravity AI  
**Fecha:** 29 de Diciembre de 2024  
**Versión:** 1.0
