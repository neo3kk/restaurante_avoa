# 📋 PLAN DE IMPLEMENTACIÓN - PANEL DE ADMINISTRACIÓN

**Fecha:** 21 de diciembre de 2024  
**Estado:** En desarrollo

---

## 🎯 Funcionalidades a Implementar

1. ✅ **Panel de Administración** - Gestionar reservas y menú
2. ✅ **Notificaciones por Email** - Confirmaciones automáticas
3. ✅ **Sistema de Confirmación** - Confirmar reservas por email
4. ✅ **Gestión del Menú** - Panel para actualizar platos
5. ✅ **Recordatorios** - Email 24h antes de la reserva

---

## 📊 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
├─────────────────────────────────────────────────────────┤
│  index.html          │  Página pública del restaurante  │
│  admin.html          │  Panel de administración         │
│  login.html          │  Login para administradores      │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE                              │
├─────────────────────────────────────────────────────────┤
│  Tablas:                                                 │
│  - reservas          │  Gestión de reservas             │
│  - menu_items        │  Gestión del menú                │
│  - admin_users       │  Usuarios administradores        │
│  - email_logs        │  Registro de emails enviados     │
│                                                          │
│  Edge Functions:                                         │
│  - send-confirmation │  Enviar email de confirmación    │
│  - send-reminder     │  Enviar recordatorio 24h antes   │
│  - verify-token      │  Verificar token de confirmación │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                 SERVICIO DE EMAIL                        │
├─────────────────────────────────────────────────────────┤
│  Resend API          │  Envío de emails transaccionales │
│  - Confirmaciones    │  Al hacer reserva                │
│  - Recordatorios     │  24h antes de la reserva         │
│  - Notificaciones    │  Al restaurante (nueva reserva)  │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Estructura de Base de Datos

### Tabla: `reservas` (actualizada)

```sql
CREATE TABLE IF NOT EXISTS public.reservas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,  -- NUEVO
    personas INTEGER NOT NULL,
    comentarios TEXT,
    recaptcha_token TEXT,
    estado TEXT DEFAULT 'pendiente',  -- NUEVO: pendiente, confirmada, cancelada
    token_confirmacion TEXT,  -- NUEVO: para confirmar por email
    confirmada_en TIMESTAMP,  -- NUEVO: cuándo se confirmó
    recordatorio_enviado BOOLEAN DEFAULT false,  -- NUEVO
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: `admin_users` (nueva)

```sql
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nombre TEXT NOT NULL,
    rol TEXT DEFAULT 'admin',  -- admin, super_admin
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: `email_logs` (nueva)

```sql
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID REFERENCES public.reservas(id),
    tipo TEXT NOT NULL,  -- confirmacion, recordatorio, notificacion
    destinatario TEXT NOT NULL,
    asunto TEXT NOT NULL,
    enviado BOOLEAN DEFAULT false,
    error TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Sistema de Autenticación

### Opción 1: Supabase Auth (Recomendado)
- ✅ Integrado con Supabase
- ✅ Gestión de sesiones automática
- ✅ Recuperación de contraseña
- ✅ MFA opcional

### Opción 2: Autenticación Manual
- ⚠️ Más trabajo de implementación
- ⚠️ Gestión manual de sesiones
- ✅ Control total

**Decisión:** Usar **Supabase Auth** para simplicidad y seguridad.

---

## 📧 Sistema de Emails

### Servicio Recomendado: Resend

**¿Por qué Resend?**
- ✅ API simple y moderna
- ✅ 100 emails gratis al día
- ✅ Excelente deliverability
- ✅ Plantillas HTML
- ✅ Fácil integración con Supabase Edge Functions

**Alternativas:**
- SendGrid (3,000 emails/mes gratis)
- Mailgun (5,000 emails/mes gratis)
- Amazon SES (62,000 emails/mes gratis)

### Tipos de Emails:

1. **Email de Confirmación al Cliente**
   - Enviado: Inmediatamente después de hacer la reserva
   - Contenido: Detalles de la reserva + botón de confirmación
   - Acción: Cliente hace clic para confirmar

2. **Email de Notificación al Restaurante**
   - Enviado: Inmediatamente después de hacer la reserva
   - Contenido: Nueva reserva recibida + detalles
   - Acción: Revisar en el panel de admin

3. **Email de Recordatorio al Cliente**
   - Enviado: 24 horas antes de la reserva
   - Contenido: Recordatorio de la reserva + botón para cancelar
   - Acción: Cliente confirma asistencia o cancela

---

## 🎨 Panel de Administración

### Páginas:

1. **`login.html`** - Login de administradores
   - Email + contraseña
   - Recuperar contraseña
   - Recordar sesión

2. **`admin.html`** - Dashboard principal
   - Estadísticas de reservas
   - Reservas de hoy
   - Reservas pendientes de confirmación
   - Acceso rápido a gestión

3. **Secciones del Admin:**

   a) **Dashboard** (vista principal)
      - Reservas de hoy
      - Reservas pendientes
      - Estadísticas del mes
      - Gráficos de ocupación

   b) **Gestión de Reservas**
      - Tabla con todas las reservas
      - Filtros: fecha, estado, nombre
      - Acciones: confirmar, cancelar, editar
      - Ver detalles completos

   c) **Gestión del Menú**
      - Lista de platos por categoría
      - Añadir nuevo plato
      - Editar plato existente
      - Eliminar plato
      - Cambiar orden de visualización

   d) **Configuración**
      - Horarios de apertura
      - Capacidad máxima
      - Email del restaurante
      - Plantillas de email

---

## 🔄 Flujos de Trabajo

### Flujo 1: Nueva Reserva

```
1. Cliente llena formulario en index.html
   ↓
2. Sistema guarda en Supabase con estado='pendiente'
   ↓
3. Sistema genera token_confirmacion único
   ↓
4. Edge Function envía email de confirmación al cliente
   ↓
5. Edge Function envía email de notificación al restaurante
   ↓
6. Cliente recibe email con botón "Confirmar Reserva"
   ↓
7. Cliente hace clic en botón
   ↓
8. Sistema actualiza estado='confirmada' y confirmada_en=NOW()
   ↓
9. Cliente ve página de confirmación exitosa
```

### Flujo 2: Recordatorio Automático

```
1. Cron job se ejecuta cada hora (Supabase Edge Function)
   ↓
2. Busca reservas confirmadas para mañana a esta hora
   ↓
3. Filtra las que NO tienen recordatorio_enviado=true
   ↓
4. Para cada reserva:
   - Envía email de recordatorio
   - Actualiza recordatorio_enviado=true
   - Registra en email_logs
```

### Flujo 3: Gestión desde Admin

```
1. Admin hace login en login.html
   ↓
2. Sistema verifica credenciales con Supabase Auth
   ↓
3. Redirige a admin.html
   ↓
4. Admin ve dashboard con reservas
   ↓
5. Admin puede:
   - Ver detalles de reserva
   - Confirmar/cancelar manualmente
   - Editar información
   - Enviar email personalizado
```

---

## 📁 Estructura de Archivos

```
restaurante_avoa/
│
├── index.html                    # Página pública (ya existe)
├── carta.html                    # Menú público (ya existe)
├── privacidad.html              # Política de privacidad (ya existe)
│
├── admin/
│   ├── login.html               # Login de administradores (NUEVO)
│   ├── dashboard.html           # Panel principal (NUEVO)
│   ├── reservas.html            # Gestión de reservas (NUEVO)
│   ├── menu.html                # Gestión del menú (NUEVO)
│   └── configuracion.html       # Configuración (NUEVO)
│
├── js/
│   ├── supabase-config.js       # Configuración Supabase (ya existe)
│   ├── supabase-reservations.js # Lógica de reservas (ya existe)
│   ├── recaptcha-config.js      # reCAPTCHA (ya existe)
│   ├── admin-auth.js            # Autenticación admin (NUEVO)
│   ├── admin-reservas.js        # Gestión de reservas (NUEVO)
│   ├── admin-menu.js            # Gestión del menú (NUEVO)
│   └── email-service.js         # Servicio de emails (NUEVO)
│
├── css/
│   ├── style.css                # Estilos públicos (ya existe)
│   └── admin.css                # Estilos del admin (NUEVO)
│
├── supabase/
│   └── functions/
│       ├── send-confirmation/   # Edge Function: confirmación (NUEVO)
│       ├── send-reminder/       # Edge Function: recordatorio (NUEVO)
│       └── send-notification/   # Edge Function: notificación (NUEVO)
│
└── docs/
    ├── SEGURIDAD.md             # Guía de seguridad (ya existe)
    ├── IMPLEMENTACION_GDPR.md   # GDPR (ya existe)
    ├── SISTEMA_OPERATIVO.md     # Estado del sistema (ya existe)
    └── PLAN_IMPLEMENTACION_ADMIN.md  # Este documento
```

---

## 🚀 Fases de Implementación

### ✅ FASE 1: Preparación de Base de Datos (30 min)
- [ ] Actualizar tabla `reservas` (añadir campos)
- [ ] Crear tabla `admin_users`
- [ ] Crear tabla `email_logs`
- [ ] Configurar RLS (Row Level Security)
- [ ] Crear usuario admin inicial

### ✅ FASE 2: Sistema de Autenticación (1 hora)
- [ ] Configurar Supabase Auth
- [ ] Crear `login.html`
- [ ] Crear `admin-auth.js`
- [ ] Implementar protección de rutas
- [ ] Crear página de recuperación de contraseña

### ✅ FASE 3: Panel de Administración - Reservas (2 horas)
- [ ] Crear `admin/dashboard.html`
- [ ] Crear `admin/reservas.html`
- [ ] Crear `admin-reservas.js`
- [ ] Implementar tabla de reservas
- [ ] Implementar filtros y búsqueda
- [ ] Implementar acciones (confirmar, cancelar, editar)

### ✅ FASE 4: Panel de Administración - Menú (1 hora)
- [ ] Crear `admin/menu.html`
- [ ] Crear `admin-menu.js`
- [ ] Implementar CRUD de platos
- [ ] Implementar ordenamiento de platos
- [ ] Implementar categorías

### ✅ FASE 5: Sistema de Emails (2 horas)
- [ ] Crear cuenta en Resend
- [ ] Configurar dominio de email
- [ ] Crear plantillas HTML de emails
- [ ] Crear Edge Function: `send-confirmation`
- [ ] Crear Edge Function: `send-notification`
- [ ] Integrar con formulario de reservas

### ✅ FASE 6: Sistema de Confirmación (1 hora)
- [ ] Crear página de confirmación
- [ ] Implementar verificación de token
- [ ] Actualizar estado de reserva
- [ ] Mostrar mensaje de éxito

### ✅ FASE 7: Sistema de Recordatorios (1.5 horas)
- [ ] Crear Edge Function: `send-reminder`
- [ ] Configurar Cron Job en Supabase
- [ ] Crear plantilla de email de recordatorio
- [ ] Implementar lógica de envío 24h antes
- [ ] Registrar en `email_logs`

### ✅ FASE 8: Estilos y UX (1 hora)
- [ ] Crear `admin.css`
- [ ] Diseñar dashboard moderno
- [ ] Añadir animaciones y transiciones
- [ ] Hacer responsive el panel
- [ ] Añadir iconos y gráficos

### ✅ FASE 9: Pruebas y Ajustes (1 hora)
- [ ] Probar flujo completo de reserva
- [ ] Probar envío de emails
- [ ] Probar confirmación por email
- [ ] Probar recordatorios
- [ ] Probar gestión desde admin
- [ ] Ajustar bugs y detalles

---

## ⏱️ Tiempo Estimado Total: **10-12 horas**

---

## 🔑 Credenciales y Configuración

### Supabase
- **URL:** https://ybvxkxdvtqxqpnhcmgzc.supabase.co
- **Anon Key:** (ya configurada)
- **Service Role Key:** (necesaria para Edge Functions)

### Resend
- **API Key:** (a obtener)
- **Dominio:** reservas@restauranteavoa.com
- **From Name:** Restaurante Avoa

### Admin Inicial
- **Email:** admin@restauranteavoa.com
- **Contraseña:** (a definir)

---

## 📝 Notas Importantes

1. **Seguridad:**
   - Todas las rutas de admin requieren autenticación
   - RLS activo en todas las tablas
   - Tokens de confirmación únicos y seguros
   - Rate limiting en Edge Functions

2. **GDPR:**
   - Emails incluyen enlace para darse de baja
   - Datos de email registrados en `email_logs`
   - Opción de eliminar datos personales

3. **Escalabilidad:**
   - Edge Functions serverless (escalan automáticamente)
   - Supabase maneja hasta 500MB gratis
   - Resend: 100 emails/día gratis (suficiente para empezar)

4. **Backup:**
   - Supabase hace backups automáticos
   - Exportar reservas a CSV desde admin
   - Logs de emails para auditoría

---

## ✅ Checklist de Inicio

Antes de empezar, necesitamos:

- [ ] Confirmar que Supabase está configurado
- [ ] Crear cuenta en Resend (https://resend.com)
- [ ] Definir email del restaurante
- [ ] Definir contraseña del admin inicial
- [ ] Confirmar horarios de apertura del restaurante
- [ ] Confirmar capacidad máxima del restaurante

---

**¿Listo para empezar?** 🚀
