const { createClient } = require('@supabase/supabase-js');
const config = require('../../config');

let supabase = null;

const initSupabase = () => {
  if (!config.supabase.url || !config.supabase.serviceKey) {
    console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_KEY son requeridos');
    process.exit(1);
  }

  try {
    supabase = createClient(
      config.supabase.url,
      config.supabase.serviceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    console.log('✅ Supabase cliente inicializado correctamente');
  } catch (error) {
    console.error('❌ Error inicializando Supabase:', error.message);
    process.exit(1);
  }
};

const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase no ha sido inicializado');
  }
  return supabase;
};

module.exports = { initSupabase, getSupabaseClient };