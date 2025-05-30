
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

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🧹 [SECURITY_CLEANUP] Démarrage du nettoyage sécurisé quotidien...')

    // Exécuter la fonction de nettoyage
    const { error } = await supabaseClient.rpc('cleanup_expired_security_data')
    
    if (error) {
      console.error('❌ [SECURITY_CLEANUP] Erreur:', error)
      throw error
    }

    console.log('✅ [SECURITY_CLEANUP] Nettoyage terminé avec succès')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Nettoyage sécurisé effectué avec succès',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('💥 [SECURITY_CLEANUP] Erreur critique:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
