/* api.js - capa de persistencia de logs + QR gen
   Por defecto usa localStorage para logs y usuarios. Puedes conectar Supabase
   (léase comentarios) si quieres persistencia remota.
*/
const LOGS_KEY = 'epp_logs';
const USERS_KEY = 'epp_users';

// Inicialización
export function apiInit(){ /* no-op por ahora */ }

// guardar log (local)
export async function saveLog(record) {
  const arr = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
  arr.unshift(record); // último primero
  localStorage.setItem(LOGS_KEY, JSON.stringify(arr));
}

// listar logs
export async function listLogs() {
  return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
}

// generar QR para un usuario (usa qrcode lib global)
export async function generateUserQR(user) {
  // user: { id, email }
  const text = user.id || user.email;
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(text, { width: 300 }, (err, url) => {
      if (err) return reject(err);
      resolve(url);
    });
  });
}

/* Opcional: conectar Supabase
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_KEY = 'public-anon-key';
export async function saveLog(record){
  // usa fetch o supabase-js
}
*/
