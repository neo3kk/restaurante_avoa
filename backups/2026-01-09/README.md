# 📦 Backup Completo - 2026-01-09

## 📋 Contenido del Backup

### ✅ Archivos Incluidos:

1. **`1_estructura_completa.sql`**
   - Definición de todas las tablas
   - Índices
   - Funciones SQL
   - Triggers
   - Políticas RLS (Row Level Security)

2. **`2_datos.sql`**
   - INSERT statements para todas las tablas
   - Categorías (8)
   - Menu Items (68)
   - Reservas (todas)
   - Configuración

3. **`README.md`** (este archivo)
   - Información del backup
   - Instrucciones de restauración

---

## 📊 Estado del Proyecto

### Base de Datos:
- **Categorías:** 8
- **Platos/Items:** 68
- **Reservas:** Ver en datos
- **Configuración:** Ver en datos

### Tablas:
- ✅ `categorias_disponibilidad`
- ✅ `menu_items`
- ✅ `reservas`
- ✅ `email_logs`
- ✅ `configuracion`
- ✅ `subcategorias_vinos`

---

## 🔄 Cómo Restaurar Este Backup

### En un Proyecto Nuevo de Supabase:

1. **Crear nuevo proyecto en Supabase**

2. **Restaurar estructura:**
   - Abre SQL Editor en Supabase
   - Copia y pega `1_estructura_completa.sql`
   - Ejecuta (Run)

3. **Restaurar datos:**
   - Abre SQL Editor en Supabase
   - Copia y pega `2_datos.sql`
   - Ejecuta (Run)

4. **Verificar:**
   ```sql
   SELECT COUNT(*) FROM categorias_disponibilidad;
   SELECT COUNT(*) FROM menu_items;
   SELECT COUNT(*) FROM reservas;
   ```

---

## ⚠️ Notas Importantes

- Este backup NO incluye:
  - ❌ Edge Functions (si las tienes)
  - ❌ Configuración de Auth
  - ❌ Archivos de Storage
  - ❌ Usuarios de Auth (están en auth.users)

- Este backup SÍ incluye:
  - ✅ Toda la estructura de la base de datos
  - ✅ Todos los datos de las tablas
  - ✅ Funciones, triggers y políticas RLS

---

## 📅 Información del Backup

- **Fecha:** 2026-01-09
- **Hora:** 22:38 (CET)
- **Proyecto:** Restaurante Avoa
- **Versión Supabase:** Free Tier
- **Creado por:** Backup manual

---

## 🆘 En Caso de Problemas

Si tienes problemas al restaurar:

1. Verifica que el proyecto de Supabase esté vacío
2. Ejecuta primero `1_estructura_completa.sql`
3. Luego ejecuta `2_datos.sql`
4. Si hay errores de UUID, verifica que los IDs sean únicos

---

## 📝 Checklist de Restauración

- [ ] Crear nuevo proyecto en Supabase
- [ ] Ejecutar `1_estructura_completa.sql`
- [ ] Verificar que las tablas se crearon
- [ ] Ejecutar `2_datos.sql`
- [ ] Verificar conteo de registros
- [ ] Probar la aplicación
- [ ] Configurar Auth (si es necesario)
- [ ] Actualizar credenciales en la app

---

## 💾 Almacenamiento Recomendado

Guarda este backup en:
- ✅ Google Drive
- ✅ Dropbox
- ✅ GitHub (repositorio privado)
- ✅ Disco duro externo

**Mantén al menos 3 copias en diferentes ubicaciones.**
