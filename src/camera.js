/* camera.js - Control de la cámara */
const video = document.getElementById('camera');

export async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
    video.srcObject = stream;
    await video.play();
  } catch (err) {
    alert('No se pudo acceder a la cámara: ' + err.message);
    console.error(err);
  }
}

export function stopCamera() {
  try {
    const stream = video.srcObject;
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
  } catch (e) { console.error(e); }
}

export function getVideo() {
  return video;
}
