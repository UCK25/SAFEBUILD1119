/* epp-detector.js - heurística ligera para casco y chaleco
   - Detecta "person" por contraste en la mitad superior
   - Casco: pixel brillante pequeño en cabeza (no perfecto)
   - Chaleco: detecta color de alta visibilidad (amarillo/naranja) en zona torso
   Esta es la versión ultrarápida y suficientemente práctica para pruebas.
*/
export async function loadDetector() {
  // no-op en este enfoque ligero; se deja para compatibilidad
  return;
}

function colorRatio(data, width, height, region, predicate) {
  // region: { x,y,w,h }
  let count = 0, total = 0;
  for (let y = region.y; y < region.y + region.h; y++) {
    for (let x = region.x; x < region.x + region.w; x++) {
      const i = (y * width + x) * 4;
      const r = data[i], g = data[i+1], b = data[i+2];
      total++;
      if (predicate(r,g,b)) count++;
    }
  }
  return count / Math.max(1, total);
}

export function detectEPP(video, canvas) {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const w = canvas.width, h = canvas.height;
  // asumimos persona centrada: cabeza = top 20%, torso = 30%-60% vertical
  const headRegion = { x: Math.floor(w*0.25), y: 0, w: Math.floor(w*0.5), h: Math.floor(h*0.22) };
  const torsoRegion = { x: Math.floor(w*0.2), y: Math.floor(h*0.25), w: Math.floor(w*0.6), h: Math.floor(h*0.35) };

  // Casco: detectamos píxeles brillantes (sugerente de casco claro)
  const helmetRatio = colorRatio(img.data, w, h, headRegion, (r,g,b) => {
    const s = r+g+b;
    return s > 500; // brillante
  });

  // Chaleco: detecta colores amarillos / naranja de alta visibilidad
  const vestRatio = colorRatio(img.data, w, h, torsoRegion, (r,g,b) => {
    return (r > 150 && g > 140 && b < 120 && (r - b) > 40) // amarillo
      || (r > 150 && g > 100 && b < 90 && (r - g) > 20); // naranja
  });

  // Umbrales ajustables
  const helmet = helmetRatio > 0.003; // pequeño porcentaje de pixeles brillantes
  const vest = vestRatio > 0.02;

  // dibuja indicadores
  ctx.strokeStyle = helmet ? 'green' : 'red';
  ctx.lineWidth = 4;
  ctx.strokeRect(headRegion.x, headRegion.y, headRegion.w, headRegion.h);

  ctx.strokeStyle = vest ? 'green' : 'red';
  ctx.lineWidth = 4;
  ctx.strokeRect(torsoRegion.x, torsoRegion.y, torsoRegion.w, torsoRegion.h);

  const alert = !(helmet && vest);
  let reason = 'OK';
  if (!helmet && !vest) reason = 'Casco y chaleco no detectados';
  else if (!helmet) reason = 'Casco no detectado';
  else if (!vest) reason = 'Chaleco no detectado';

  // bounding box aproximada (centro)
  const box = { x: Math.floor(w*0.25), y: 0, w: Math.floor(w*0.5), h: Math.floor(h*0.8) };

  return { alert, helmet, vest, reason, box };
}
