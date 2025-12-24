# 🍽️ RESTAURANTE AVOA - SITIO WEB OFICIAL

**Restaurante de pescado y marisco fresco en Palma de Mallorca**

[![Estado](https://img.shields.io/badge/Estado-Producción-success)](https://restauranteavoa.com)
[![Seguridad](https://img.shields.io/badge/Seguridad-85%2F100-brightgreen)](docs/auditorias/REVISION_FINAL_SEGURIDAD.md)
[![Documentación](https://img.shields.io/badge/Docs-Completa-blue)](docs/INDICE.md)

---

## 📋 DESCRIPCIÓN

Sitio web moderno y seguro para Restaurante Avoa, especializado en pescado fresco y marisco de Galicia en el corazón de Palma de Mallorca.

### ✨ **Características Principales**

- 🌐 **Multiidioma:** Español, Catalán, Inglés
- 📱 **Responsive:** Optimizado para móvil, tablet y desktop
- 🔒 **Seguro:** Protección anti-bot con reCAPTCHA v3
- 💾 **Base de datos:** Supabase con Row Level Security
- 🎨 **Diseño moderno:** Interfaz elegante y profesional
- 📊 **SEO optimizado:** Structured data y meta tags completos

---

## 🚀 INICIO RÁPIDO

### **Para Desarrollo Local**

```bash
# 1. Clonar el repositorio
git clone [URL_DEL_REPO]
cd restaurante_avoa

# 2. Iniciar servidor local
python -m http.server 8000

# 3. Abrir en navegador
http://localhost:8000
```

### **Para Producción**

Ver guía completa: [`docs/guias/INICIO_RAPIDO.md`](docs/guias/INICIO_RAPIDO.md)

---

## 📁 ESTRUCTURA DEL PROYECTO

```
restaurante_avoa/
├── index.html              # Página principal
├── carta.html              # Carta del restaurante
├── privacidad.html         # Política de privacidad
├── style.css               # Estilos principales
├── assets/                 # Imágenes y recursos
├── js/                     # Scripts JavaScript
├── admin/                  # Panel de administración
├── supabase/              # Edge Functions y configuración
└── docs/                  # 📚 Documentación completa
    ├── INDICE.md          # ⭐ Índice de documentación
    ├── auditorias/        # Informes de seguridad
    ├── configuracion/     # Guías de configuración
    └── guias/            # Guías de uso
```

---

## 📚 DOCUMENTACIÓN

### **📖 Documentos Principales**

| Documento | Descripción |
|-----------|-------------|
| **[`docs/INDICE.md`](docs/INDICE.md)** | ⭐ **Índice completo de documentación** |
| [`docs/auditorias/REVISION_FINAL_SEGURIDAD.md`](docs/auditorias/REVISION_FINAL_SEGURIDAD.md) | Revisión final de seguridad |
| [`docs/guias/INICIO_RAPIDO.md`](docs/guias/INICIO_RAPIDO.md) | Guía de inicio rápido |
| [`docs/guias/GUIA_DESPLIEGUE_RECAPTCHA.md`](docs/guias/GUIA_DESPLIEGUE_RECAPTCHA.md) | Configuración de reCAPTCHA |

---

## 🔒 SEGURIDAD

### **Puntuación: 85/100** 🟢 **MUY BUENO**

- ✅ reCAPTCHA v3 con verificación backend
- ✅ Row Level Security en Supabase
- ✅ Headers de seguridad configurados
- ✅ Protección contra XSS y SQL injection
- ✅ Autenticación segura para admin

**Detalles:** [`docs/auditorias/REVISION_FINAL_SEGURIDAD.md`](docs/auditorias/REVISION_FINAL_SEGURIDAD.md)

---

## 🛠️ TECNOLOGÍAS

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Protección:** Google reCAPTCHA v3
- **Hosting:** Apache/Nginx (configurable)
- **Idiomas:** ES, CA, EN

---

## 📊 ESTADO DEL PROYECTO

| Componente | Estado | Versión |
|------------|--------|---------|
| **Frontend** | ✅ Producción | 1.0 |
| **Backend** | ✅ Producción | 1.0 |
| **Seguridad** | ✅ Auditado | 85/100 |
| **Documentación** | ✅ Completa | 1.0 |

---

## 🔧 CONFIGURACIÓN

### **Variables de Entorno Necesarias**

```javascript
// supabase-config.js (NO incluir en Git)
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'tu_clave_aqui';
```

### **Archivos de Configuración**

- `supabase-config.js` - Configuración de Supabase (en `.gitignore`)
- `recaptcha-config.js` - Clave pública de reCAPTCHA
- `htaccess.apache` - Configuración de servidor (renombrar a `.htaccess`)

**Guías:** [`docs/configuracion/`](docs/configuracion/)

---

## 📞 CONTACTO

**Restaurante Avoa**  
📍 Avinguda de l'Argentina, 59, Palma, Illes Balears  
📞 +34 659 02 13 02 | +34 971 28 83 60  
📧 reservas@restauranteavoa.com  
🌐 https://restauranteavoa.com

---

## 📝 LICENCIA

© 2024 Restaurante Avoa. Todos los derechos reservados.

---

## 🎯 PRÓXIMOS PASOS

1. **Configurar SSL** en servidor web
2. **Actualizar dominios** en Google reCAPTCHA
3. **Desplegar** a producción
4. **Verificar** funcionamiento
5. **Monitorear** logs y errores

**Guía completa:** [`docs/INDICE.md`](docs/INDICE.md)

---

**Desarrollado con ❤️ para Restaurante Avoa**  
**Última actualización:** 24 de Diciembre de 2024
