import { startCamera } from './camera.js';
import { loadModel, detectFrame } from './camera.js';

async function init() {
  await startCamera();
  await loadModel();
  requestAnimationFrame(detectFrame);
}

init();
