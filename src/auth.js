import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://wrhgsuuzipsummbilxbg.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyaGdzdXV6aXBzdW1tYmlseGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1ODYxOTAsImV4cCI6MjA3OTE2MjE5MH0.VMARFRK6dE8F7HfdXkeqwHxmRskR7AYOHPpbOT-P3rM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

export async function login(username, password) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) return null;
  return data;
}

export async function createGuestUser(username) {
  const { data, error } = await supabase
    .from("users")
    .insert({
      username,
      password: "123",
      role: "guest"
    })
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function logEPPEvent({ user_id, nombre, motivo, tipo }) {
  await supabase.from("epp_logs").insert({
    user_id,
    nombre,
    motivo,
    tipo
  });
}

export async function getLogs() {
  const { data } = await supabase.from("epp_logs").select("*");
  return data;
}
