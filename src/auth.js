import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://xxxxx.supabase.co',
  'public-anon-key'
);

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
}
