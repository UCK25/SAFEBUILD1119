const video = document.getElementById('camera');

export async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  return new Promise(resolve => {
    video.onloadedmetadata = () => resolve();
  });
}

export function getVideo() {
  return video;
}
