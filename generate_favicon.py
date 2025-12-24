"""
Generador de favicon.ico
Convierte una imagen PNG a favicon.ico con múltiples tamaños
"""

from PIL import Image
import os

def create_favicon(input_path, output_path):
    """
    Crea un favicon.ico con múltiples tamaños desde una imagen PNG
    """
    try:
        # Abrir imagen original
        img = Image.open(input_path)
        
        # Convertir a RGBA si no lo está
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Tamaños estándar para favicon.ico
        sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
        
        # Crear lista de imágenes redimensionadas
        icon_images = []
        for size in sizes:
            # Redimensionar con antialiasing de alta calidad
            resized = img.resize(size, Image.Resampling.LANCZOS)
            icon_images.append(resized)
        
        # Guardar como favicon.ico
        icon_images[0].save(
            output_path,
            format='ICO',
            sizes=sizes,
            append_images=icon_images[1:]
        )
        
        print(f"✅ Favicon creado exitosamente: {output_path}")
        print(f"📏 Tamaños incluidos: {', '.join([f'{s[0]}x{s[1]}' for s in sizes])}")
        
        # Mostrar tamaño del archivo
        file_size = os.path.getsize(output_path)
        print(f"📦 Tamaño del archivo: {file_size / 1024:.2f} KB")
        
        return True
        
    except Exception as e:
        print(f"❌ Error al crear favicon: {e}")
        return False

if __name__ == "__main__":
    # Rutas
    input_file = "assets/favicon-source.png"
    output_file = "favicon.ico"
    
    # Verificar que existe el archivo de entrada
    if not os.path.exists(input_file):
        print(f"❌ Error: No se encuentra el archivo {input_file}")
        print("💡 Asegúrate de que existe assets/favicon-source.png")
        exit(1)
    
    # Crear favicon
    print("🎨 Generando favicon.ico...")
    success = create_favicon(input_file, output_file)
    
    if success:
        print("\n✨ ¡Favicon generado con éxito!")
        print(f"📍 Ubicación: {os.path.abspath(output_file)}")
        print("\n📝 Próximos pasos:")
        print("1. Verifica que favicon.ico esté en la raíz del proyecto")
        print("2. Recarga tu navegador con Ctrl+Shift+R")
        print("3. El favicon debería aparecer en la pestaña del navegador")
    else:
        print("\n❌ No se pudo generar el favicon")
        print("💡 Asegúrate de tener instalado Pillow: pip install Pillow")
