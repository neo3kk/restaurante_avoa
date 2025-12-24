# 🚀 GUÍA DE CONFIGURACIÓN - PASO A PASO

**Fecha:** 21 de diciembre de 2024

---

## ✅ COMPLETADO

- [x] Paso 1: Actualizar tabla reservas
- [x] Paso 2: Crear tabla email_logs
- [x] Paso 3: Crear tabla configuracion

---

## 🔄 PENDIENTE - EJECUTAR EN SUPABASE

### Paso 4: Configurar Row Level Security (RLS)
**Archivo:** `supabase/paso4_rls.sql`

**Qué hace:**
- Habilita seguridad en las tablas
- Configura permisos de lectura/escritura
- Protege datos sensibles

**Instrucciones:**
1. Abre Supabase SQL Editor
2. Copia y pega el contenido de `paso4_rls.sql`
3. Haz clic en "Run"

---

### Paso 5: Crear Funciones Útiles
**Archivo:** `supabase/paso5_funciones.sql`

**Qué hace:**
- `generate_confirmation_token()` - Genera tokens únicos
- `get_reservas_para_recordatorio()` - Obtiene reservas para recordar
- `get_dashboard_stats()` - Estadísticas del dashboard
- `confirmar_reserva()` - Confirma una reserva por token

**Instrucciones:**
1. Abre Supabase SQL Editor
2. Copia y pega el contenido de `paso5_funciones.sql`
3. Haz clic en "Run"

---

### Paso 6: Crear Triggers Automáticos
**Archivo:** `supabase/paso6_triggers.sql`

**Qué hace:**
- Genera automáticamente tokens de confirmación al crear reservas

**Instrucciones:**
1. Abre Supabase SQL Editor
2. Copia y pega el contenido de `paso6_triggers.sql`
3. Haz clic en "Run"

---

## 📧 CONFIGURACIÓN DE BREVO

### Registro en Brevo (5 minutos)

1. **Ve a:** https://www.brevo.com/es/

2. **Regístrate:**
   - Email: reservas@restauranteavoa.com (o tu email personal)
   - Nombre del negocio: Restaurante Avoa
   - Contraseña segura

3. **Verifica tu email:**
   - Revisa tu bandeja de entrada
   - Haz clic en el enlace de verificación

4. **Completa tu perfil:**
   - Tipo de negocio: Restaurante
   - País: España
   - Teléfono: +34 659 02 13 02

5. **Obtén tu API Key:**
   - Ve a "Settings" (Configuración)
   - Selecciona "SMTP & API"
   - Haz clic en "Create a new API key"
   - Nombre: "Restaurante Avoa - Reservas"
   - Copia la API Key (la necesitaremos después)

6. **Verifica tu dominio (Opcional pero recomendado):**
   - Ve a "Senders & IP"
   - Añade: reservas@restauranteavoa.com
   - Verifica el email

---

## 📋 INFORMACIÓN CONFIGURADA

### Horarios del Restaurante:
- **Lunes y Martes:** 13:30 - 16:30
- **Miércoles a Sábado:** 13:30 - 16:30 | 20:00 - 23:30
- **Domingo:** Cerrado

### Email:
- **Restaurante:** reservas@restauranteavoa.com
- **Admin:** reservas@restauranteavoa.com

### Capacidad:
- **Validación:** Desactivada (preparada para el futuro)
- **Máximo por reserva:** Sin límite (por ahora)
- **Mínimo por reserva:** 1 persona

### Recordatorios:
- **Enviar:** 24 horas antes de la reserva
- **Estado:** Activado

---

## 🎯 PRÓXIMOS PASOS

Una vez completados los pasos 4, 5 y 6, y tengas la API Key de Brevo:

1. **Crear Sistema de Autenticación**
   - Login para administradores
   - Protección de rutas

2. **Crear Panel de Administración**
   - Dashboard con estadísticas
   - Gestión de reservas
   - Gestión del menú

3. **Implementar Sistema de Emails**
   - Confirmación de reservas
   - Notificaciones al restaurante
   - Recordatorios automáticos

---

## ⏱️ Tiempo Estimado

- Ejecutar Pasos 4-6: **5 minutos**
- Registro en Brevo: **5 minutos**
- **Total:** 10 minutos

---

## ❓ ¿Necesitas Ayuda?

Si tienes algún error al ejecutar los scripts SQL:
1. Copia el mensaje de error completo
2. Dime en qué paso estás
3. Te ayudaré a solucionarlo

---

**Estado actual:** ✅ Base de datos configurada (pasos 1-3)  
**Siguiente:** Ejecutar pasos 4-6 y registrarse en Brevo
