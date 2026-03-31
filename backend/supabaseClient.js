/**
 * Supabase Client Configuration
 * Gunakan untuk Auth dan Realtime operations
 */
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    '❌ [SUPABASE] Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('✅ [SUPABASE] Client initialized');

module.exports = { supabase };