# Script de Organización de Documentación
# Restaurante Avoa - Preparación para Producción

Write-Host "📁 Organizando documentación..." -ForegroundColor Cyan
Write-Host ""

# Crear estructura de carpetas
$folders = @("docs", "docs/auditorias", "docs/configuracion", "docs/guias")
foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
        Write-Host "✅ Creada carpeta: $folder" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📦 Moviendo archivos de auditoría..." -ForegroundColor Cyan

# AUDITORÍAS - Mover a docs/auditorias
$auditorias = @(
    "AUDITORIA_CODIGO.md",
    "AUDITORIA_SEGURIDAD.md",
    "INFORME_AUDITORIA_EJECUTADA.md",
    "REVISION_FINAL_SEGURIDAD.md",
    "CORRECCIONES_APLICADAS.md"
)

foreach ($file in $auditorias) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "docs/auditorias/" -Force
        Write-Host "  ✅ $file → docs/auditorias/" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "⚙️ Moviendo archivos de configuración..." -ForegroundColor Cyan

# CONFIGURACIÓN - Mover a docs/configuracion
$configuracion = @(
    "GUIA_CONFIGURACION.md",
    "GUIA_ROBOTS_TXT.md",
    "NOTA_HTACCESS.md",
    "README_SUPABASE.md",
    "README_MULTIIDIOMA.md"
)

foreach ($file in $configuracion) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "docs/configuracion/" -Force
        Write-Host "  ✅ $file → docs/configuracion/" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📖 Moviendo guías..." -ForegroundColor Cyan

# GUÍAS - Mover a docs/guias
$guias = @(
    "GUIA_DESPLIEGUE_RECAPTCHA.md",
    "ESTRATEGIA_SEO.md",
    "SEGURIDAD.md",
    "INICIO_RAPIDO.md"
)

foreach ($file in $guias) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "docs/guias/" -Force
        Write-Host "  ✅ $file → docs/guias/" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✅ Organización completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Estructura final:" -ForegroundColor Cyan
Write-Host "  📁 docs/" -ForegroundColor White
Write-Host "    📁 auditorias/     - Informes de auditoría y seguridad" -ForegroundColor Gray
Write-Host "    📁 configuracion/  - Guías de configuración" -ForegroundColor Gray
Write-Host "    📁 guias/          - Guías de uso y SEO" -ForegroundColor Gray
Write-Host ""
Write-Host "📄 README.md permanece en la raíz del proyecto" -ForegroundColor Yellow
Write-Host ""
