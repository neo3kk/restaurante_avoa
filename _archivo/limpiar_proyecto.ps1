# 🧹 SCRIPT DE LIMPIEZA - RESTAURANTE AVOA
# Este script elimina archivos obsoletos y reorganiza la estructura del proyecto

Write-Host "🧹 Iniciando limpieza del proyecto..." -ForegroundColor Cyan
Write-Host ""

# Archivos a eliminar
$archivosEliminar = @(
    "SEGURIDAD_OLD.md",
    "admin\login-test.html",
    "admin\login-inline.html"
)

# Contador de archivos eliminados
$eliminados = 0

foreach ($archivo in $archivosEliminar) {
    $rutaCompleta = Join-Path $PSScriptRoot $archivo
    if (Test-Path $rutaCompleta) {
        Write-Host "❌ Eliminando: $archivo" -ForegroundColor Yellow
        Remove-Item $rutaCompleta -Force
        $eliminados++
    } else {
        Write-Host "⚠️  No encontrado: $archivo" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✅ Limpieza completada!" -ForegroundColor Green
Write-Host "📊 Archivos eliminados: $eliminados" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Nota: Los siguientes archivos requieren revisión manual:" -ForegroundColor Yellow
Write-Host "   - pataCalamar.png (mover a assets/images/)" -ForegroundColor White
Write-Host "   - generate_favicon.py (considerar mover a carpeta dev-tools/)" -ForegroundColor White
Write-Host ""
