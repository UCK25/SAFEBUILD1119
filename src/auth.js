/* auth.js - gestión de usuarios mínima (localStorage por defecto)
   Estructura usuario: { id, email, password (plain en demo), role }
   Para producción conecta Supabase: pega URL y KEY y descomenta el bloque indicado.
*/

const USERS_KEY = 'epp_users';
const SESSION_KEY = 'epp_session';

// Opcional: configura Supabase aquí si quieres usar nube.
// const SUPABASE_URL = '';
// const SUPABASE_KEY = '';

export function authInit() {
  if (!localStorage.getItem(USERS_KEY)) {
    // crear admin demo por defecto
    const admin = { id: 'admin', email: 'admin@demo', password: 'admin', role: 'admin' };
    localStorage.setItem(USERS_KEY, JSON.stringify([admin]));
  }
}

export function listUsersLocal(){
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function saveUsersLocal(arr){
  localStorage.setItem(USERS_KEY, JSON.stringify(arr));
}

export async function loginDemo(email, password, role='invitado', opts={createIfMissing:false}) {
  // opcional: si SUPABASE_URL configurado, aquí harías login remoto.
  // if (SUPABASE_URL) { ... }

  const users = listUsersLocal();
  let u = users.find(x => x.email === email);
  if (!u && opts.createIfMissing) {
    u = { id: 'u'+Date.now(), email, password, role };
    users.push(u);
    saveUsersLocal(users);
  }
  if (!u) { alert('Usuario no existe. Puedes crear uno con Crear usuario demo.'); return null; }
  if (u.password !== password) { alert('Contraseña incorrecta'); return null; }
  const session = { id: u.id, email: u.email, role: u.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function currentUser(){
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}

export function logout(){
  localStorage.removeItem(SESSION_KEY);
}
