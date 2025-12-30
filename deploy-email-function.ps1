# Script para desplegar Edge Function de emails
# Ejecutar desde el directorio raiz del proyecto

Write-Host "🚀 DESPLEGANDO EDGE FUNCTION DE EMAILS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "supabase\functions\send-reservation-email\index.ts")) {
    Write-Host "❌ Error: No se encuentra la Edge Function" -ForegroundColor Red
    Write-Host "   Asegurate de estar en el directorio raiz del proyecto" -ForegroundColor Yellow
    exit 1
}

# Verificar que Supabase CLI esta instalado
try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI encontrado: $supabaseVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error: Supabase CLI no esta instalado" -ForegroundColor Red
    Write-Host "   Instala con: scoop install supabase" -ForegroundColor Yellow
    Write-Host "   O descarga desde: https://github.com/supabase/cli/releases" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 INFORMACION NECESARIA:" -ForegroundColor Yellow
Write-Host "   1. Project Reference ID (Settings → General → Reference ID)" -ForegroundColor White
Write-Host "   2. Variables de entorno configuradas en Supabase:" -ForegroundColor White
Write-Host "      - EMAIL_PROVIDER (resend o brevo)" -ForegroundColor White
Write-Host "      - RESEND_API_KEY o BREVO_API_KEY" -ForegroundColor White
Write-Host ""

# Solicitar Project Reference
$projectRef = Read-Host "Ingresa tu Project Reference ID"

if ([string]::IsNullOrWhiteSpace($projectRef)) {
    Write-Host "❌ Error: Project Reference ID es requerido" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔐 Iniciando sesion en Supabase..." -ForegroundColor Cyan

try {
    supabase login
}
catch {
    Write-Host "❌ Error al iniciar sesion" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Desplegando funcion send-reservation-email..." -ForegroundColor Cyan

try {
    supabase functions deploy send-reservation-email --project-ref $projectRef
    Write-Host ""
    Write-Host "✅ ¡Edge Function desplegada exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 PROXIMOS PASOS:" -ForegroundColor Yellow
    Write-Host "   1. Verifica las variables de entorno en Supabase" -ForegroundColor White
    Write-Host "   2. Haz una reserva de prueba" -ForegroundColor White
    Write-Host "   3. Verifica que recibes el email" -ForegroundColor White
    Write-Host "   4. Revisa los logs: supabase functions logs send-reservation-email" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host "❌ Error al desplegar la funcion" -ForegroundColor Red
    Write-Host "   Revisa el error anterior y verifica:" -ForegroundColor Yellow
    Write-Host "   - Que el Project Reference ID es correcto" -ForegroundColor White
    Write-Host "   - Que tienes permisos en el proyecto" -ForegroundColor White
    Write-Host "   - Que estas conectado a internet" -ForegroundColor White
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 DESPLIEGUE COMPLETADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
