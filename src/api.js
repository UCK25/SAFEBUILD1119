import { supabase } from './auth.js';

export async function saveLog(record) {
  await supabase.from('logs').insert(record);
}
