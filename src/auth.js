import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  "TU_URL_SUPABASE",
  "TU_PUBLIC_ANON_KEY"
);

export async function verifySession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUserRole() {
  const session = await verifySession();
  if (!session) return null;

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  return data.role;
}
