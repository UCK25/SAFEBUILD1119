import { getVideo } from './camera.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

export async function loadModel() {
  canvas.width = getVideo().videoWidth;
  canvas.height = getVideo().videoHeight;
}

export async function detectEPP() {
  ctx.drawImage(getVideo(), 0, 0, canvas.width, canvas.height);

  const helmet = true;
  const vest = true;

  let reason = null;
  let alert = false;

  if (!helmet) {
    reason = 'Casco no detectado';
    alert = true;
  }
  if (!vest) {
    reason = 'Chaleco no detectado';
    alert = true;
  }

  return {
    alert,
    helmet,
    vest,
    reason,
    personId: 1
  };
}
