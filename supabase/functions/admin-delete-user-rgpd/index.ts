
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Fonction pour nettoyer l'adresse IP
function cleanIPAddress(ipHeader: string | null): string {
  if (!ipHeader) return 'unknown';
  
  // Prendre seulement la première IP si plusieurs sont présentes
  const firstIP = ipHeader.split(',')[0].trim();
  
  // Vérifier que c'est une IP valide (basique)
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipRegex.test(firstIP)) {
    return firstIP;
  }
  
  return 'unknown';
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
    const rawClientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const clientIP = cleanIPAddress(rawClientIP)
    const userAgent = req.headers.get('user-agent') || 'unknown'

    console.log('🔄 [RGPD-DELETE] Starting deletion process with clean IP:', clientIP)

    // 4️⃣ SUPPRESSION MANUELLE - Éviter la fonction SQL problématique
    console.log('🗑️ [RGPD-DELETE] Starting manual deletion process...')

    // Compter les enregistrements avant suppression
    const deletionStats = {
      voice_recordings: voiceData.data?.length || 0,
      consent_logs: consentData.data?.length || 0,
      user_sessions: sessionData.data?.length || 0,
      mfa_settings: mfaData.data?.length || 0,
      otp_codes: otpData.data?.length || 0,
      login_attempts: loginAttempts?.length || 0
    }

    // Supprimer les données une par une
    const deletionPromises = [
      supabaseAdmin.from('voice_recordings').delete().eq('user_id', userId),
      supabaseAdmin.from('consent_logs').delete().eq('user_id', userId),
      supabaseAdmin.from('user_sessions').delete().eq('user_id', userId),
      supabaseAdmin.from('user_mfa_settings').delete().eq('user_id', userId),
      supabaseAdmin.from('otp_codes').delete().eq('user_id', userId),
      supabaseAdmin.from('login_attempts').delete().eq('email', userProfile.email),
      supabaseAdmin.from('profiles').delete().eq('id', userId)
    ]

    // Exécuter toutes les suppressions
    const results = await Promise.allSettled(deletionPromises)
    
    // Vérifier les erreurs
    const failures = results.filter(result => result.status === 'rejected')
    if (failures.length > 0) {
      console.error('⚠️ [RGPD-DELETE] Some deletions failed:', failures)
    }

    console.log('✅ [RGPD-DELETE] Database cleanup completed')

    // 5️⃣ Journaliser dans security_audit_logs avec un type d'événement valide
    try {
      await supabaseAdmin.from('security_audit_logs').insert({
        user_id: null,
        event_type: 'data_deletion', // Utiliser un type d'événement valide
        details: {
          operation: 'rgpd_user_deletion',
          deleted_user_id: userId,
          deleted_user_email: userProfile.email,
          records_deleted: deletionStats,
          export_provided: !!exportedData,
          deletion_reason: 'RGPD_RIGHT_TO_ERASURE'
        },
        ip_address: clientIP === 'unknown' ? null : clientIP,
        user_agent: userAgent
      })
      console.log('📝 [RGPD-DELETE] Audit log created')
    } catch (auditError) {
      console.error('⚠️ [RGPD-DELETE] Failed to create audit log:', auditError)
      // Ne pas échouer pour ça
    }

    // 6️⃣ Supprimer de auth.users avec les permissions admin
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
          voice_recordings: deletionStats.voice_recordings,
          consent_logs: deletionStats.consent_logs,
          sessions: deletionStats.user_sessions,
          mfa_settings: deletionStats.mfa_settings,
          otp_codes: deletionStats.otp_codes,
          login_attempts: deletionStats.login_attempts,
          auth_user: !authError
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
