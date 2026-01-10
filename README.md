# ðŸ½ï¸ Restaurante Avoa - Sistema de GestiÃ³n

Sistema completo de gestiÃ³n para Restaurante Avoa en Palma de Mallorca.

## ðŸ“‹ CaracterÃ­sticas

### âœ… GestiÃ³n de MenÃº
- Panel de administraciÃ³n completo
- CategorÃ­as dinÃ¡micas
- GestiÃ³n de platos y vinos
- Precios segÃºn mercado
- Multiidioma (ES/CA/EN)

### âœ… Sistema de Reservas
- Formulario de reservas online
- Notificaciones por email automÃ¡ticas
- Panel de gestiÃ³n de reservas
- Estados de reserva

### âœ… Carta Digital
- Carta dinÃ¡mica desde base de datos
- Responsive design
- Multiidioma
- ActualizaciÃ³n en tiempo real

## ðŸš€ TecnologÃ­as

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Supabase (PostgreSQL)
- **Email:** Supabase Edge Functions
- **Hosting:** Servidor web estÃ¡tico

## ðŸ“ Estructura del Proyecto

```
restaurante_avoa/
â”œâ”€â”€ admin/              # Panel de administraciÃ³n
â”‚   â”œâ”€â”€ dashboard.html
â”‚   â”œâ”€â”€ menu.html
â”‚   â”œâ”€â”€ categorias.html
â”‚   â”œâ”€â”€ reservas.html
â”‚   â””â”€â”€ configuracion.html
â”œâ”€â”€ css/                # Estilos
â”œâ”€â”€ js/                 # Scripts JavaScript
â”œâ”€â”€ supabase/           # ConfiguraciÃ³n de base de datos
â”‚   â”œâ”€â”€ setup.sql
â”‚   â”œâ”€â”€ functions/
â”‚   â””â”€â”€ BACKUP_FACIL.sql
â”œâ”€â”€ docs/               # DocumentaciÃ³n
â”œâ”€â”€ backups/            # Backups de la base de datos
â”œâ”€â”€ index.html          # PÃ¡gina principal
â”œâ”€â”€ carta.html          # Carta digital
â”œâ”€â”€ reservar.html       # Formulario de reservas
â””â”€â”€ README.md           # Este archivo
```

## ðŸ”§ ConfiguraciÃ³n

### 1. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el script `supabase/setup.sql`
3. Copia `supabase-config.example.js` a `supabase-config.js`
4. Actualiza las credenciales en `supabase-config.js`

### 2. Configurar Edge Functions

```bash
cd supabase/functions
supabase functions deploy send-reservation-email
```

### 3. Configurar Email

Actualiza las plantillas de email en:
- `supabase/functions/send-reservation-email/templates/`

## ðŸ“– DocumentaciÃ³n

- **[INDICE.md](INDICE.md)** - Ãndice completo de documentaciÃ³n
- **[GUIA_GESTION_MENU_VINOS.md](GUIA_GESTION_MENU_VINOS.md)** - GuÃ­a de gestiÃ³n de menÃº
- **[docs/](docs/)** - DocumentaciÃ³n detallada

## ðŸ’¾ Backups

Para crear un backup:

1. Abre Supabase SQL Editor
2. Ejecuta `supabase/BACKUP_FACIL.sql`
3. Guarda el resultado en `backups/`

Ver: `supabase/GUIA_BACKUP_COMPLETO.md`

## ðŸ” Seguridad

- RLS (Row Level Security) habilitado
- AutenticaciÃ³n requerida para admin
- ValidaciÃ³n de formularios
- ProtecciÃ³n CSRF

## ðŸ“± Contacto

- **Web:** https://restauranteavoa.com
- **Email:** info@restauranteavoa.com
- **TelÃ©fono:** +34 971 123 456

## ðŸ“„ Licencia

Â© 2025 Restaurante Avoa. Todos los derechos reservados.

---

**Ãšltima actualizaciÃ³n:** 2026-01-10
**VersiÃ³n:** 1.0.0
