import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/@resend/node@0.16.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailPayload {
  to: string
  password: string
  firstName: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail = Deno.env.get('FROM_EMAIL')

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not set')
      throw new Error('Clé API Resend manquante')
    }

    if (!fromEmail) {
      console.error('FROM_EMAIL is not set')
      throw new Error('Adresse d\'expédition manquante')
    }

    const payload: EmailPayload = await req.json()
    const { to, password, firstName } = payload

    console.log('Sending email to:', to)

    const resend = new Resend(resendApiKey)

    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bienvenue sur la Plateforme e_OSC Sénégal </title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Bienvenue sur la Plateforme e_OSC Sénégal </h2>
            
            <p>Bonjour ${firstName},</p>
            
            <p>Votre compte a été créé avec succès sur la Plateforme e_OSC Sénégal.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Vos identifiants de connexion :</strong></p>
              <p style="margin: 10px 0;">Email: ${to}</p>
              <p style="margin: 10px 0;">Mot de passe : ${password}</p>
            </div>
            
            <p style="color: #dc2626;"><strong>Important :</strong> Pour des raisons de sécurité, vous pouvez choisir de changer votre mot de passe lors de votre première connexion.</p>
            
            <p>Si vous rencontrez des difficultés pour vous connecter, n'hésitez pas à contacter l'équipe support.</p>
            
            <p style="margin-top: 30px;">Cordialement,<br>L'équipe de la Plateforme e_OSC Sénégal </p>
          </div>
        </body>
      </html>
    `

    console.log('Sending email via Resend...')
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: to,
      subject: 'Bienvenue sur la Plateforme e_OSC Sénégal',
      html: emailContent
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(
      JSON.stringify({ 
        message: 'Email envoyé avec succès',
        data 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'envoi de l\'email',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})