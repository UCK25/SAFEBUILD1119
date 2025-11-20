/* qr.js - utiliza jsQR (global) */
export function detectQR(video, canvas) {
  try {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qr = jsQR(img.data, img.width, img.height);
    if (qr) {
      // dibuja marco
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 3;
      const tl = qr.location.topLeftCorner;
      const br = qr.location.bottomRightCorner;
      ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
      return qr.data;
    }
  } catch (e) {
    // no bloquear si jsQR falla
    console.error('QR detect error', e);
  }
  return null;
}
