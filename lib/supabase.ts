import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
    throw new Error('Missing Supabase environment variables');
}

console.log('✅ Supabase client initialized');
console.log('📍 URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection on initialization
supabase
    .from('colleges')
    .select('count')
    .then(({ error }) => {
        if (error) {
            console.error('❌ Supabase connection test failed:', error.message);
        } else {
            console.log('✅ Supabase connected successfully!');
            console.log('📊 Database is accessible');
        }
    });
