let audioCtx: AudioContext | null = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
}

export function playClick() {
  const ctx = getCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.value = 720;
  g.gain.value = 0.0001;
  o.connect(g); g.connect(ctx.destination);
  const now = ctx.currentTime;
  g.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  o.start(now); o.stop(now + 0.22);
}

export function playChime() {
  const ctx = getCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.value = 440;
  o.connect(g); g.connect(ctx.destination);
  const now = ctx.currentTime;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
  o.start(now); o.stop(now + 1.0);
}

export function playHarvest() {
  const ctx = getCtx();
  const o1 = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const g = ctx.createGain();
  o1.type = 'sine'; o2.type = 'sine';
  o1.frequency.value = 520; o2.frequency.value = 660;
  o1.connect(g); o2.connect(g); g.connect(ctx.destination);
  const now = ctx.currentTime;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  o1.start(now); o2.start(now);
  o1.stop(now + 0.6); o2.stop(now + 0.6);
}

export function playBuy() {
  const ctx = getCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'square'; o.frequency.value = 300;
  o.connect(g); g.connect(ctx.destination);
  const now = ctx.currentTime;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.14, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
  o.start(now); o.stop(now + 0.28);
}

export function resumeAudio() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
}
