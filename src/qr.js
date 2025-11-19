import jsQR from 'jsqr';
import { getVideo } from './camera.js';

export async function detectQR() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.drawImage(getVideo(), 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const qr = jsQR(imageData.data, canvas.width, canvas.height);

  if (qr) return qr.data;
  return null;
}
