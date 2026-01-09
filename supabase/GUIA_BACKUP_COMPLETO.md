# 📦 GUÍA COMPLETA DE BACKUP DE SUPABASE

## 🎯 Componentes del Proyecto

Tu proyecto Supabase tiene estos componentes:

### 1. **Base de Datos PostgreSQL**
- ✅ Estructura (tablas, índices)
- ✅ Funciones SQL
- ✅ Triggers
- ✅ Políticas RLS
- ✅ Datos

### 2. **Edge Functions** (si las tienes)
- ✅ Código TypeScript/JavaScript
- ✅ Configuración

### 3. **Storage** (si lo usas)
- ✅ Buckets
- ✅ Archivos subidos

### 4. **Auth**
- ✅ Configuración
- ✅ Usuarios (en la base de datos)

---

## 📋 PROCESO DE BACKUP COMPLETO

### **Paso 1: Backup de la Estructura de la Base de Datos**

**Archivo:** `backup_estructura_completa.sql`

Este archivo contiene:
- ✅ Definición de todas las tablas
- ✅ Índices
- ✅ Funciones SQL
- ✅ Triggers
- ✅ Políticas RLS

**Cómo usarlo:**
1. Ya está creado en `supabase/backup_estructura_completa.sql`
2. Este archivo se puede ejecutar para recrear toda la estructura

---

### **Paso 2: Backup de los Datos**

**Archivo:** `backup_manual.sql`

**Cómo ejecutarlo:**
1. Ve a Supabase SQL Editor
2. Ejecuta la sección "ALTERNATIVA: GENERAR INSERTS"
3. Copia el resultado
4. Guárdalo como `backup_datos_YYYYMMDD.sql`

**Resultado:** Archivo con todos los INSERT statements

---

### **Paso 3: Backup de Edge Functions** (si las tienes)

**Ubicación en Supabase:**
- Dashboard → Edge Functions

**Cómo hacer backup:**
1. Ve a cada Edge Function
2. Copia el código
3. Guárdalo en `supabase/functions/nombre_funcion/index.ts`

**Ejemplo de estructura:**
```
supabase/
  functions/
    send-email/
      index.ts
      deno.json
```

---

### **Paso 4: Backup de Configuración de Auth**

**Ubicación en Supabase:**
- Dashboard → Authentication → Settings

**Qué guardar:**
1. Providers habilitados (Email, Google, etc.)
2. Configuración de Email Templates
3. Redirect URLs
4. JWT Settings

**Cómo guardarlo:**
- Toma screenshots de la configuración
- O crea un documento con los valores

---

### **Paso 5: Backup de Storage** (si lo usas)

**Ubicación en Supabase:**
- Dashboard → Storage

**Cómo hacer backup:**
1. Descarga los archivos manualmente
2. O usa la API de Supabase Storage para descargarlos

---

## 🗂️ ESTRUCTURA DE BACKUP RECOMENDADA

```
backups/
  2026-01-09/
    ├── estructura_completa.sql       # Estructura de DB
    ├── datos.sql                      # Datos (INSERTs)
    ├── edge_functions/                # Funciones serverless
    │   └── send-email/
    │       └── index.ts
    ├── auth_config.md                 # Configuración de Auth
    └── storage/                       # Archivos de Storage
        └── avatars/
```

---

## ⚡ PROCESO RÁPIDO DE BACKUP SEMANAL

### **Opción A: Backup Mínimo** (5 minutos)
1. Ejecuta `backup_manual.sql` en Supabase SQL Editor
2. Copia el resultado
3. Guárdalo como `backup_YYYYMMDD.sql`

### **Opción B: Backup Completo** (15 minutos)
1. Copia `backup_estructura_completa.sql` (ya está hecho)
2. Ejecuta `backup_manual.sql` para datos
3. Copia código de Edge Functions (si las tienes)
4. Guarda todo en una carpeta con fecha

---

## 🔄 RESTAURACIÓN DESDE BACKUP

### **Restaurar en un Proyecto Nuevo:**

1. **Crear nuevo proyecto en Supabase**

2. **Restaurar estructura:**
   ```sql
   -- Ejecuta backup_estructura_completa.sql
   ```

3. **Restaurar datos:**
   ```sql
   -- Ejecuta backup_datos_YYYYMMDD.sql
   ```

4. **Restaurar Edge Functions:**
   - Sube cada función manualmente
   - O usa Supabase CLI

5. **Configurar Auth:**
   - Configura providers
   - Configura email templates

---

## 📝 CHECKLIST DE BACKUP

### **Backup Semanal:**
- [ ] Ejecutar `backup_manual.sql`
- [ ] Guardar resultado con fecha
- [ ] Subir a Google Drive/Dropbox

### **Backup Mensual:**
- [ ] Backup semanal
- [ ] Verificar `backup_estructura_completa.sql` está actualizado
- [ ] Backup de Edge Functions (si las tienes)
- [ ] Screenshot de configuración de Auth

### **Antes de Cambios Importantes:**
- [ ] Backup completo
- [ ] Probar restauración en proyecto de prueba

---

## 🎯 ARCHIVOS CREADOS PARA TI

1. **`backup_estructura_completa.sql`**
   - Estructura completa de la base de datos
   - Funciones, triggers, RLS
   - Listo para ejecutar

2. **`backup_manual.sql`**
   - Script para exportar datos
   - Genera INSERT statements
   - Ejecutar en Supabase SQL Editor

---

## 💡 RECOMENDACIÓN FINAL

**Para la versión Free de Supabase:**

1. **Cada Domingo:**
   - Ejecuta `backup_manual.sql`
   - Guarda el resultado

2. **Cada Mes:**
   - Verifica que `backup_estructura_completa.sql` esté actualizado
   - Haz un backup completo

3. **Guarda los backups en:**
   - Google Drive (carpeta "Backups Supabase")
   - O GitHub (repositorio privado)

4. **Mantén:**
   - Últimas 4 semanas: todos los backups
   - Últimos 6 meses: backup mensual
   - Último año: backup trimestral

---

## ⚠️ IMPORTANTE

- ✅ Los backups NO incluyen usuarios de Auth (están en la DB)
- ✅ Los backups NO incluyen archivos de Storage
- ✅ Los backups NO incluyen configuración de Auth
- ✅ Guarda las credenciales de Supabase por separado

---

## 🆘 EN CASO DE EMERGENCIA

Si pierdes todo el proyecto:

1. Crea nuevo proyecto en Supabase
2. Ejecuta `backup_estructura_completa.sql`
3. Ejecuta `backup_datos_YYYYMMDD.sql`
4. Reconfigura Auth manualmente
5. Sube Edge Functions (si las tienes)
6. Actualiza las credenciales en tu app

**Tiempo estimado de restauración:** 30-60 minutos
