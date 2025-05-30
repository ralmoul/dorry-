
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const startTime = Date.now()
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  console.log('🧹 [SECURITY_CLEANUP] Démarrage du nettoyage sécurisé...')

  try {
    const body = await req.json().catch(() => ({}))
    const triggeredBy = body.source || 'manual'
    
    // Compteurs pour le rapport
    let recordsCleaned = {
      otp_codes: 0,
      user_sessions: 0,
      security_logs: 0,
      login_attempts: 0
    }

    // 1. Nettoyer les codes OTP expirés (plus de 24h)
    const { count: otpCleaned, error: otpError } = await supabaseClient
      .from('otp_codes')
      .delete()
      .lt('expires_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (otpError) throw new Error(`Erreur nettoyage OTP: ${otpError.message}`)
    recordsCleaned.otp_codes = otpCleaned || 0

    // 2. Nettoyer les sessions expirées
    const { count: sessionsCleaned, error: sessionsError } = await supabaseClient
      .from('user_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString())

    if (sessionsError) throw new Error(`Erreur nettoyage sessions: ${sessionsError.message}`)
    recordsCleaned.user_sessions = sessionsCleaned || 0

    // 3. Nettoyer les logs de sécurité anciens (plus de 1 an)
    const { count: logsCleaned, error: logsError } = await supabaseClient
      .from('security_audit_logs')
      .delete()
      .lt('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())

    if (logsError) throw new Error(`Erreur nettoyage logs: ${logsError.message}`)
    recordsCleaned.security_logs = logsCleaned || 0

    // 4. Réinitialiser les tentatives de connexion anciennes (plus de 24h)
    const { count: attemptsReset, error: attemptsError } = await supabaseClient
      .from('login_attempts')
      .update({ failed_attempts: 0, blocked_until: null })
      .lt('last_attempt_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (attemptsError) throw new Error(`Erreur reset tentatives: ${attemptsError.message}`)
    recordsCleaned.login_attempts = attemptsReset || 0

    const executionTime = Date.now() - startTime

    // Logger l'exécution réussie
    const { error: logError } = await supabaseClient.rpc('log_cleanup_execution', {
      p_status: 'success',
      p_records_cleaned: recordsCleaned,
      p_duration_ms: executionTime,
      p_error_message: null
    })

    if (logError) {
      console.error('⚠️ [SECURITY_CLEANUP] Erreur lors du logging:', logError)
    }

    console.log('✅ [SECURITY_CLEANUP] Nettoyage terminé avec succès:', {
      recordsCleaned,
      executionTime: `${executionTime}ms`,
      triggeredBy
    })

    // Envoyer rapport de succès si c'est automatique
    if (triggeredBy === 'cron_job') {
      await sendSuccessReport(recordsCleaned, executionTime)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Nettoyage sécurisé effectué avec succès',
        records_cleaned: recordsCleaned,
        execution_time_ms: executionTime,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    const executionTime = Date.now() - startTime
    
    console.error('💥 [SECURITY_CLEANUP] Erreur critique:', error)
    
    // Logger l'échec
    try {
      await supabaseClient.rpc('log_cleanup_execution', {
        p_status: 'failed',
        p_records_cleaned: {},
        p_duration_ms: executionTime,
        p_error_message: error.message
      })
    } catch (logError) {
      console.error('⚠️ [SECURITY_CLEANUP] Impossible de logger l\'erreur:', logError)
    }

    // Envoyer alerte critique
    await sendCriticalAlert(error.message, executionTime)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        execution_time_ms: executionTime,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function sendSuccessReport(recordsCleaned: any, executionTime: number) {
  try {
    const totalCleaned = Object.values(recordsCleaned).reduce((sum: number, count: any) => sum + (count as number), 0)
    
    console.log('📧 [SECURITY_CLEANUP] Envoi du rapport de succès...', {
      totalCleaned,
      executionTime: `${executionTime}ms`
    })

    // Ici vous pouvez intégrer votre service d'email préféré
    // Par exemple, avec Resend, SendGrid, ou l'API Supabase Edge Functions
    
  } catch (error) {
    console.error('⚠️ [SECURITY_CLEANUP] Erreur envoi rapport:', error)
  }
}

async function sendCriticalAlert(errorMessage: string, executionTime: number) {
  try {
    console.log('🚨 [SECURITY_CLEANUP] ALERTE CRITIQUE - Échec du nettoyage:', {
      error: errorMessage,
      executionTime: `${executionTime}ms`,
      timestamp: new Date().toISOString()
    })

    // Envoyer alerte immédiate (email, Slack, etc.)
    // Cette fonction devrait déclencher une notification urgente
    
  } catch (error) {
    console.error('💥 [SECURITY_CLEANUP] Impossible d\'envoyer l\'alerte critique:', error)
  }
}
