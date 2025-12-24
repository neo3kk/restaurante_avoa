/**
 * FIX: Alias para compatibilidad del panel de administración
 * Este archivo añade un alias global para que admin-auth.js funcione correctamente
 */

// Esperar a que supabaseClient esté disponible
if (typeof window.supabaseClient !== 'undefined') {
    window.supabase = window.supabaseClient;
    console.log('✅ Alias supabase creado correctamente');
} else {
    // Si aún no está disponible, esperar un momento
    setTimeout(() => {
        if (typeof window.supabaseClient !== 'undefined') {
            window.supabase = window.supabaseClient;
            console.log('✅ Alias supabase creado correctamente (delayed)');
        } else {
            console.error('❌ Error: supabaseClient no está disponible');
        }
    }, 100);
}
