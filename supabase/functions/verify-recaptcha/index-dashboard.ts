/**
 * SUPABASE EDGE FUNCTION: Verificación de reCAPTCHA v3
 * 
 * Copia este código completo en el editor de Supabase Dashboard
 */

// Configuración CORS
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Configuración
const RECAPTCHA_SECRET_KEY = Deno.env.get('RECAPTCHA_SECRET_KEY');
const MIN_SCORE = 0.5; // Score mínimo aceptable (0.0 = bot, 1.0 = humano)

Deno.serve(async (req) => {
    // Manejar CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Verificar que la clave secreta esté configurada
        if (!RECAPTCHA_SECRET_KEY) {
            console.error('❌ RECAPTCHA_SECRET_KEY no configurada');
            return new Response(
                JSON.stringify({
                    error: 'Configuración de servidor incompleta',
                    valid: false
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Obtener el token del request
        const { token } = await req.json();

        if (!token) {
            return new Response(
                JSON.stringify({
                    error: 'Token de reCAPTCHA no proporcionado',
                    valid: false
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Verificar el token con Google
        console.log('🔍 Verificando token de reCAPTCHA...');

        const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
        const verifyBody = new URLSearchParams({
            secret: RECAPTCHA_SECRET_KEY,
            response: token
        });

        const verifyResponse = await fetch(verifyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: verifyBody.toString()
        });

        const verifyData = await verifyResponse.json();

        // Logging para debugging
        console.log('📊 Resultado de verificación:', {
            success: verifyData.success,
            score: verifyData.score,
            action: verifyData.action,
            challenge_ts: verifyData.challenge_ts,
            hostname: verifyData.hostname
        });

        // Verificar el resultado
        if (!verifyData.success) {
            console.warn('⚠️ Verificación fallida:', verifyData['error-codes']);
            return new Response(
                JSON.stringify({
                    valid: false,
                    error: 'Token de reCAPTCHA inválido',
                    details: verifyData['error-codes']
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Verificar el score (solo para reCAPTCHA v3)
        if (verifyData.score !== undefined) {
            if (verifyData.score < MIN_SCORE) {
                console.warn(`⚠️ Score bajo detectado: ${verifyData.score} (mínimo: ${MIN_SCORE})`);
                return new Response(
                    JSON.stringify({
                        valid: false,
                        error: 'Actividad sospechosa detectada',
                        score: verifyData.score
                    }),
                    {
                        status: 403,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    }
                );
            }
        }

        // Verificación exitosa
        console.log(`✅ Verificación exitosa - Score: ${verifyData.score}`);
        return new Response(
            JSON.stringify({
                valid: true,
                score: verifyData.score,
                action: verifyData.action,
                hostname: verifyData.hostname
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('❌ Error en verificación de reCAPTCHA:', error);
        return new Response(
            JSON.stringify({
                error: 'Error interno del servidor',
                valid: false,
                details: error.message
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});
