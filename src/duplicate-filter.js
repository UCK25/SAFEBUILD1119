const lastEvents = {};
const WINDOW_MS = 2000;

export function shouldLogEvent(personId) {
  const now = Date.now();

  if (!lastEvents[personId]) {
    lastEvents[personId] = now;
    return true;
  }

  if (now - lastEvents[personId] > WINDOW_MS) {
    lastEvents[personId] = now;
    return true;
  }

  return false;
}
