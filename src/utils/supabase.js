import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Without config the app shows a message instead of crashing on import.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

const supabase = createClient(
    isSupabaseConfigured ? supabaseUrl : 'http://localhost',
    isSupabaseConfigured ? supabaseKey : 'missing-anon-key'
);

// Lightweight query used to detect a paused or unreachable project.
export async function checkSupabaseConnection() {
    if (!isSupabaseConfigured) return { ok: false, reason: 'config' };
    try {
        const { error } = await supabase
            .from('assembly_lines_new')
            .select('id')
            .limit(1);
        return error ? { ok: false, reason: 'error', error } : { ok: true };
    } catch (error) {
        return { ok: false, reason: 'error', error };
    }
}

export default supabase
