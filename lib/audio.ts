export type FieldAudio = {
  setEnergy: (value: number) => void;
  mention: () => void;
  dispose: () => void;
};

export function createFieldAudio(): FieldAudio | null {
  const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.0;
  master.connect(ctx.destination);

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * 0.35;

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 180;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.18;
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start();

  const drone = ctx.createOscillator();
  drone.type = "sine";
  drone.frequency.value = 55;
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.06;
  drone.connect(droneGain);
  droneGain.connect(master);
  drone.start();

  const unlock = () => {
    if (ctx.state === "suspended") void ctx.resume();
  };
  window.addEventListener("pointerdown", unlock, { once: true });

  return {
    setEnergy(value: number) {
      const v = Math.max(0, Math.min(1, value));
      master.gain.setTargetAtTime(0.22 + v * 0.18, ctx.currentTime, 0.12);
      noiseFilter.frequency.setTargetAtTime(160 + v * 420, ctx.currentTime, 0.08);
    },
    mention() {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = 880;
      g.gain.value = 0.0001;
      osc.connect(g);
      g.connect(master);
      osc.start();
      g.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.stop(ctx.currentTime + 0.4);
    },
    dispose() {
      noise.stop();
      drone.stop();
      void ctx.close();
    },
  };
}
