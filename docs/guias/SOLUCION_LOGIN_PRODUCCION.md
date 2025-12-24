# 🔧 SOLUCIÓN: PROBLEMAS DE LOGIN EN PRODUCCIÓN

**Problema:** El login del admin funciona en localhost pero NO en producción  
**Causa:** Configuración de Supabase Auth  
**Fecha:** 24 de Diciembre de 2024

---

## 🎯 SOLUCIÓN PASO A PASO

### **PASO 1: Configurar URLs en Supabase Auth** (⭐ MÁS PROBABLE)

1. **Abre** https://app.supabase.com
2. **Selecciona** tu proyecto
3. **Ve a** "Authentication" (en el menú lateral)
4. **Haz clic** en "URL Configuration"
5. **Configura** las siguientes URLs:

```
Site URL:
https://restauranteavoa.com

Redirect URLs (añadir cada una):
https://restauranteavoa.com/*
https://restauranteavoa.com/admin/*
https://restauranteavoa.com/admin/dashboard.html
https://restauranteavoa.com/admin/index.html
```

6. **Guarda** los cambios

---

### **PASO 2: Verificar CORS en Supabase**

1. En Supabase Dashboard, ve a **"Settings"** > **"API"**
2. Busca la sección **"CORS Configuration"**
3. Añade tu dominio de producción:

```
https://restauranteavoa.com
```

4. **Guarda** los cambios

---

### **PASO 3: Verificar que tienes HTTPS**

Supabase Auth **requiere HTTPS** en producción. Verifica:

1. Tu sitio debe ser `https://restauranteavoa.com` (NO `http://`)
2. El certificado SSL debe estar válido
3. No debe haber errores de certificado

---

### **PASO 4: Limpiar Caché del Navegador**

Después de hacer los cambios:

1. Abre tu sitio en modo incógnito
2. O limpia la caché del navegador:
   - Chrome: `Ctrl + Shift + Delete`
   - Selecciona "Cookies" y "Caché"
   - Limpia

---

### **PASO 5: Verificar en Consola del Navegador**

1. Abre tu sitio de producción: `https://restauranteavoa.com/admin/login.html`
2. Abre la consola (F12)
3. Intenta hacer login
4. **Busca errores** que mencionen:
   - `CORS`
   - `redirect_uri`
   - `Site URL`
   - `Invalid login credentials`

---

## 🐛 ERRORES COMUNES Y SOLUCIONES

### **Error 1: "Invalid login credentials" (pero las credenciales son correctas)**

**Causa:** Site URL no configurada  
**Solución:** Configurar Site URL en Supabase (Paso 1)

---

### **Error 2: "CORS policy: No 'Access-Control-Allow-Origin' header"**

**Causa:** Dominio no permitido en CORS  
**Solución:** Añadir dominio en CORS Configuration (Paso 2)

---

### **Error 3: "redirect_uri mismatch"**

**Causa:** Redirect URL no configurada  
**Solución:** Añadir Redirect URLs en Supabase (Paso 1)

---

### **Error 4: "Mixed Content" o "This site can't provide a secure connection"**

**Causa:** No tienes HTTPS configurado  
**Solución:** Configurar SSL en tu servidor (Paso 3)

---

### **Error 5: "supabase is not defined"**

**Causa:** Scripts no se cargan en el orden correcto  
**Solución:** Verificar que los scripts estén en este orden en `login.html`:

```html
<!-- 1. Supabase JS Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- 2. Configuración -->
<script src="../supabase-config.js"></script>

<!-- 3. Alias -->
<script src="../js/supabase-alias.js"></script>

<!-- 4. Auth -->
<script src="../js/admin-auth.js"></script>
```

---

## 🧪 CÓMO PROBAR QUE FUNCIONA

### **Test 1: Verificar que Supabase está disponible**

1. Abre `https://restauranteavoa.com/admin/login.html`
2. Abre la consola (F12)
3. Escribe:

```javascript
console.log('supabase:', typeof window.supabase);
console.log('supabaseClient:', typeof window.supabaseClient);
```

**Resultado esperado:**
```
supabase: object
supabaseClient: object
```

---

### **Test 2: Probar login con credenciales incorrectas**

1. Intenta hacer login con email/contraseña incorrectos
2. **Deberías ver:** "Email o contraseña incorrectos"
3. **NO deberías ver:** Errores de CORS o redirect_uri

---

### **Test 3: Probar login con credenciales correctas**

1. Usa tus credenciales de admin
2. **Deberías:** Ser redirigido a `/admin/dashboard.html`
3. **Deberías ver:** El dashboard cargado correctamente

---

## 📸 CAPTURA DE PANTALLA DE ERRORES

Si sigues teniendo problemas, envíame una captura de pantalla de:

1. **Consola del navegador** (F12 > Console) con el error
2. **Pestaña Network** (F12 > Network) mostrando las peticiones fallidas
3. **Configuración de Supabase** (Authentication > URL Configuration)

---

## 🔍 VERIFICACIÓN FINAL

Después de aplicar los cambios, verifica:

- [ ] Site URL configurada en Supabase
- [ ] Redirect URLs añadidas
- [ ] CORS configurado
- [ ] HTTPS funcionando
- [ ] Caché del navegador limpiada
- [ ] Login probado en modo incógnito

---

## 📞 SI SIGUE SIN FUNCIONAR

Si después de todos estos pasos sigue sin funcionar, necesito que me envíes:

1. **URL de producción** donde está el problema
2. **Captura de pantalla** de la consola con el error
3. **Captura de pantalla** de la configuración de Supabase Auth

Con esa información podré darte una solución más específica.

---

## 💡 NOTA IMPORTANTE

El sistema de login **funciona perfectamente en localhost**, lo que confirma que el código está bien. El problema es **100% de configuración** en Supabase o en el servidor.

**La solución más probable es el Paso 1** (configurar Site URL y Redirect URLs en Supabase).

---

**Última actualización:** 24/12/2024  
**Estado:** Diagnóstico completado - Solución documentada
