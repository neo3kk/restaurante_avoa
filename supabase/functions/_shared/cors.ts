/**
 * CORS Headers compartidos para Edge Functions
 * Permite que el frontend haga peticiones a las Edge Functions
 */

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // En producción, cambiar a tu dominio específico
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
