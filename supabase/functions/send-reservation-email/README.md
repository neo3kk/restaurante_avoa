# 📧 Sistema de Notificaciones por Email

Sistema completo de notificaciones automáticas por correo electrónico para las reservas del restaurante.

## 🚀 Inicio Rápido

### 1. Configurar servicio de email

**Opción A: Resend (Recomendado)**
- Regístrate en: https://resend.com
- Obtén tu API Key
- 100 emails gratis al día

**Opción B: Brevo**
- Regístrate en: https://www.brevo.com/es/
- Obtén tu API Key
- 300 emails gratis al día

### 2. Configurar variables en Supabase

```bash
# En Supabase → Project Settings → Edge Functions → Secrets
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_tu_api_key_aqui
```

### 3. Desplegar Edge Function

```powershell
# Ejecutar desde el directorio raíz
.\deploy-email-function.ps1
```

## 📨 Tipos de Emails

| Tipo | Cuándo se envía | Destinatario |
|------|----------------|--------------|
| **Confirmación** | Al crear reserva | Cliente |
| **Notificación** | Al crear reserva | Restaurante |
| **Recordatorio** | 24h antes | Cliente |
| **Cancelación** | Al cancelar | Cliente |

## 🌐 Multiidioma

Los emails se envían automáticamente en el idioma preferido del cliente:
- 🇪🇸 Español
- 🇬🇧 Catalán
- 🇬🇧 Inglés

## 📖 Documentación Completa

Ver: [`docs/guias/GUIA_NOTIFICACIONES_EMAIL.md`](docs/guias/GUIA_NOTIFICACIONES_EMAIL.md)

## ✅ Checklist

- [ ] Cuenta creada en Resend/Brevo
- [ ] API Key obtenida
- [ ] Variables configuradas en Supabase
- [ ] Edge Function desplegada
- [ ] Prueba realizada

## 🐛 Troubleshooting

**No se envían emails:**
```bash
# Ver logs
supabase functions logs send-reservation-email

# Verificar tabla de logs
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 10;
```

## 📞 Soporte

- **Resend Docs:** https://resend.com/docs
- **Brevo Docs:** https://developers.brevo.com/docs
- **Supabase Functions:** https://supabase.com/docs/guides/functions
