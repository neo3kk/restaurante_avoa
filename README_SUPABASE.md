# 🚀 Configuración de Supabase para Restaurante Avoa

## 📋 Pasos para Configurar

### 1. Ejecutar el Script SQL en Supabase

1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. En el menú lateral, haz clic en **SQL Editor**
3. Haz clic en **New Query**
4. Copia todo el contenido del archivo `supabase-setup.sql`
5. Pégalo en el editor
6. Haz clic en **Run** (o presiona Ctrl+Enter)

Esto creará:
- ✅ Tabla `menu_items` (platos de la carta)
- ✅ Tabla `reservas` (reservas de clientes)
- ✅ Tabla `configuracion` (configuración del restaurante)
- ✅ Políticas de seguridad (RLS)
- ✅ Datos iniciales de ejemplo

### 2. Obtener las Credenciales de Supabase

1. En Supabase, ve a **Settings** (⚙️) > **API**
2. Encontrarás dos valores importantes:
   - **Project URL**: algo como `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: una clave larga que empieza con `eyJ...`

### 3. Configurar las Credenciales en el Proyecto

1. Abre el archivo `supabase-config.js`
2. Reemplaza los valores:
   ```javascript
   const SUPABASE_URL = 'TU_SUPABASE_URL_AQUI'; // Pega tu Project URL
   const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY_AQUI'; // Pega tu anon public key
   ```

### 4. Crear un Usuario Administrador (Opcional pero Recomendado)

Para acceder al panel de administración, necesitas crear un usuario:

1. En Supabase, ve a **Authentication** > **Users**
2. Haz clic en **Add user** > **Create new user**
3. Ingresa un email y contraseña (guárdalos bien)
4. Haz clic en **Create user**

Este usuario podrá acceder al panel de administración.

---

## 🎯 Funcionalidades Implementadas

### ✅ Carta Dinámica
- Los platos se cargan automáticamente desde Supabase
- Soporte multiidioma (ES/CA/EN)
- Puedes actualizar precios y platos sin tocar código

### ✅ Sistema de Reservas
- Formulario funcional que guarda en Supabase
- Validación de fechas
- Mensajes de confirmación
- Almacena: nombre, email, teléfono, fecha, personas, comentarios

### ✅ Configuración
- Tabla para gestionar horarios, teléfonos, emails
- Fácil de actualizar desde Supabase

---

## 📊 Estructura de las Tablas

### `menu_items`
Almacena todos los platos de la carta:
- Categorías: entrantes, platos_calientes, pescados, carnes, postres, vinos
- Multiidioma: nombre_es, nombre_ca, nombre_en
- Precios flexibles (fijos o "según mercado")
- Control de visibilidad (activo/inactivo)
- Orden personalizable

### `reservas`
Almacena las reservas de clientes:
- Datos del cliente (nombre, email, teléfono)
- Detalles de la reserva (fecha, personas, comentarios)
- Estado (pendiente, confirmada, cancelada, completada)
- Idioma en que se hizo la reserva

### `configuracion`
Configuración general del restaurante:
- Horarios
- Teléfonos
- Emails
- Cualquier texto configurable

---

## 🔐 Seguridad (Row Level Security)

Las tablas tienen políticas de seguridad configuradas:

- **menu_items**: 
  - ✅ Lectura pública (cualquiera puede ver el menú)
  - 🔒 Escritura solo para usuarios autenticados

- **reservas**: 
  - ✅ Inserción pública (cualquiera puede hacer reserva)
  - 🔒 Lectura/actualización solo para usuarios autenticados

- **configuracion**: 
  - ✅ Lectura pública
  - 🔒 Escritura solo para usuarios autenticados

---

## 🎨 Próximos Pasos

### Panel de Administración (Siguiente fase)
Crearemos un panel web simple para:
- ✏️ Editar platos de la carta
- 📋 Ver y gestionar reservas
- ⚙️ Actualizar configuración
- 📊 Ver estadísticas

---

## 🧪 Probar la Integración

1. Abre `index.html` en un navegador
2. Ve a la sección de reservas
3. Completa el formulario y envía
4. Ve a Supabase > **Table Editor** > **reservas**
5. ¡Deberías ver tu reserva!

Para probar la carta dinámica:
1. Ve a Supabase > **Table Editor** > **menu_items**
2. Edita el precio de un plato
3. Recarga `carta.html`
4. ¡El precio debería actualizarse automáticamente!

---

## 📞 Soporte

Si tienes algún problema:
1. Verifica que las credenciales en `supabase-config.js` sean correctas
2. Abre la consola del navegador (F12) para ver errores
3. Verifica que el script SQL se haya ejecutado correctamente

---

## 🎉 ¡Listo!

Tu restaurante ahora tiene:
- ✅ Base de datos en la nube (gratis)
- ✅ Carta dinámica
- ✅ Sistema de reservas
- ✅ Multiidioma
- ✅ Escalable y fácil de mantener
