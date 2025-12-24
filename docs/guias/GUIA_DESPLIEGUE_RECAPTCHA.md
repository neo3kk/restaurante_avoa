# 🚀 GUÍA DE DESPLIEGUE - EDGE FUNCTION reCAPTCHA
**Restaurante Avoa**  
**Fecha:** 24 de Diciembre de 2024

---

## 📋 RESUMEN

Se ha implementado la **verificación backend de reCAPTCHA** mediante una Edge Function de Supabase. Esto previene que bots envíen formularios de reserva spam.

**Archivos creados/modificados:**
- ✅ `supabase/functions/verify-recaptcha/index.ts` - Edge Function
- ✅ `supabase/functions/_shared/cors.ts` - Headers CORS
- ✅ `supabase-reservations.js` - Actualizado con verificación backend

---

## 🔧 PASOS PARA DESPLEGAR

### **PASO 1: Instalar Supabase CLI**

Si no lo tienes instalado:

```powershell
# Opción 1: Con npm
npm install -g supabase

# Opción 2: Con Scoop (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

Verificar instalación:
```powershell
supabase --version
```

---

### **PASO 2: Iniciar Sesión en Supabase**

```powershell
supabase login
```

Esto abrirá el navegador para autenticarte.

---

### **PASO 3: Vincular el Proyecto**

```powershell
cd c:\Users\neo3k\Desktop\restaurante_avoa
supabase link --project-ref TU_PROJECT_REF
```

**¿Dónde encontrar el Project Ref?**
1. Ir a https://app.supabase.com
2. Seleccionar tu proyecto
3. Settings > General > Reference ID

---

### **PASO 4: Configurar la Clave Secreta de reCAPTCHA**

**Obtener la clave secreta:**
1. Ir a https://www.google.com/recaptcha/admin
2. Seleccionar tu sitio
3. Copiar la **"Clave secreta"** (NO la clave del sitio)

**Configurar en Supabase:**

```powershell
# Opción 1: Desde CLI
supabase secrets set RECAPTCHA_SECRET_KEY=TU_CLAVE_SECRETA_AQUI

# Opción 2: Desde Dashboard
# Ir a: Project Settings > Edge Functions > Secrets
# Añadir: RECAPTCHA_SECRET_KEY = tu_clave_secreta
```

---

### **PASO 5: Desplegar la Edge Function**

```powershell
cd c:\Users\neo3k\Desktop\restaurante_avoa
supabase functions deploy verify-recaptcha
```

**Salida esperada:**
```
Deploying verify-recaptcha (project ref: xxxxx)
Bundled verify-recaptcha in 123ms
Deployed verify-recaptcha in 456ms
✅ Function URL: https://xxxxx.supabase.co/functions/v1/verify-recaptcha
```

---

### **PASO 6: Probar la Edge Function**

**Desde PowerShell:**

```powershell
# Reemplazar con tu URL de proyecto
$url = "https://TU_PROJECT_REF.supabase.co/functions/v1/verify-recaptcha"
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer TU_ANON_KEY"
}
$body = @{
    token = "test_token"
} | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
```

**Respuesta esperada (token inválido):**
```json
{
  "valid": false,
  "error": "Token de reCAPTCHA inválido"
}
```

---

### **PASO 7: Actualizar Dominios en reCAPTCHA**

1. Ir a https://www.google.com/recaptcha/admin
2. Seleccionar tu sitio
3. En "Dominios", añadir:
   - `localhost` (para desarrollo)
   - `restauranteavoa.com` (producción)
   - `www.restauranteavoa.com` (si aplica)
4. Guardar cambios

---

### **PASO 8: Probar en el Navegador**

1. Abrir http://localhost:8000
2. Ir al formulario de reservas
3. Abrir la consola del navegador (F12)
4. Llenar el formulario y enviar
5. Verificar logs en consola:

```
🔐 Obteniendo token de reCAPTCHA...
✅ Token de reCAPTCHA obtenido
🔍 Verificando token en backend...
✅ reCAPTCHA verificado - Score: 0.9
💾 Guardando reserva en base de datos...
✅ Reserva guardada exitosamente
```

---

## 🔍 VERIFICACIÓN Y DEBUGGING

### **Ver Logs de la Edge Function**

```powershell
supabase functions logs verify-recaptcha
```

O desde el Dashboard:
- Ir a: Edge Functions > verify-recaptcha > Logs

---

### **Logs Esperados (Éxito)**

```
🔍 Verificando token de reCAPTCHA...
📊 Resultado de verificación: {
  success: true,
  score: 0.9,
  action: 'submit_reservation',
  challenge_ts: '2024-12-24T13:30:00Z',
  hostname: 'localhost'
}
✅ Verificación exitosa - Score: 0.9
```

---

### **Logs Esperados (Bot Detectado)**

```
🔍 Verificando token de reCAPTCHA...
📊 Resultado de verificación: {
  success: true,
  score: 0.3,
  action: 'submit_reservation'
}
⚠️ Score bajo detectado: 0.3 (mínimo: 0.5)
```

---

## ⚙️ CONFIGURACIÓN AVANZADA

### **Ajustar Score Mínimo**

Editar `supabase/functions/verify-recaptcha/index.ts`:

```typescript
const MIN_SCORE = 0.5; // Cambiar según necesidad
// 0.0 = definitivamente bot
// 0.5 = umbral recomendado
// 0.7 = más estricto
// 1.0 = definitivamente humano
```

Redesplegar:
```powershell
supabase functions deploy verify-recaptcha
```

---

### **Configurar CORS para Producción**

Editar `supabase/functions/_shared/cors.ts`:

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://restauranteavoa.com', // Cambiar de '*'
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
```

Redesplegar:
```powershell
supabase functions deploy verify-recaptcha
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### **Error: "RECAPTCHA_SECRET_KEY no configurada"**

**Problema:** La variable de entorno no está configurada.

**Solución:**
```powershell
supabase secrets set RECAPTCHA_SECRET_KEY=TU_CLAVE_SECRETA
```

---

### **Error: "Token de reCAPTCHA inválido"**

**Posibles causas:**
1. Dominio no añadido en Google reCAPTCHA
2. Clave secreta incorrecta
3. Token expirado (válido por 2 minutos)

**Solución:**
- Verificar dominios en https://www.google.com/recaptcha/admin
- Verificar que la clave secreta sea correcta
- Recargar la página y volver a intentar

---

### **Error: "Score bajo detectado"**

**Causa:** El usuario parece un bot según Google.

**Soluciones:**
1. Reducir `MIN_SCORE` a 0.3 (menos estricto)
2. Pedir al usuario que recargue la página
3. Verificar que no haya extensiones de navegador bloqueando reCAPTCHA

---

### **Error: "CORS policy"**

**Problema:** El navegador bloquea la petición por CORS.

**Solución:**
Verificar que `cors.ts` incluya el dominio correcto:
```typescript
'Access-Control-Allow-Origin': 'https://tu-dominio.com'
```

---

## 📊 MONITOREO

### **Métricas a Vigilar**

1. **Tasa de Éxito:**
   - % de verificaciones exitosas
   - Objetivo: >95%

2. **Score Promedio:**
   - Score promedio de usuarios
   - Objetivo: >0.7

3. **Bots Bloqueados:**
   - Número de intentos con score <0.5
   - Monitorear picos sospechosos

### **Dashboard de Supabase**

Ir a: Edge Functions > verify-recaptcha > Metrics

Revisar:
- Invocaciones por día
- Tiempo de respuesta
- Tasa de error

---

## ✅ CHECKLIST DE DESPLIEGUE

- [ ] Supabase CLI instalado
- [ ] Proyecto vinculado (`supabase link`)
- [ ] Clave secreta configurada (`RECAPTCHA_SECRET_KEY`)
- [ ] Edge Function desplegada
- [ ] Dominios añadidos en Google reCAPTCHA
- [ ] Probado en localhost
- [ ] Logs verificados (sin errores)
- [ ] CORS configurado para producción
- [ ] Documentación actualizada

---

## 🔄 ACTUALIZAR LA FUNCIÓN

Si necesitas hacer cambios:

1. Editar `supabase/functions/verify-recaptcha/index.ts`
2. Redesplegar:
```powershell
supabase functions deploy verify-recaptcha
```
3. Verificar logs:
```powershell
supabase functions logs verify-recaptcha --tail
```

---

## 📝 NOTAS IMPORTANTES

1. **Clave Secreta:**
   - NUNCA incluir en el código frontend
   - Solo en variables de entorno del servidor

2. **Score de reCAPTCHA:**
   - 0.5 es un buen balance
   - Ajustar según tasa de falsos positivos

3. **Costos:**
   - reCAPTCHA es gratuito hasta 1M requests/mes
   - Edge Functions de Supabase: 500K invocaciones/mes gratis

4. **Backup:**
   - Si la Edge Function falla, el formulario seguirá funcionando
   - Solo mostrará advertencia en consola

---

## 🆘 SOPORTE

**Documentación:**
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- reCAPTCHA v3: https://developers.google.com/recaptcha/docs/v3

**Contacto:**
- Supabase Support: support@supabase.io
- Google reCAPTCHA: https://support.google.com/recaptcha

---

**Última actualización:** 24/12/2024  
**Versión:** 1.0
