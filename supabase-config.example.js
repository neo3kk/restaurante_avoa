/**
 * EJEMPLO DE CONFIGURACIÓN DE SUPABASE
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo y renómbralo a: supabase-config.js
 * 2. Ve a tu proyecto en Supabase (https://app.supabase.com)
 * 3. Ve a Settings > API
 * 4. Copia la "Project URL" y pégala en SUPABASE_URL
 * 5. Copia la "anon public" key y pégala en SUPABASE_ANON_KEY
 * 
 * IMPORTANTE: 
 * - NO subas el archivo supabase-config.js a GitHub
 * - Este archivo de ejemplo SÍ puede subirse
 * - La anon key es segura para usar en el frontend
 */

const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

// Inicializar cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);