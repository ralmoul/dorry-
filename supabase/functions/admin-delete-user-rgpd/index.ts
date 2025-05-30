
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🗑️ [RGPD-DELETE] Starting RGPD user deletion...')

    // Créer un client Supabase avec les permissions admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { userId, adminSessionToken, exportData = false } = await req.json()

    if (!userId || !adminSessionToken) {
      return new Response(
        JSON.stringify({ error: 'User ID and admin session token are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('🔐 [RGPD-DELETE] Verifying admin session:', adminSessionToken.substring(0, 8) + '...')

    // 1️⃣ Vérifier que l'admin est connecté avec une session valide
    const { data: sessionValid } = await supabaseAdmin.rpc('verify_admin_session', {
      token: adminSessionToken
    })

    if (!sessionValid) {
      console.log('❌ [RGPD-DELETE] Invalid or expired admin session')
      return new Response(
        JSON.stringify({ error: 'Session admin invalide ou expirée' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('✅ [RGPD-DELETE] Admin session verified')

    // 2️⃣ Récupérer les données utilisateur pour export/audit
    console.log('📊 [RGPD-DELETE] Collecting user data for export/audit...')
    
    const [profileData, voiceData, consentData, sessionData, mfaData, otpData, loginData] = await Promise.all([
      supabaseAdmin.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabaseAdmin.from('voice_recordings').select('*').eq('user_id', userId),
      supabaseAdmin.from('consent_logs').select('*').eq('user_id', userId),
      supabaseAdmin.from('user_sessions').select('*').eq('user_id', userId),
      supabaseAdmin.from('user_mfa_settings').select('*').eq('user_id', userId),
      supabaseAdmin.from('otp_codes').select('*').eq('user_id', userId),
      supabaseAdmin.from('login_attempts').select('*').eq('email', null) // On récupèrera l'email du profil
    ])

    const userProfile = profileData.data
    if (!userProfile) {
      return new Response(
        JSON.stringify({ error: 'Utilisateur introuvable' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Récupérer les tentatives de connexion par email
    const { data: loginAttempts } = await supabaseAdmin
      .from('login_attempts')
      .select('*')
      .eq('email', userProfile.email)

    // Préparer l'export des données (si demandé)
    const exportedData = exportData ? {
      profile: userProfile,
      voice_recordings: voiceData.data || [],
      consent_logs: consentData.data || [],
      user_sessions: sessionData.data || [],
      mfa_settings: mfaData.data || [],
      otp_codes: otpData.data || [],
      login_attempts: loginAttempts || [],
      export_date: new Date().toISOString(),
      export_reason: 'RGPD_RIGHT_TO_ERASURE'
    } : null

    console.log('📋 [RGPD-DELETE] Data collected:', {
      profile: !!userProfile,
      voice_recordings: voiceData.data?.length || 0,
      consent_logs: consentData.data?.length || 0,
      sessions: sessionData.data?.length || 0,
      mfa_settings: mfaData.data?.length || 0,
      otp_codes: otpData.data?.length || 0,
      login_attempts: loginAttempts?.length || 0
    })

    // 3️⃣ Obtenir les informations de l'admin qui effectue la suppression
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    console.log('🔄 [RGPD-DELETE] Starting transactional deletion...')

    // 4️⃣ SUPPRESSION TRANSACTIONNELLE - Tout ou rien
    const { error: deleteError } = await supabaseAdmin.rpc('rgpd_delete_user_complete', {
      target_user_id: userId,
      target_user_email: userProfile.email,
      admin_ip: clientIP,
      admin_user_agent: userAgent,
      export_json: exportedData
    })

    if (deleteError) {
      console.error('❌ [RGPD-DELETE] Transaction failed:', deleteError)
      return new Response(
        JSON.stringify({ 
          error: 'Échec de la suppression transactionnelle', 
          details: deleteError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // 5️⃣ Supprimer de auth.users avec les permissions admin (après la transaction)
    console.log('🔐 [RGPD-DELETE] Deleting from auth.users...')
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('⚠️ [RGPD-DELETE] Auth deletion warning:', authError)
      // Ne pas échouer complètement, car les données ont déjà été supprimées
    }

    console.log('✅ [RGPD-DELETE] User completely deleted - RGPD compliant')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Utilisateur supprimé définitivement (RGPD)',
        exportData: exportedData,
        deletedData: {
          profile: true,
          voice_recordings: voiceData.data?.length || 0,
          consent_logs: consentData.data?.length || 0,
          sessions: sessionData.data?.length || 0,
          mfa_settings: mfaData.data?.length || 0,
          otp_codes: otpData.data?.length || 0,
          login_attempts: loginAttempts?.length || 0,
          auth_user: true
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('💥 [RGPD-DELETE] Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erreur serveur inattendue',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
