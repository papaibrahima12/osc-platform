import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables')
    }

    const { email, userData } = await req.json()

    if (!email || !userData.first_name || !userData.last_name || !userData.role) {
      throw new Error('Tous les champs sont requis')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Format d\'email invalide')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data: existingUser, error: existingUserError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingUserError) {
      console.error('Error checking existing user:', existingUserError)
      throw new Error('Erreur lors de la vérification de l\'utilisateur')
    }

    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà')
    }

    const defaultPassword = 'passer2025'

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        force_password_change: true
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      if (authError.message.includes('already exists')) {
        throw new Error('Un utilisateur avec cet email existe déjà')
      }
      throw new Error('Erreur lors de la création du compte')
    }

    if (!authData.user) {
      throw new Error('Erreur lors de la création du compte')
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      console.error('Profile error:', profileError)
      throw new Error('Erreur lors de la création du profil')
    }

    try {
      await supabaseAdmin.functions.invoke('send-welcome-email', {
        body: {
          to: email,
          password: defaultPassword,
          firstName: userData.first_name
        }
      })
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError)
    }

    return new Response(
      JSON.stringify({
        profile,
        message: 'Utilisateur créé avec succès'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200,
      }
    )
  } catch (error: any) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Une erreur est survenue lors de la création de l\'utilisateur'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400,
      }
    )
  }
})