// Edge Function para enviar emails de reserva
// Soporta Resend y Brevo

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  reservaId: string
  tipo: 'recibida' | 'confirmada' | 'notificacion' | 'recordatorio' | 'cancelacion'
}

interface ReservaData {
  id: string
  nombre: string
  email: string
  telefono: string
  fecha: string
  hora: string
  personas: number
  comentarios: string | null
  idioma: string
  token_confirmacion: string
}

// Plantillas de email en HTML
const getEmailTemplate = (tipo: string, reserva: ReservaData, idioma: string) => {
  const translations = {
    es: {
      recibida_subject: '📝 Reserva recibida - Restaurante Avoa',
      confirmada_subject: '✅ Reserva confirmada - Restaurante Avoa',
      notificacion_subject: '🔔 Nueva reserva pendiente de confirmar - Restaurante Avoa',
      recordatorio_subject: '⏰ Recordatorio de tu reserva - Restaurante Avoa',
      cancelacion_subject: '❌ Reserva cancelada - Restaurante Avoa',
      hola: 'Hola',
      gracias_recibida: 'Gracias por tu reserva en Restaurante Avoa',
      gracias_confirmada: '¡Tu reserva ha sido confirmada!',
      pendiente_confirmacion: 'Hemos recibido tu solicitud de reserva. Te confirmaremos en breve.',
      reserva_confirmada: 'Nos complace confirmar tu reserva en nuestro restaurante.',
      detalles: 'Detalles de tu reserva',
      fecha: 'Fecha',
      hora: 'Hora',
      personas: 'Personas',
      comentarios: 'Comentarios',
      estado: 'Estado',
      pendiente: 'Pendiente de confirmación',
      confirmada: 'Confirmada',
      recordatorio_texto: 'Te recordamos que tienes una reserva mañana en nuestro restaurante.',
      cancelacion_texto: 'Tu reserva ha sido cancelada.',
      contacto: 'Si tienes alguna pregunta, contáctanos',
      telefono: 'Teléfono',
      email: 'Email',
      direccion: 'Dirección',
      saludos: 'Saludos cordiales',
      equipo: 'El equipo de Restaurante Avoa',
      nueva_reserva: 'Nueva reserva recibida',
      accion_requerida: 'Acción requerida: Confirmar o rechazar',
      cliente: 'Cliente',
      ir_panel: 'Ir al panel de administración'
    },
    ca: {
      recibida_subject: '📝 Reserva rebuda - Restaurante Avoa',
      confirmada_subject: '✅ Reserva confirmada - Restaurante Avoa',
      notificacion_subject: '🔔 Nova reserva pendent de confirmar - Restaurante Avoa',
      recordatorio_subject: '⏰ Recordatori de la teva reserva - Restaurante Avoa',
      cancelacion_subject: '❌ Reserva cancel·lada - Restaurante Avoa',
      hola: 'Hola',
      gracias_recibida: 'Gràcies per la teva reserva a Restaurante Avoa',
      gracias_confirmada: 'La teva reserva ha estat confirmada!',
      pendiente_confirmacion: 'Hem rebut la teva sol·licitud de reserva. Et confirmarem aviat.',
      reserva_confirmada: 'Ens plau confirmar la teva reserva al nostre restaurant.',
      detalles: 'Detalls de la teva reserva',
      fecha: 'Data',
      hora: 'Hora',
      personas: 'Persones',
      comentarios: 'Comentaris',
      estado: 'Estat',
      pendiente: 'Pendent de confirmació',
      confirmada: 'Confirmada',
      recordatorio_texto: 'Et recordem que tens una reserva demà al nostre restaurant.',
      cancelacion_texto: 'La teva reserva ha estat cancel·lada.',
      contacto: 'Si tens alguna pregunta, contacta\'ns',
      telefono: 'Telèfon',
      email: 'Email',
      direccion: 'Adreça',
      saludos: 'Salutacions cordials',
      equipo: 'L\'equip de Restaurante Avoa',
      nueva_reserva: 'Nova reserva rebuda',
      accion_requerida: 'Acció requerida: Confirmar o rebutjar',
      cliente: 'Client',
      ir_panel: 'Anar al panell d\'administració'
    },
    en: {
      recibida_subject: '📝 Reservation received - Restaurante Avoa',
      confirmada_subject: '✅ Reservation confirmed - Restaurante Avoa',
      notificacion_subject: '🔔 New reservation pending confirmation - Restaurante Avoa',
      recordatorio_subject: '⏰ Reservation reminder - Restaurante Avoa',
      cancelacion_subject: '❌ Reservation cancelled - Restaurante Avoa',
      hola: 'Hello',
      gracias_recibida: 'Thank you for your reservation at Restaurante Avoa',
      gracias_confirmada: 'Your reservation has been confirmed!',
      pendiente_confirmacion: 'We have received your reservation request. We will confirm shortly.',
      reserva_confirmada: 'We are pleased to confirm your reservation at our restaurant.',
      detalles: 'Reservation details',
      fecha: 'Date',
      hora: 'Time',
      personas: 'People',
      comentarios: 'Comments',
      estado: 'Status',
      pendiente: 'Pending confirmation',
      confirmada: 'Confirmed',
      recordatorio_texto: 'We remind you that you have a reservation tomorrow at our restaurant.',
      cancelacion_texto: 'Your reservation has been cancelled.',
      contacto: 'If you have any questions, contact us',
      telefono: 'Phone',
      email: 'Email',
      direccion: 'Address',
      saludos: 'Best regards',
      equipo: 'The Restaurante Avoa team',
      nueva_reserva: 'New reservation received',
      accion_requerida: 'Action required: Confirm or reject',
      cliente: 'Customer',
      ir_panel: 'Go to admin panel'
    }
  }

  const t = translations[idioma as keyof typeof translations] || translations.es
  const adminUrl = `https://restauranteavoa.com/admin/reservas.html`

  const baseTemplate = `
    <!DOCTYPE html>
    <html lang="${idioma}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 3px solid #2c5f8d;
        }
        .header h1 {
          color: #2c5f8d;
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 20px 0;
        }
        .details {
          background-color: #f8f9fa;
          border-left: 4px solid #2c5f8d;
          padding: 15px;
          margin: 20px 0;
        }
        .details p {
          margin: 8px 0;
        }
        .details strong {
          color: #2c5f8d;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 14px;
        }
        .status-pending {
          background-color: #fef3c7;
          color: #92400e;
        }
        .status-confirmed {
          background-color: #d1fae5;
          color: #065f46;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #2c5f8d;
          color: white !important;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .button:hover {
          background-color: #1e4563;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 14px;
        }
        .contact-info {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .contact-info p {
          margin: 5px 0;
        }
        .alert-box {
          background-color: #fef2f2;
          border-left: 4px solid #dc2626;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍽️ Restaurante Avoa</h1>
          <p style="color: #666; margin: 5px 0;">Pescado y Marisco Fresco de Galicia</p>
        </div>
        <div class="content">
          ${tipo === 'notificacion' ? `
            <p><strong>Hola Equipo,</strong></p>
          ` : `
            <p><strong>${t.hola} ${reserva.nombre},</strong></p>
          `}
          
          ${tipo === 'recibida' ? `
            <p>${t.gracias_recibida}</p>
            <p>${t.pendiente_confirmacion}</p>
          ` : ''}
          
          ${tipo === 'confirmada' ? `
            <p>${t.gracias_confirmada}</p>
            <p>${t.reserva_confirmada}</p>
          ` : ''}
          
          ${tipo === 'notificacion' ? `
            <p><strong>${t.nueva_reserva}</strong></p>
            <p>${t.accion_requerida}</p>
          ` : ''}
          
          ${tipo === 'recordatorio' ? `<p>${t.recordatorio_texto}</p>` : ''}
          ${tipo === 'cancelacion' ? `<p>${t.cancelacion_texto}</p>` : ''}
          
          <div class="details">
            <h3 style="margin-top: 0; color: #2c5f8d;">${t.detalles}:</h3>
            ${tipo === 'notificacion' ? `<p><strong>${t.cliente}:</strong> ${reserva.nombre}</p>` : ''}
            ${tipo === 'notificacion' ? `<p><strong>${t.email}:</strong> ${reserva.email}</p>` : ''}
            ${tipo === 'notificacion' ? `<p><strong>${t.telefono}:</strong> ${reserva.telefono}</p>` : ''}
            <p><strong>${t.fecha}:</strong> ${new Date(reserva.fecha).toLocaleDateString(idioma)}</p>
            <p><strong>${t.hora}:</strong> ${reserva.hora}</p>
            <p><strong>${t.personas}:</strong> ${reserva.personas}</p>
            ${reserva.comentarios ? `<p><strong>${t.comentarios}:</strong> ${reserva.comentarios}</p>` : ''}
            ${tipo === 'recibida' || tipo === 'confirmada' ? `
              <p><strong>${t.estado}:</strong> 
                <span class="status-badge ${tipo === 'recibida' ? 'status-pending' : 'status-confirmed'}">
                  ${tipo === 'recibida' ? t.pendiente : t.confirmada}
                </span>
              </p>
            ` : ''}
          </div>
          
          ${tipo === 'notificacion' ? `
            <div style="text-align: center;">
              <a href="${adminUrl}" class="button">${t.ir_panel}</a>
            </div>
          ` : ''}
          
          <div class="contact-info">
            <p><strong>${t.contacto}:</strong></p>
            <p>📞 ${t.telefono}: +34 659 02 13 02 | +34 971 28 83 60</p>
            <p>📧 ${t.email}: reservas@restauranteavoa.com</p>
            <p>📍 ${t.direccion}: Avinguda de l'Argentina, 59, Palma</p>
          </div>
        </div>
        <div class="footer">
          <p>${t.saludos},<br><strong>${t.equipo}</strong></p>
          <p style="font-size: 12px; color: #999;">© 2024 Restaurante Avoa. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return {
    subject: t[`${tipo}_subject` as keyof typeof t] as string,
    html: baseTemplate
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reservaId, tipo }: EmailRequest = await req.json()

    // Crear cliente de Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Obtener datos de la reserva
    const { data: reserva, error: reservaError } = await supabaseClient
      .from('reservas')
      .select('*')
      .eq('id', reservaId)
      .single()

    if (reservaError || !reserva) {
      throw new Error('Reserva no encontrada')
    }

    const reservaData: ReservaData = reserva

    // Determinar idioma del email según el tipo
    // - Emails al cliente: en su idioma preferido
    // - Emails al restaurante (notificaciones): siempre en español
    const idiomaEmail = tipo === 'notificacion' ? 'es' : reservaData.idioma

    // Generar plantilla de email
    const { subject, html } = getEmailTemplate(tipo, reservaData, idiomaEmail)

    // Determinar destinatario según el tipo
    let to: string
    let emailLog: any = {
      reserva_id: reservaId,
      tipo: tipo,
      asunto: subject,
      enviado: false,
      error: null
    }

    if (tipo === 'notificacion') {
      // Email al restaurante (siempre en español)
      to = 'reservas@restauranteavoa.com'
      emailLog.destinatario = to
    } else {
      // Email al cliente (en su idioma)
      to = reservaData.email
      emailLog.destinatario = to
    }

    // Enviar email usando Resend o Brevo
    const emailProvider = Deno.env.get('EMAIL_PROVIDER') || 'resend'
    let emailSent = false
    let emailError = null

    if (emailProvider === 'resend') {
      // OPCIÓN 1: RESEND (Recomendado)
      const resendApiKey = Deno.env.get('RESEND_API_KEY')

      if (!resendApiKey) {
        throw new Error('RESEND_API_KEY no configurada')
      }

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Restaurante Avoa <reservas@restauranteavoa.com>',
          to: [to],
          subject: subject,
          html: html
        })
      })

      if (resendResponse.ok) {
        const resendData = await resendResponse.json()
        emailLog.resend_id = resendData.id
        emailSent = true
      } else {
        const errorData = await resendResponse.json()
        emailError = errorData.message || 'Error al enviar email con Resend'
      }
    } else if (emailProvider === 'brevo') {
      // OPCIÓN 2: BREVO
      const brevoApiKey = Deno.env.get('BREVO_API_KEY')

      if (!brevoApiKey) {
        throw new Error('BREVO_API_KEY no configurada')
      }

      const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: 'Restaurante Avoa',
            email: 'reservas@restauranteavoa.com'
          },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html
        })
      })

      if (brevoResponse.ok) {
        const brevoData = await brevoResponse.json()
        emailLog.resend_id = brevoData.messageId
        emailSent = true
      } else {
        const errorData = await brevoResponse.json()
        emailError = errorData.message || 'Error al enviar email con Brevo'
      }
    }

    // Actualizar log de email
    emailLog.enviado = emailSent
    emailLog.error = emailError

    await supabaseClient
      .from('email_logs')
      .insert([emailLog])

    if (!emailSent) {
      throw new Error(emailError || 'Error al enviar email')
    }

    // Si es email de reserva recibida, actualizar estado de la reserva
    if (tipo === 'recibida' && emailSent) {
      await supabaseClient
        .from('reservas')
        .update({ email_enviado: true })
        .eq('id', reservaId)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email enviado correctamente',
        emailId: emailLog.resend_id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
