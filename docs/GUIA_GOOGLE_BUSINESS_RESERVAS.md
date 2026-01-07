# 📱 Guía: Configurar Botón de Reservas en Google My Business

## 🎯 Objetivo
Enlazar el botón de "Reservar" de Google My Business con tu formulario de reservas online.

---

## 📋 Paso a Paso

### 1️⃣ **Acceder a Google Business Profile**

1. Ve a [Google Business Profile](https://business.google.com/)
2. Inicia sesión con la cuenta de Google asociada a tu restaurante
3. Selecciona tu perfil: **Restaurante Avoa**

---

### 2️⃣ **Configurar el Botón de Reservas**

#### **Opción A: Enlace Directo (Recomendado)**

1. En el panel de Google Business, ve a **"Editar perfil"**
2. Busca la sección **"Añadir información"** o **"Botones de acción"**
3. Selecciona **"Añadir botón de reserva"** o **"Reservar"**
4. Introduce la URL de tu página de reservas:

```
https://restauranteavoa.com/reservar.html
```

5. Guarda los cambios

#### **Opción B: Integración con Plataformas de Reservas**

Si usas plataformas como:
- **The Fork** (ya tienes perfil)
- **Google Reserve** (requiere integración API)
- **OpenTable**

Puedes conectarlas directamente desde el panel de Google Business.

---

### 3️⃣ **URLs Disponibles para Usar**

Tienes varias opciones de URLs para el botón:

| URL | Descripción | Recomendación |
|-----|-------------|---------------|
| `https://restauranteavoa.com/reservar.html` | Página dedicada de reservas | ⭐⭐⭐⭐⭐ **MEJOR OPCIÓN** |
| `https://restauranteavoa.com/#contacto` | Sección de contacto en home | ⭐⭐⭐ Buena |
| `https://restauranteavoa.com/index.html#contacto` | Igual que anterior | ⭐⭐⭐ Buena |

---

### 4️⃣ **Ventajas de la Página Dedicada `reservar.html`**

✅ **URL limpia y profesional**
✅ **Optimizada para SEO** con meta tags específicos
✅ **Diseño enfocado** solo en reservas
✅ **Mejor experiencia de usuario** desde Google
✅ **Tracking más fácil** en Google Analytics
✅ **Carga más rápida** (menos contenido que la home)

---

### 5️⃣ **Configuración Adicional en Google Business**

#### **A. Añadir Horarios de Reserva**

1. Ve a **"Información"** → **"Horario"**
2. Configura los horarios:
   - **Lunes - Martes**: 13:30 - 15:00
   - **Miércoles - Sábado**: 13:30 - 15:00, 20:00 - 23:00
   - **Domingo**: Cerrado

#### **B. Activar Mensajes**

1. Ve a **"Mensajes"**
2. Activa la función de mensajería
3. Los clientes podrán contactarte directamente desde Google

#### **C. Añadir Fotos de Calidad**

- Sube fotos de platos
- Interior del restaurante
- Ambiente
- Esto aumenta las conversiones de reservas

---

### 6️⃣ **Verificar que Funciona**

1. Busca **"Restaurante Avoa"** en Google
2. Verifica que aparezca el botón **"Reservar"**
3. Haz clic y comprueba que te lleva a `reservar.html`
4. Prueba el formulario completo

---

### 7️⃣ **Alternativa: Usar The Fork**

Ya tienes perfil en The Fork:
```
https://www.thefork.es/restaurante/restaurante-avoa-palma-r850719
```

**Opción mixta:**
- Botón principal de Google → Tu web (`reservar.html`)
- Enlace adicional en descripción → The Fork

**Ventajas de usar tu propia web:**
- ✅ Sin comisiones
- ✅ Control total de los datos
- ✅ Mejor relación con clientes
- ✅ Base de datos propia

---

### 8️⃣ **Monitorización**

#### **Google Analytics** (si lo tienes configurado)

Añade este código a `reservar.html` antes de `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU-ID-AQUI"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU-ID-AQUI');
</script>
```

Podrás ver:
- Cuántas personas llegan desde Google
- Tasa de conversión de reservas
- Horarios más populares

---

### 9️⃣ **Optimizaciones Adicionales**

#### **A. Schema Markup para Reservas**

Ya está incluido en `reservar.html` con:
- Horarios actualizados
- Información de contacto
- Datos estructurados para Google

#### **B. Botón de WhatsApp** (Opcional)

Puedes añadir un botón flotante de WhatsApp en `reservar.html`:

```html
<a href="https://wa.me/34659021302?text=Hola,%20quiero%20hacer%20una%20reserva" 
   class="whatsapp-float" 
   target="_blank">
   💬
</a>
```

---

## 🎯 Resumen de URLs para Google Business

### **URL Principal (Recomendada):**
```
https://restauranteavoa.com/reservar.html
```

### **URLs Alternativas:**
```
https://restauranteavoa.com/#contacto
https://www.thefork.es/restaurante/restaurante-avoa-palma-r850719
```

---

## 📊 Métricas a Seguir

Una vez configurado, monitoriza:

1. **Clics en el botón de reserva** (Google Business Insights)
2. **Visitas a `reservar.html`** (Google Analytics)
3. **Tasa de conversión** (reservas completadas / visitas)
4. **Horarios más solicitados**
5. **Días con más reservas**

---

## ✅ Checklist Final

- [ ] Página `reservar.html` creada y funcionando
- [ ] URL configurada en Google Business Profile
- [ ] Horarios actualizados en Google
- [ ] Fotos de calidad subidas
- [ ] Formulario probado y funcionando
- [ ] Emails de confirmación funcionando
- [ ] Google Analytics configurado (opcional)

---

## 🆘 Soporte

Si tienes problemas:
1. Verifica que la URL sea accesible públicamente
2. Comprueba que el formulario funcione correctamente
3. Revisa que Supabase esté configurado
4. Contacta con soporte de Google Business si el botón no aparece

---

**Fecha de creación:** 2026-01-07
**Última actualización:** 2026-01-07
