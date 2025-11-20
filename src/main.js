/* main.js - Orquesta la app */
import { startCamera, stopCamera, getVideo } from './camera.js';
import { detectEPP, loadDetector } from './epp-detector.js';
import { detectQR } from './qr.js';
import { shouldLogEvent } from './duplicate-filter.js';
import { apiInit, saveLog, listLogs, generateUserQR } from './api.js';
import { authInit, loginDemo, currentUser, logout } from './auth.js';
import { rolesAllowed } from './roles.js';
import { renderLogsTable } from './ui.js';

const loginSection = document.getElementById('loginSection');
const appSection = document.getElementById('appSection');
const btnLogin = document.getElementById('btnLogin');
const btnCreate = document.getElementById('btnCreate');
const btnToggleCam = document.getElementById('btnToggleCam');
const btnDownloadQR = document.getElementById('btnDownloadQR');
const btnViewLogs = document.getElementById('btnViewLogs');
const btnDownloadAllQR = document.getElementById('btnDownloadAllQR');
const status = document.getElementById('status');
const logsDiv = document.getElementById('logs');
const webhookUrlInput = document.getElementById('webhookUrl');
const btnSaveWebhook = document.getElementById('btnSaveWebhook');
const userInfo = document.getElementById('userInfo');

let running = false;
let cameraStarted = false;
let lastQR = null;

async function boot() {
  apiInit();       // inicializa API (local/Supabase)
  authInit();      // inicializa auth (leer storage)
  await loadDetector(); // carga parámetros detector (ligero)

  // si ya hay sesión, loguea
  const u = currentUser();
  if (u) enterApp(u);

  bindEvents();
}

function bindEvents() {
  btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const role = document.getElementById('loginRole').value;
    const user = await loginDemo(email, pass, role);
    enterApp(user);
  });

  btnCreate.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value.trim() || `user${Date.now()}@demo`;
    const pass = document.getElementById('loginPass').value.trim() || '1234';
    const role = document.getElementById('loginRole').value;
    const user = await loginDemo(email, pass, role, { createIfMissing: true });
    enterApp(user);
  });

  btnToggleCam.addEventListener('click', async () => {
    if (!cameraStarted) {
      await startCamera();
      cameraStarted = true;
      btnToggleCam.textContent = 'Detener cámara';
      startLoop();
    } else {
      stopCamera();
      cameraStarted = false;
      btnToggleCam.textContent = 'Iniciar cámara';
      running = false;
    }
  });

  btnDownloadQR.addEventListener('click', async () => {
    const user = currentUser();
    if (!user) return alert('No autenticado');
    const dataUrl = await generateUserQR(user);
    // descargar
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `QR_${user.id || user.email}.png`;
    a.click();
  });

  btnDownloadAllQR.addEventListener('click', async () => {
    const user = currentUser();
    if (!user || user.role !== 'admin') return alert('Solo admin');
    const users = await apiListUsers();
    for (const u of users) {
      const data = await generateUserQR(u);
      // fuerza descarga uno a uno (simple)
      const a = document.createElement('a');
      a.href = data;
      a.download = `QR_${u.id||u.email}.png`;
      a.click();
      await new Promise(r => setTimeout(r, 300));
    }
  });

  btnViewLogs.addEventListener('click', async () => {
    const user = currentUser();
    if (!user) return alert('No autenticado');
    const rows = await listLogs();
    renderLogsTable(rows);
    logsDiv.classList.toggle('hidden');
  });

  btnSaveWebhook.addEventListener('click', () => {
    const url = webhookUrlInput.value.trim();
    if (!url) return alert('Introduce webhook válido o déjalo vacío');
    localStorage.setItem('epp_webhook', url);
    alert('Webhook guardado');
  });
}

function enterApp(user) {
  loginSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  userInfo.textContent = `${user.email} (${user.role})`;
  // si tiene webhook guardado lo muestra
  webhookUrlInput.value = localStorage.getItem('epp_webhook') || '';
  // auto-start camera
  btnToggleCam.click();
}

async function startLoop() {
  running = true;
  const video = getVideo();
  const overlay = document.getElementById('overlay');

  // ajusta canvas al video
  overlay.width = video.videoWidth || 640;
  overlay.height = video.videoHeight || 480;

  async function loop() {
    if (!running) return;
    // 1) QR
    const qr = detectQR(video, overlay);
    if (qr) lastQR = qr;

    // 2) EPP detect
    const det = detectEPP(video, overlay);

    // 3) Si hay alerta, procesar y guardar (dedupe)
    if (det.alert) {
      const who = lastQR || 'desconocido';
      if (shouldLogEvent(who, det.box)) {
        const record = {
          fecha: new Date().toISOString(),
          user_qr: who,
          motivo: det.reason,
          casco: det.helmet ? 1 : 0,
          chaleco: det.vest ? 1 : 0,
          bbox: det.box
        };
        await saveLog(record);
        // enviar webhook si configurado
        const webhook = localStorage.getItem('epp_webhook');
        if (webhook) {
          fetch(webhook, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(record) }).catch(()=>{});
        }
      }
    }

    requestAnimationFrame(loop);
  }
  loop();
}

boot();

/* helper: optional API listing users (only if using remote) */
async function apiListUsers(){
  try {
    // si estás usando Supabase pondrías fetch aquí
    const all = JSON.parse(localStorage.getItem('epp_users') || '[]');
    return all;
  } catch(e) { return []; }
}
