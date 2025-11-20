/* duplicate-filter.js - evita duplicados por QR (o 'desconocido') y por bbox cercano */
const lastEvents = {};
const WINDOW_MS = 2000; // 2 segundos

function bboxCenter(box) {
  return [box.x + box.w/2, box.y + box.h/2];
}

function distance(a,b){
  return Math.hypot(a[0]-b[0], a[1]-b[1]);
}

export function shouldLogEvent(personId, box) {
  const now = Date.now();
  const id = String(personId || 'desconocido');

  if (!lastEvents[id]) {
    lastEvents[id] = { t: now, box };
    return true;
  }

  // si es la misma persona (por id) y tiempo pequeño -> no guardar
  if (now - lastEvents[id].t < WINDOW_MS) {
    // si hay box y distancia muy grande, tratamos como persona distinta
    if (box && lastEvents[id].box) {
      const d = distance(bboxCenter(box), bboxCenter(lastEvents[id].box));
      if (d > 80) { // mucha distancia en px -> tratado como nuevo
        lastEvents[id] = { t: now, box };
        return true;
      }
    }
    return false;
  }

  // tiempo excedido -> cuenta como nuevo
  lastEvents[id] = { t: now, box };
  return true;
}
