
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

    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('🗑️ [DELETE-USER] Starting deletion for user:', userId)

    // 1️⃣ Supprimer les enregistrements vocaux
    console.log('🔍 [DELETE-USER] Deleting voice recordings...')
    const { error: voiceError } = await supabaseAdmin
      .from('voice_recordings')
      .delete()
      .eq('user_id', userId)

    if (voiceError) {
      console.log('⚠️ [DELETE-USER] Voice recordings warning:', voiceError)
    }

    // 2️⃣ Supprimer de la table profiles
    console.log('🔍 [DELETE-USER] Deleting from profiles...')
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.log('⚠️ [DELETE-USER] Profile deletion warning:', profileError)
    }

    // 3️⃣ Supprimer de auth.users avec les permissions admin
    console.log('🔍 [DELETE-USER] Deleting from auth.users...')
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('❌ [DELETE-USER] Auth deletion error:', authError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete user from auth', details: authError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('✅ [DELETE-USER] User completely deleted from both auth.users and profiles')

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('💥 [DELETE-USER] Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
